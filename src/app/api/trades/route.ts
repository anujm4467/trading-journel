import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { z } from 'zod'

// Validation schemas
const tradeSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  instrument: z.enum(['EQUITY', 'FUTURES', 'OPTIONS']),
  position: z.enum(['BUY', 'SELL', 'LONG', 'SHORT']),
  quantity: z.number().positive('Quantity must be positive'),
  entryPrice: z.number().positive('Entry price must be positive'),
  exitPrice: z.number().optional(),
  entryDate: z.string().datetime(),
  exitDate: z.string().datetime().optional(),
  emotionalState: z.string().optional(),
  notes: z.string().optional(),
  stopLoss: z.number().optional(),
  target: z.number().optional(),
  confidenceLevel: z.number().min(1).max(10).optional(),
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
        { symbol: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } }
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
            name: { contains: strategy, mode: 'insensitive' }
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

    // Calculate charges if not provided
    let charges = validatedData.charges
    if (!charges) {
      const turnover = validatedData.quantity * validatedData.entryPrice
      const sellValue = validatedData.position === 'SELL' ? turnover : 0
      
      charges = {
        brokerage: turnover * 0.0001, // 0.01%
        stt: sellValue * 0.001, // 0.1% on sell value
        exchange: turnover * 0.0000173, // 0.00173%
        sebi: turnover * 0.000001, // 0.0001%
        stampDuty: turnover * 0.00003, // 0.003%
        gst: 0, // Will be calculated on brokerage
        total: 0 // Will be calculated
      }
      
      charges.gst = charges.brokerage * 0.18 // 18% GST on brokerage
      charges.total = Object.values(charges).reduce((sum, val) => sum + val, 0) - charges.gst + charges.gst
    }

    // Create trade with related data
    const trade = await prisma.trade.create({
      data: {
        symbol: validatedData.symbol,
        instrument: validatedData.instrument,
        position: validatedData.position,
        quantity: validatedData.quantity,
        entryPrice: validatedData.entryPrice,
        exitPrice: validatedData.exitPrice,
        entryDate: new Date(validatedData.entryDate),
        exitDate: validatedData.exitDate ? new Date(validatedData.exitDate) : null,
        // Strategy will be handled through strategyTags relationship
        emotionalState: validatedData.emotionalState,
        notes: validatedData.notes,
        stopLoss: validatedData.stopLoss,
        target: validatedData.target,
        confidenceLevel: validatedData.confidenceLevel,
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
              baseAmount: validatedData.position === 'SELL' ? validatedData.quantity * validatedData.entryPrice : 0,
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
        // Tags will be handled through separate relationships
      },
      include: {
        charges: true,
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

    return NextResponse.json(trade, { status: 201 })
  } catch (error) {
    console.error('Error creating trade:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create trade' },
      { status: 500 }
    )
  }
}
