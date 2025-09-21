import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSymbolSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').optional(),
  industry: z.string().optional(),
  series: z.string().optional(),
  isinCode: z.string().optional(),
  isActive: z.boolean().optional(),
  source: z.enum(['MANUAL', 'CSV_IMPORT', 'API']).optional()
})

// GET /api/symbols/[id] - Get a specific symbol
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const symbol = await prisma.stockSymbol.findUnique({
      where: { id }
    })

    if (!symbol) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Symbol not found' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: symbol
    })
  } catch (error) {
    console.error('Error fetching symbol:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch symbol',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PATCH /api/symbols/[id] - Update a specific symbol
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateSymbolSchema.parse(body)

    // Check if symbol exists
    const existingSymbol = await prisma.stockSymbol.findUnique({
      where: { id }
    })

    if (!existingSymbol) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Symbol not found' 
        },
        { status: 404 }
      )
    }

    const updatedSymbol = await prisma.stockSymbol.update({
      where: { id },
      data: validatedData
    })

    return NextResponse.json({
      success: true,
      data: updatedSymbol,
      message: 'Symbol updated successfully'
    })
  } catch (error) {
    console.error('Error updating symbol:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation error',
          details: error.issues
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update symbol',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/symbols/[id] - Delete a specific symbol
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if symbol exists
    const existingSymbol = await prisma.stockSymbol.findUnique({
      where: { id }
    })

    if (!existingSymbol) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Symbol not found' 
        },
        { status: 404 }
      )
    }

    // Check if symbol is being used in any trades
    const tradesUsingSymbol = await prisma.trade.count({
      where: { symbol: existingSymbol.symbol }
    })

    if (tradesUsingSymbol > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete symbol',
          details: `Symbol '${existingSymbol.symbol}' is being used in ${tradesUsingSymbol} trade(s). Please deactivate it instead.`
        },
        { status: 409 }
      )
    }

    await prisma.stockSymbol.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Symbol deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting symbol:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete symbol',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
