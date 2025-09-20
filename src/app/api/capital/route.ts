import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

// GET /api/capital - Get all capital pools and allocation
export async function GET() {
  try {
    const pools = await prisma.capitalPool.findMany({
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    // Calculate allocation summary
    const totalPool = pools.find(p => p.poolType === 'TOTAL')
    const equityPool = pools.find(p => p.poolType === 'EQUITY')
    const fnoPool = pools.find(p => p.poolType === 'FNO')

    const allocation = {
      totalCapital: totalPool?.currentAmount || 0,
      equityCapital: equityPool?.currentAmount || 0,
      fnoCapital: fnoPool?.currentAmount || 0,
      availableEquity: equityPool?.currentAmount || 0,
      availableFno: fnoPool?.currentAmount || 0,
      totalPnl: totalPool?.totalPnl || 0,
      equityPnl: equityPool?.totalPnl || 0,
      fnoPnl: fnoPool?.totalPnl || 0,
      totalReturn: totalPool ? (totalPool.totalPnl / totalPool.initialAmount) * 100 : 0,
      equityReturn: equityPool ? (equityPool.totalPnl / equityPool.initialAmount) * 100 : 0,
      fnoReturn: fnoPool ? (fnoPool.totalPnl / fnoPool.initialAmount) * 100 : 0,
      // Add invested amounts from the database
      totalInvested: totalPool?.totalInvested || 0,
      equityInvested: equityPool?.totalInvested || 0,
      fnoInvested: fnoPool?.totalInvested || 0
    }

    return NextResponse.json({
      success: true,
      data: {
        pools,
        allocation
      }
    })
  } catch (error) {
    console.error('Error fetching capital data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch capital data' },
      { status: 500 }
    )
  }
}

// POST /api/capital - Create or update capital pools
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { totalAmount, equityAmount, fnoAmount, description } = body

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Total amount must be greater than 0' },
        { status: 400 }
      )
    }

    if (!equityAmount || equityAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Equity amount must be greater than 0' },
        { status: 400 }
      )
    }

    if (!fnoAmount || fnoAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'F&O amount must be greater than 0' },
        { status: 400 }
      )
    }

    if (equityAmount + fnoAmount > totalAmount) {
      return NextResponse.json(
        { success: false, error: 'Equity and F&O amounts cannot exceed total capital' },
        { status: 400 }
      )
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Check if pools already exist
      const existingPools = await tx.capitalPool.findMany()
      
      if (existingPools.length > 0) {
        // Update existing pools
        const totalPool = existingPools.find(p => p.poolType === 'TOTAL')
        const equityPool = existingPools.find(p => p.poolType === 'EQUITY')
        const fnoPool = existingPools.find(p => p.poolType === 'FNO')

        const updates = []

        if (totalPool) {
          updates.push(
            tx.capitalPool.update({
              where: { id: totalPool.id },
              data: {
                initialAmount: totalAmount,
                currentAmount: totalAmount,
                description
              }
            })
          )
        }

        if (equityPool) {
          updates.push(
            tx.capitalPool.update({
              where: { id: equityPool.id },
              data: {
                initialAmount: equityAmount,
                currentAmount: equityAmount,
                description: `Equity trading capital (₹${equityAmount.toLocaleString()})`
              }
            })
          )
        }

        if (fnoPool) {
          updates.push(
            tx.capitalPool.update({
              where: { id: fnoPool.id },
              data: {
                initialAmount: fnoAmount,
                currentAmount: fnoAmount,
                description: `F&O trading capital (₹${fnoAmount.toLocaleString()})`
              }
            })
          )
        }

        await Promise.all(updates)
      } else {
        // Create new pools
        await tx.capitalPool.createMany({
          data: [
            {
              name: 'Total Capital',
              poolType: 'TOTAL',
              initialAmount: totalAmount,
              currentAmount: totalAmount,
              description
            },
            {
              name: 'Equity Capital',
              poolType: 'EQUITY',
              initialAmount: equityAmount,
              currentAmount: equityAmount,
              description: `Equity trading capital (₹${equityAmount.toLocaleString()})`
            },
            {
              name: 'F&O Capital',
              poolType: 'FNO',
              initialAmount: fnoAmount,
              currentAmount: fnoAmount,
              description: `F&O trading capital (₹${fnoAmount.toLocaleString()})`
            }
          ]
        })
      }

      // Return updated pools
      return await tx.capitalPool.findMany({
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        },
        orderBy: { createdAt: 'asc' }
      })
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Capital pools updated successfully'
    })
  } catch (error) {
    console.error('Error updating capital pools:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update capital pools' },
      { status: 500 }
    )
  }
}
