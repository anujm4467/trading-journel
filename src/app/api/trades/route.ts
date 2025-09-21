import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { z } from 'zod'

// Validation schemas
const tradeSchema = z.object({
  tradeType: z.enum(['INTRADAY', 'POSITIONAL']).optional(),
  symbol: z.string().min(1, 'Symbol is required'),
  instrument: z.enum(['EQUITY', 'FUTURES', 'OPTIONS']),
  position: z.enum(['BUY', 'SELL']),
  quantity: z.number().positive('Quantity must be positive'),
  entryPrice: z.number().positive('Entry price must be positive'),
  exitPrice: z.number().optional(),
  entryDate: z.string().datetime(),
  exitDate: z.string().datetime().optional(),
  capitalPoolId: z.string().min(1, 'Capital pool is required'),
  emotionalState: z.string().optional(),
  marketCondition: z.string().optional(),
  planning: z.string().optional(),
  notes: z.string().optional(),
  stopLoss: z.number().optional(),
  target: z.number().optional(),
  confidenceLevel: z.number().min(1).max(10).optional(),
  brokerName: z.string().optional(),
  customBrokerage: z.boolean().optional(),
  brokerageType: z.string().optional(),
  brokerageValue: z.number().optional(),
  // Options specific
  optionType: z.enum(['CALL', 'PUT']).optional(),
  strikePrice: z.number().optional(),
  expiryDate: z.string().datetime().optional(),
  lotSize: z.number().optional(),
  underlying: z.string().optional(),
  // Tags
  strategyTagIds: z.array(z.string()).optional(),
  emotionalTagIds: z.array(z.string()).optional(),
  marketTagIds: z.array(z.string()).optional(),
  // Additional fields for compatibility
  side: z.enum(['BUY', 'SELL']).optional(),
  instrumentType: z.enum(['EQUITY', 'FUTURES', 'OPTIONS']).optional(),
  isDraft: z.boolean().optional(),
  // Hedge position fields
  hasHedgePosition: z.boolean().optional(),
  hedgeOptionType: z.enum(['CALL', 'PUT']).optional(),
  hedgeEntryDate: z.string().datetime().optional(),
  hedgeEntryPrice: z.number().optional(),
  hedgeQuantity: z.number().optional(),
  hedgeExitDate: z.string().datetime().optional(),
  hedgeExitPrice: z.number().optional(),
  charges: z.object({
    brokerage: z.number().min(0),
    stt: z.number().min(0),
    exchange: z.number().min(0),
    sebi: z.number().min(0),
    stampDuty: z.number().min(0),
    gst: z.number().min(0),
    total: z.number().min(0)
  }).optional()
})

// GET /api/trades - Get all trades with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const instrumentType = searchParams.get('instrumentType')
    const side = searchParams.get('side')
    const strategy = searchParams.get('strategy')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const sortBy = searchParams.get('sortBy') || 'entryDate'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}
    
    if (search) {
      where.OR = [
        { symbol: { contains: search } },
        { notes: { contains: search } }
      ]
    }
    
    if (instrumentType) {
      where.instrument = instrumentType
    }
    
    if (side) {
      where.position = side
    }
    
    if (strategy) {
      where.strategyTags = {
        some: {
          strategyTag: {
            name: { contains: strategy }
          }
        }
      }
    }
    
    if (dateFrom || dateTo) {
      where.entryDate = {}
      if (dateFrom) where.entryDate.gte = new Date(dateFrom)
      if (dateTo) where.entryDate.lte = new Date(dateTo)
    }

    // Build orderBy clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    const [trades, total] = await Promise.all([
      prisma.trade.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          charges: true,
          optionsTrade: true,
          hedgePosition: {
            include: {
              charges: true
            }
          },
          strategyTags: {
            include: {
              strategyTag: true
            }
          },
          emotionalTags: {
            include: {
              emotionalTag: true
            }
          },
          marketTags: {
            include: {
              marketTag: true
            }
          }
        }
      }),
      prisma.trade.count({ where })
    ])

    return NextResponse.json({
      trades,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching trades:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trades' },
      { status: 500 }
    )
  }
}

