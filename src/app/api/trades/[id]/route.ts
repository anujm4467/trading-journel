import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/trades/[id] - Get a specific trade
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const trade = await prisma.trade.findUnique({
      where: { id },
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

    if (!trade) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(trade)
  } catch (error) {
    console.error('Error fetching trade:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trade' },
      { status: 500 }
    )
  }
}

// PUT /api/trades/[id] - Update a trade
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { id: tradeId } = await params

    // Check if trade exists
    const existingTrade = await prisma.trade.findUnique({
      where: { id: tradeId }
    })

    if (!existingTrade) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      )
    }

    // Calculate updated values
    const entryValue = body.quantity * body.entryPrice
    const exitValue = body.exitPrice ? body.quantity * body.exitPrice : null
    const turnover = entryValue + (exitValue || 0)
    
    // Calculate gross P&L based on position
    let grossPnl = null
    if (exitValue) {
      if (body.position === 'BUY') {
        grossPnl = exitValue - entryValue
      } else {
        grossPnl = entryValue - exitValue
      }
    }
    
    const netPnl = grossPnl ? grossPnl - (body.totalCharges || 0) : null
    const percentageReturn = grossPnl ? (grossPnl / entryValue) * 100 : null

    // Update trade with capital pool handling
    const updatedTrade = await prisma.$transaction(async (tx) => {
      // Update the trade
      const updated = await tx.trade.update({
        where: { id: tradeId },
        data: {
          tradeType: body.tradeType,
          symbol: body.symbol,
          instrument: body.instrument,
          position: body.position,
          quantity: body.quantity,
          entryPrice: body.entryPrice,
          exitPrice: body.exitPrice,
          entryDate: body.entryDate ? new Date(body.entryDate) : undefined,
          exitDate: body.exitDate ? new Date(body.exitDate) : undefined,
          entryValue,
          exitValue,
          turnover,
          grossPnl,
          netPnl,
          totalCharges: body.totalCharges,
          percentageReturn,
          emotionalState: body.emotionalState,
          marketCondition: body.marketCondition,
          planning: body.planning,
          notes: body.notes,
          stopLoss: body.stopLoss,
          target: body.target,
          confidenceLevel: body.confidenceLevel,
          brokerName: body.brokerName,
          customBrokerage: body.customBrokerage,
          brokerageType: body.brokerageType,
          brokerageValue: body.brokerageValue,
          // Psychology & Behavioral Analysis (Optional)
          followedRiskReward: body.followedRiskReward,
          followedIntradayHunter: body.followedIntradayHunter,
          overtrading: body.overtrading,
          waitedForRetracement: body.waitedForRetracement,
          hadPatienceWhileExiting: body.hadPatienceWhileExiting,
          showedGreed: body.showedGreed,
          showedFear: body.showedFear,
          tradedAgainstTrend: body.tradedAgainstTrend,
          psychologyNotes: body.psychologyNotes,
          // Update charges if provided
          ...(body.charges && {
            charges: {
              update: body.charges
            }
          }),
          // Update strategy tags if provided
          ...(body.strategyTags && {
            strategyTags: {
              deleteMany: {},
              create: body.strategyTags.map((tagId: string) => ({
                strategyTagId: tagId
              }))
            }
          }),
          // Update emotional tags if provided
          ...(body.emotionalTags && {
            emotionalTags: {
              deleteMany: {},
              create: body.emotionalTags.map((tagId: string) => ({
                emotionalTagId: tagId
              }))
            }
          }),
          // Update market tags if provided
          ...(body.marketTags && {
            marketTags: {
              deleteMany: {},
              create: body.marketTags.map((tagId: string) => ({
                marketTagId: tagId
              }))
            }
          }),
          // Update options trade if provided
          ...(body.instrument === 'OPTIONS' && body.optionType && {
            optionsTrade: {
              upsert: {
                create: {
                  optionType: body.optionType,
                  strikePrice: body.strikePrice || 0,
                  expiryDate: body.expiryDate ? new Date(body.expiryDate) : new Date(),
                  lotSize: body.lotSize || 50,
                  underlying: body.symbol
                },
                update: {
                  optionType: body.optionType,
                  strikePrice: body.strikePrice || 0,
                  expiryDate: body.expiryDate ? new Date(body.expiryDate) : new Date(),
                  lotSize: body.lotSize || 50,
                  underlying: body.symbol
                }
              }
            }
          }),
          // Update hedge position if provided
          ...(body.hasHedgePosition && {
            hedgePosition: {
              upsert: {
                create: {
                  position: body.hedgePosition || 'BUY',
                  entryDate: body.hedgeEntryDate ? new Date(body.hedgeEntryDate) : new Date(),
                  entryPrice: body.hedgeEntryPrice || 0,
                  quantity: body.hedgeQuantity || 0,
                  exitDate: body.hedgeExitDate ? new Date(body.hedgeExitDate) : undefined,
                  exitPrice: body.hedgeExitPrice,
                  entryValue: (body.hedgeEntryPrice || 0) * (body.hedgeQuantity || 0),
                  exitValue: body.hedgeExitPrice ? body.hedgeExitPrice * (body.hedgeQuantity || 0) : undefined,
                  notes: body.hedgeNotes
                },
                update: {
                  position: body.hedgePosition || 'BUY',
                  entryDate: body.hedgeEntryDate ? new Date(body.hedgeEntryDate) : new Date(),
                  entryPrice: body.hedgeEntryPrice || 0,
                  quantity: body.hedgeQuantity || 0,
                  exitDate: body.hedgeExitDate ? new Date(body.hedgeExitDate) : undefined,
                  exitPrice: body.hedgeExitPrice,
                  entryValue: (body.hedgeEntryPrice || 0) * (body.hedgeQuantity || 0),
                  exitValue: body.hedgeExitPrice ? body.hedgeExitPrice * (body.hedgeQuantity || 0) : undefined,
                  notes: body.hedgeNotes
                }
              }
            }
          })
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

      // Handle capital pool transactions if trade is being exited (after main transaction)
      if (body.exitPrice && !existingTrade.exitPrice && body.capitalPoolId) {
        // Trade is being closed - handle based on trade type
        const capitalPool = await prisma.capitalPool.findUnique({
          where: { id: body.capitalPoolId }
        })

        if (capitalPool) {
          // For options intraday trades, only add P&L (no investment tracking)
          if (body.tradeType === 'INTRADAY' && body.instrument === 'OPTIONS') {
            if (netPnl !== null) {
              const pnlTransactionType = netPnl >= 0 ? 'PROFIT' : 'LOSS'
              const pnlAmount = Math.abs(netPnl)
              
              await prisma.capitalTransaction.create({
                data: {
                  poolId: body.capitalPoolId,
                  transactionType: pnlTransactionType,
                  amount: pnlAmount,
                  description: `Options Intraday P&L: ${body.symbol} - ${netPnl >= 0 ? 'Profit' : 'Loss'}`,
                  referenceId: tradeId,
                  referenceType: 'TRADE',
                  balanceAfter: capitalPool.currentAmount + netPnl
                }
              })

              // Add P&L to capital pool
              await prisma.capitalPool.update({
                where: { id: body.capitalPoolId },
                data: {
                  currentAmount: capitalPool.currentAmount + netPnl,
                  totalPnl: capitalPool.totalPnl + netPnl
                }
              })
            }
          } else {
            // For other trades, return invested amount and add P&L
            const investedAmount = entryValue
            
            // Create P&L transaction
            if (netPnl !== null) {
              const pnlTransactionType = netPnl >= 0 ? 'PROFIT' : 'LOSS'
              const pnlAmount = Math.abs(netPnl)
              
              await prisma.capitalTransaction.create({
                data: {
                  poolId: body.capitalPoolId,
                  transactionType: pnlTransactionType,
                  amount: pnlAmount,
                  description: `Trade P&L: ${body.symbol} - ${netPnl >= 0 ? 'Profit' : 'Loss'}`,
                  referenceId: tradeId,
                  referenceType: 'TRADE',
                  balanceAfter: capitalPool.currentAmount + investedAmount + netPnl
                }
              })
            }

            // Return invested amount back to capital pool and add P&L
            await prisma.capitalPool.update({
              where: { id: body.capitalPoolId },
              data: {
                currentAmount: capitalPool.currentAmount + investedAmount + (netPnl || 0),
                totalInvested: capitalPool.totalInvested - investedAmount, // Remove from invested
                totalPnl: capitalPool.totalPnl + (netPnl || 0)
              }
            })
          }
        }
      }

      return updated
    })

    return NextResponse.json(updatedTrade)
  } catch (error) {
    console.error('Error updating trade:', error)
    return NextResponse.json(
      { error: 'Failed to update trade' },
      { status: 500 }
    )
  }
}

// DELETE /api/trades/[id] - Delete a trade
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tradeId } = await params

    // Check if trade exists
    const existingTrade = await prisma.trade.findUnique({
      where: { id: tradeId }
    })

    if (!existingTrade) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      )
    }

    // Delete trade (charges and tags will be deleted due to cascade)
    await prisma.trade.delete({
      where: { id: tradeId }
    })

    return NextResponse.json({ message: 'Trade deleted successfully' })
  } catch (error) {
    console.error('Error deleting trade:', error)
    return NextResponse.json(
      { error: 'Failed to delete trade' },
      { status: 500 }
    )
  }
}
