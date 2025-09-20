import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

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

    // Update trade
    const updatedTrade = await prisma.trade.update({
      where: { id: tradeId },
      data: {
        symbol: body.symbol,
        instrument: body.instrument,
        position: body.position,
        quantity: body.quantity,
        entryPrice: body.entryPrice,
        exitPrice: body.exitPrice,
        entryDate: body.entryDate ? new Date(body.entryDate) : undefined,
        exitDate: body.exitDate ? new Date(body.exitDate) : undefined,
        // Strategy will be handled through strategyTags relationship
        emotionalState: body.emotionalState,
        notes: body.notes,
        stopLoss: body.stopLoss,
        target: body.target,
        confidenceLevel: body.confidenceLevel,
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
        })
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
