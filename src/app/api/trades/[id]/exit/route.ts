import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { calculateEquityPnL } from '@/utils/calculations'

// Validation schema for exit trade
const exitTradeSchema = z.object({
  exitPrice: z.number().positive('Exit price must be positive'),
  exitDate: z.string().datetime('Invalid exit date format')
})

// POST /api/trades/[id]/exit - Exit a trade
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tradeId } = await params
    const body = await request.json()
    const validatedData = exitTradeSchema.parse(body)

    // Check if trade exists and is not already closed
    const existingTrade = await prisma.trade.findUnique({
      where: { id: tradeId },
      include: {
        charges: true
      }
    })

    if (!existingTrade) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      )
    }

    if (existingTrade.exitPrice) {
      return NextResponse.json(
        { error: 'Trade is already closed' },
        { status: 400 }
      )
    }

    // Calculate P&L using the utility function
    const pnlData = calculateEquityPnL(
      existingTrade.entryPrice,
      existingTrade.quantity,
      validatedData.exitPrice,
      validatedData.exitPrice,
      existingTrade.position
    )

    // For equity, no charges are applied as per current regulations
    const charges = {
      brokerage: 0,
      stt: 0,
      exchange: 0,
      sebi: 0,
      stampDuty: 0,
      total: 0
    }

    // Calculate holding duration in minutes
    const entryDate = new Date(existingTrade.entryDate)
    const exitDate = new Date(validatedData.exitDate)
    const holdingDuration = Math.round((exitDate.getTime() - entryDate.getTime()) / (1000 * 60))

    // Update trade with exit information
    const updatedTrade = await prisma.$transaction(async (tx) => {
      // Update the trade
      const updated = await tx.trade.update({
        where: { id: tradeId },
        data: {
          exitPrice: validatedData.exitPrice,
          exitDate: exitDate,
          exitValue: pnlData.exitValue,
          grossPnl: pnlData.grossPnl,
          netPnl: pnlData.netPnl,
          totalCharges: charges.total,
          percentageReturn: pnlData.percentageReturn,
          holdingDuration: holdingDuration,
          // Update charges to reflect exit charges (all zero for equity)
          charges: {
            deleteMany: {},
            create: [
              {
                chargeType: 'BROKERAGE',
                rate: 0,
                baseAmount: pnlData.exitValue,
                amount: charges.brokerage,
                description: 'Brokerage charges (equity - no charges)'
              },
              {
                chargeType: 'STT',
                rate: 0,
                baseAmount: pnlData.exitValue,
                amount: charges.stt,
                description: 'Securities Transaction Tax (equity - no charges)'
              },
              {
                chargeType: 'EXCHANGE',
                rate: 0,
                baseAmount: pnlData.exitValue,
                amount: charges.exchange,
                description: 'Exchange charges (equity - no charges)'
              },
              {
                chargeType: 'SEBI',
                rate: 0,
                baseAmount: pnlData.exitValue,
                amount: charges.sebi,
                description: 'SEBI charges (equity - no charges)'
              },
              {
                chargeType: 'STAMP_DUTY',
                rate: 0,
                baseAmount: pnlData.exitValue,
                amount: charges.stampDuty,
                description: 'Stamp duty (equity - no charges)'
              }
            ]
          }
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

      // Handle capital pool transactions if trade has a capital pool
      if ((existingTrade as any).capitalPoolId) {
        const capitalPool = await tx.capitalPool.findUnique({
          where: { id: (existingTrade as any).capitalPoolId }
        })

        if (capitalPool) {
          // For equity positional trades, return invested amount and add P&L
          const investedAmount = existingTrade.entryValue
          
          // Create P&L transaction
          if (pnlData.netPnl !== null) {
            const pnlTransactionType = pnlData.netPnl >= 0 ? 'PROFIT' : 'LOSS'
            const pnlAmount = Math.abs(pnlData.netPnl)
            
            await tx.capitalTransaction.create({
              data: {
                poolId: (existingTrade as any).capitalPoolId,
                transactionType: pnlTransactionType,
                amount: pnlAmount,
                description: `Equity Position Exit: ${existingTrade.symbol} - ${pnlData.netPnl >= 0 ? 'Profit' : 'Loss'}`,
                referenceId: tradeId,
                referenceType: 'TRADE',
                balanceAfter: capitalPool.currentAmount + investedAmount + pnlData.netPnl
              }
            })

            // Return invested amount back to capital pool and add P&L
            await tx.capitalPool.update({
              where: { id: (existingTrade as any).capitalPoolId },
              data: {
                currentAmount: capitalPool.currentAmount + investedAmount + pnlData.netPnl,
                totalInvested: capitalPool.totalInvested - investedAmount, // Remove from invested
                totalPnl: capitalPool.totalPnl + pnlData.netPnl
              }
            })
          }
        }
      }

      return updated
    })

    return NextResponse.json({
      success: true,
      trade: updatedTrade,
      pnl: {
        grossPnl: pnlData.grossPnl,
        netPnl: pnlData.netPnl,
        percentageReturn: pnlData.percentageReturn,
        charges: charges
      }
    })

  } catch (error) {
    console.error('Error exiting trade:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to exit trade', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