// POST /api/trades - Create a new trade
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = tradeSchema.parse(body)

    // Map position and instrument fields for compatibility
    const position = validatedData.position || validatedData.side || 'BUY'
    const instrument = validatedData.instrument || validatedData.instrumentType || 'EQUITY'

    // Check for duplicate trades within the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    const duplicateTrade = await prisma.trade.findFirst({
      where: {
        symbol: validatedData.symbol,
        position: position as 'BUY' | 'SELL',
        instrument: instrument as 'EQUITY' | 'FUTURES' | 'OPTIONS',
        quantity: validatedData.quantity,
        entryPrice: validatedData.entryPrice,
        entryDate: {
          gte: fiveMinutesAgo
        },
        createdAt: {
          gte: fiveMinutesAgo
        }
      }
    })

    if (duplicateTrade) {
      return NextResponse.json(
        { 
          error: 'Duplicate trade detected', 
          details: 'A similar trade was created recently. Please wait before creating another identical trade.',
          duplicateTradeId: duplicateTrade.id
        },
        { status: 409 }
      )
    }

    // Use charges from the form as-is (no recalculation)
    const charges = validatedData.charges || {
      brokerage: 0,
      stt: 0,
      exchange: 0,
      sebi: 0,
      stampDuty: 0,
      gst: 0,
      total: 0
    }

    // Calculate required fields
    const entryValue = validatedData.quantity * validatedData.entryPrice
    const exitValue = validatedData.exitPrice ? validatedData.quantity * validatedData.exitPrice : null
    const turnover = entryValue + (exitValue || 0)
    
    // Calculate gross P&L based on position
    let grossPnl = null
    if (exitValue) {
      if (position === 'BUY') {
        grossPnl = exitValue - entryValue
      } else {
        grossPnl = entryValue - exitValue
      }
    }
    
    const netPnl = grossPnl ? grossPnl - charges.total : null
    const percentageReturn = grossPnl ? (grossPnl / entryValue) * 100 : null

    // Handle tag creation separately
    const strategyTagIds: string[] = []
    if (validatedData.strategyTagIds && validatedData.strategyTagIds.length > 0) {
      for (const tagNameOrId of validatedData.strategyTagIds) {
        // Check if it's an ID or a name
        let strategyTagId = tagNameOrId
        
        // If it's not a valid UUID/CUID, treat it as a name
        if (!/^[a-zA-Z0-9_-]{20,}$/.test(tagNameOrId)) {
          // Find or create the tag by name
          const existingTag = await prisma.strategyTag.findFirst({
            where: { name: tagNameOrId }
          })
          
          if (existingTag) {
            strategyTagId = existingTag.id
          } else {
            // Create new tag
            const newTag = await prisma.strategyTag.create({
              data: {
                name: tagNameOrId,
                description: `Auto-created tag: ${tagNameOrId}`,
                color: '#3B82F6'
              }
            })
            strategyTagId = newTag.id
          }
        }
        strategyTagIds.push(strategyTagId)
      }
    }

    const emotionalTagIds: string[] = []
    if (validatedData.emotionalTagIds && validatedData.emotionalTagIds.length > 0) {
      for (const tagNameOrId of validatedData.emotionalTagIds) {
        let emotionalTagId = tagNameOrId
        
        if (!/^[a-zA-Z0-9_-]{20,}$/.test(tagNameOrId)) {
          const existingTag = await prisma.emotionalTag.findFirst({
            where: { name: tagNameOrId }
          })
          
          if (existingTag) {
            emotionalTagId = existingTag.id
          } else {
            const newTag = await prisma.emotionalTag.create({
              data: {
                name: tagNameOrId,
                description: `Auto-created tag: ${tagNameOrId}`,
                color: '#8B5CF6'
              }
            })
            emotionalTagId = newTag.id
          }
        }
        emotionalTagIds.push(emotionalTagId)
      }
    }

    const marketTagIds: string[] = []
    if (validatedData.marketTagIds && validatedData.marketTagIds.length > 0) {
      for (const tagNameOrId of validatedData.marketTagIds) {
        let marketTagId = tagNameOrId
        
        if (!/^[a-zA-Z0-9_-]{20,}$/.test(tagNameOrId)) {
          const existingTag = await prisma.marketTag.findFirst({
            where: { name: tagNameOrId }
          })
          
          if (existingTag) {
            marketTagId = existingTag.id
          } else {
            const newTag = await prisma.marketTag.create({
              data: {
                name: tagNameOrId,
                description: `Auto-created tag: ${tagNameOrId}`,
                color: '#10B981'
              }
            })
            marketTagId = newTag.id
          }
        }
        marketTagIds.push(marketTagId)
      }
    }

    // Create trade with related data
    const trade = await prisma.trade.create({
      data: {
        tradeType: validatedData.tradeType || 'INTRADAY',
        symbol: validatedData.symbol,
        instrument: instrument as 'EQUITY' | 'FUTURES' | 'OPTIONS',
        position: position as 'BUY' | 'SELL',
        quantity: validatedData.quantity,
        entryPrice: validatedData.entryPrice,
        exitPrice: validatedData.exitPrice,
        entryDate: new Date(validatedData.entryDate),
        exitDate: validatedData.exitDate ? new Date(validatedData.exitDate) : null,
        entryValue,
        exitValue,
        turnover,
        grossPnl,
        netPnl,
        totalCharges: charges.total,
        percentageReturn,
        emotionalState: validatedData.emotionalState,
        marketCondition: validatedData.marketCondition,
        planning: validatedData.planning,
        notes: validatedData.notes,
        stopLoss: validatedData.stopLoss,
        target: validatedData.target,
        confidenceLevel: validatedData.confidenceLevel,
        brokerName: validatedData.brokerName,
        customBrokerage: validatedData.customBrokerage || false,
        brokerageType: validatedData.brokerageType,
        brokerageValue: validatedData.brokerageValue,
        isDraft: validatedData.isDraft || false,
        charges: {
          create: [
            {
              chargeType: 'BROKERAGE',
              rate: 0.0001,
              baseAmount: validatedData.quantity * validatedData.entryPrice,
              amount: charges.brokerage,
              description: 'Brokerage charges'
            },
            {
              chargeType: 'STT',
              rate: 0.001,
              baseAmount: position === 'SELL' ? (exitValue || 0) : 0,
              amount: charges.stt,
              description: 'Securities Transaction Tax'
            },
            {
              chargeType: 'EXCHANGE',
              rate: 0.0000173,
              baseAmount: validatedData.quantity * validatedData.entryPrice,
              amount: charges.exchange,
              description: 'Exchange charges'
            },
            {
              chargeType: 'SEBI',
              rate: 0.000001,
              baseAmount: validatedData.quantity * validatedData.entryPrice,
              amount: charges.sebi,
              description: 'SEBI charges'
            },
            {
              chargeType: 'STAMP_DUTY',
              rate: 0.00003,
              baseAmount: validatedData.quantity * validatedData.entryPrice,
              amount: charges.stampDuty,
              description: 'Stamp duty'
            }
          ]
        },
        // Create options trade if instrument is OPTIONS
        ...(instrument === 'OPTIONS' && validatedData.optionType && validatedData.strikePrice && validatedData.expiryDate ? {
          optionsTrade: {
            create: {
              optionType: validatedData.optionType,
              strikePrice: validatedData.strikePrice,
              expiryDate: new Date(validatedData.expiryDate),
              lotSize: validatedData.lotSize || 50,
              underlying: validatedData.underlying || validatedData.symbol
            }
          }
        } : {}),
        // Create hedge position if enabled
        ...(validatedData.hasHedgePosition && validatedData.hedgeEntryPrice && validatedData.hedgeQuantity ? {
          hedgePosition: {
            create: {
              position: position === 'BUY' ? 'SELL' : 'BUY', // Opposite position
              entryDate: new Date(validatedData.hedgeEntryDate || validatedData.entryDate),
              entryPrice: validatedData.hedgeEntryPrice,
              quantity: validatedData.hedgeQuantity,
              exitDate: validatedData.hedgeExitDate ? new Date(validatedData.hedgeExitDate) : null,
              exitPrice: validatedData.hedgeExitPrice,
              entryValue: validatedData.hedgeQuantity * validatedData.hedgeEntryPrice,
              exitValue: validatedData.hedgeExitPrice ? validatedData.hedgeQuantity * validatedData.hedgeExitPrice : null,
              grossPnl: validatedData.hedgeExitPrice ? 
                (position === 'BUY' ? 
                  (validatedData.hedgeQuantity * validatedData.hedgeExitPrice) - (validatedData.hedgeQuantity * validatedData.hedgeEntryPrice) :
                  (validatedData.hedgeQuantity * validatedData.hedgeEntryPrice) - (validatedData.hedgeQuantity * validatedData.hedgeExitPrice)
                ) : null,
              netPnl: null, // Will be calculated after charges
              totalCharges: 0, // Will be calculated
              percentageReturn: null, // Will be calculated
              notes: `Hedge position for ${validatedData.symbol}`
            }
          }
        } : {}),
        // Create strategy tags relationships
        ...(strategyTagIds.length > 0 ? {
          strategyTags: {
            create: strategyTagIds.map(strategyTagId => ({
              strategyTagId
            }))
          }
        } : {}),
        // Create emotional tags relationships
        ...(emotionalTagIds.length > 0 ? {
          emotionalTags: {
            create: emotionalTagIds.map(emotionalTagId => ({
              emotionalTagId
            }))
          }
        } : {}),
        // Create market tags relationships
        ...(marketTagIds.length > 0 ? {
          marketTags: {
            create: marketTagIds.map(marketTagId => ({
              marketTagId
            }))
          }
        } : {})
      },
      include: {
        charges: true,
        optionsTrade: true,
        hedgePosition: {
          include: {
            charges: true
          }
        },
        strategyTags: {
          include: {
            strategyTag: true
          }
        },
        emotionalTags: {
          include: {
            emotionalTag: true
          }
        },
        marketTags: {
          include: {
            marketTag: true
          }
        }
      }
    })

    // Handle capital pool transactions in a separate transaction to prevent race conditions
    if (validatedData.capitalPoolId) {
      await prisma.$transaction(async (tx) => {
        // Get the capital pool with row-level locking
        const capitalPool = await tx.capitalPool.findUnique({
          where: { id: validatedData.capitalPoolId }
        })

        if (!capitalPool) {
          throw new Error('Capital pool not found')
        }

        // For options intraday trades, if already exited, only handle P&L
        if (validatedData.tradeType === 'INTRADAY' && instrument === 'OPTIONS' && netPnl !== null) {
          // For intraday options that are already closed, only add P&L to capital pool
          const pnlTransactionType = netPnl >= 0 ? 'PROFIT' : 'LOSS'
          const pnlAmount = Math.abs(netPnl)
          
          // Create P&L transaction
          await tx.capitalTransaction.create({
            data: {
              poolId: validatedData.capitalPoolId,
              transactionType: pnlTransactionType,
              amount: pnlAmount,
              description: `Options Intraday P&L: ${validatedData.symbol} - ${netPnl >= 0 ? 'Profit' : 'Loss'}`,
              referenceId: trade.id,
              referenceType: 'TRADE',
              balanceAfter: capitalPool.currentAmount + netPnl
            }
          })

          // Add P&L to capital pool
          await tx.capitalPool.update({
            where: { id: validatedData.capitalPoolId },
            data: {
              currentAmount: capitalPool.currentAmount + netPnl,
              totalPnl: capitalPool.totalPnl + netPnl
            }
          })
        } else {
          // For other trades or open positions, handle normal investment logic
          const investedAmount = entryValue
          
          // Check if there's sufficient balance
          if (capitalPool.currentAmount >= investedAmount) {
            // Create capital transaction for trade investment
            await tx.capitalTransaction.create({
              data: {
                poolId: validatedData.capitalPoolId,
                transactionType: 'WITHDRAWAL',
                amount: investedAmount,
                description: `Trade investment: ${validatedData.symbol} (${position})`,
                referenceId: trade.id,
                referenceType: 'TRADE',
                balanceAfter: capitalPool.currentAmount - investedAmount
              }
            })

            // Update capital pool balance
            await tx.capitalPool.update({
              where: { id: validatedData.capitalPoolId },
              data: {
                currentAmount: capitalPool.currentAmount - investedAmount,
                totalInvested: capitalPool.totalInvested + investedAmount
              }
            })

            // If trade is closed, handle P&L and return invested amount
            if (netPnl !== null) {
              const pnlTransactionType = netPnl >= 0 ? 'PROFIT' : 'LOSS'
              const pnlAmount = Math.abs(netPnl)
              
              // Create P&L transaction
              await tx.capitalTransaction.create({
                data: {
                  poolId: validatedData.capitalPoolId,
                  transactionType: pnlTransactionType,
                  amount: pnlAmount,
                  description: `Trade P&L: ${validatedData.symbol} - ${netPnl >= 0 ? 'Profit' : 'Loss'}`,
                  referenceId: trade.id,
                  referenceType: 'TRADE',
                  balanceAfter: capitalPool.currentAmount - investedAmount + netPnl
                }
              })

              // Return invested amount back to capital pool and add P&L
              await tx.capitalPool.update({
                where: { id: validatedData.capitalPoolId },
                data: {
                  currentAmount: capitalPool.currentAmount - investedAmount + investedAmount + netPnl, // Return invested + P&L
                  totalInvested: capitalPool.totalInvested - investedAmount, // Remove from invested
                  totalPnl: capitalPool.totalPnl + netPnl
                }
              })
            }
          } else {
            throw new Error(`Insufficient capital pool balance. Required: ₹${investedAmount}, Available: ₹${capitalPool.currentAmount}`)
          }
        }
      })
    }

    return NextResponse.json(trade, { status: 201 })
  } catch (error) {
    console.error('Error creating trade:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create trade', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
