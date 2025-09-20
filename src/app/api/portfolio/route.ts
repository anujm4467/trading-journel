import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

// GET /api/portfolio - Get portfolio data
export async function GET() {
  try {
    // Get all open positions (trades without exit price)
    const openPositions = await prisma.trade.findMany({
      where: {
        exitPrice: null
      },
      include: {
        charges: true,
        strategyTags: {
          include: {
            strategyTag: true
          }
        }
      }
    })

    // Get all closed positions for historical data
    const closedPositions = await prisma.trade.findMany({
      where: {
        exitPrice: { not: null }
      },
      include: {
        charges: true
      }
    })

    // Calculate current portfolio value
    let totalCurrentValue = 0
    let totalInvested = 0
    let unrealizedPnl = 0

    const positionSummary = openPositions.map(position => {
      const invested = position.quantity * position.entryPrice
      const currentValue = position.quantity * (position.exitPrice || position.entryPrice)
      const pnl = currentValue - invested
      
      totalCurrentValue += currentValue
      totalInvested += invested
      unrealizedPnl += pnl

      return {
        id: position.id,
        symbol: position.symbol,
        instrumentType: position.instrument,
        side: position.position,
        quantity: position.quantity,
        entryPrice: position.entryPrice,
        currentPrice: position.exitPrice || position.entryPrice,
        invested,
        currentValue,
        pnl,
        pnlPercentage: invested > 0 ? (pnl / invested) * 100 : 0,
        entryDate: position.entryDate,
        strategy: position.strategyTags?.[0]?.strategyTag?.name || null
      }
    })

    // Calculate realized P&L from closed positions
    let realizedPnl = 0
    closedPositions.forEach(trade => {
      if (trade.exitPrice) {
        const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
        const netPnl = grossPnl - (trade.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0)
        realizedPnl += netPnl
      }
    })

    // Calculate total P&L
    const totalPnl = realizedPnl + unrealizedPnl

    // Calculate portfolio allocation by instrument type
    const allocation = positionSummary.reduce((acc, position) => {
      const type = position.instrumentType
      if (!acc[type]) {
        acc[type] = { count: 0, value: 0, percentage: 0 }
      }
      acc[type].count += 1
      acc[type].value += position.currentValue
      return acc
    }, {} as Record<string, { count: number; value: number; percentage: number }>)

    // Calculate percentages
    Object.keys(allocation).forEach(type => {
      allocation[type].percentage = totalCurrentValue > 0 ? 
        (allocation[type].value / totalCurrentValue) * 100 : 0
    })

    // Calculate risk metrics
    const totalExposure = positionSummary.reduce((sum, pos) => sum + pos.currentValue, 0)
    const maxSinglePosition = Math.max(...positionSummary.map(pos => pos.currentValue), 0)
    const concentrationRisk = totalExposure > 0 ? (maxSinglePosition / totalExposure) * 100 : 0

    // Get recent trades for activity
    const recentTrades = await prisma.trade.findMany({
      orderBy: { entryDate: 'desc' },
      take: 10,
      include: {
        charges: true,
        strategyTags: {
          include: {
            strategyTag: true
          }
        }
      }
    })

    // Calculate performance by strategy
    const strategyPerformance = await prisma.trade.findMany({
      where: {
        strategyTags: {
          some: {}
        }
      },
      include: {
        strategyTags: {
          include: {
            strategyTag: true
          }
        }
      }
    })

    // Group by strategy tags
    const strategyMap = new Map<string, {
      count: number;
      avgQuantity: number;
    }>()

    strategyPerformance.forEach(trade => {
      trade.strategyTags.forEach(tag => {
        const strategyName = tag.strategyTag.name
        const existing = strategyMap.get(strategyName) || {
          count: 0,
          avgQuantity: 0
        }
        
        existing.count += 1
        existing.avgQuantity += trade.quantity
        
        strategyMap.set(strategyName, existing)
      })
    })

    const strategyPerformanceData = Array.from(strategyMap.entries()).map(([strategy, data]) => ({
      strategy,
      _count: data.count,
      _avg: {
        quantity: data.avgQuantity / data.count
      }
    }))

    return NextResponse.json({
      summary: {
        totalPositions: openPositions.length,
        totalCurrentValue: Math.round(totalCurrentValue * 100) / 100,
        totalInvested: Math.round(totalInvested * 100) / 100,
        unrealizedPnl: Math.round(unrealizedPnl * 100) / 100,
        realizedPnl: Math.round(realizedPnl * 100) / 100,
        totalPnl: Math.round(totalPnl * 100) / 100,
        totalReturn: totalInvested > 0 ? Math.round((totalPnl / totalInvested) * 100 * 100) / 100 : 0
      },
      positions: positionSummary,
      allocation,
      riskMetrics: {
        totalExposure: Math.round(totalExposure * 100) / 100,
        maxSinglePosition: Math.round(maxSinglePosition * 100) / 100,
        concentrationRisk: Math.round(concentrationRisk * 100) / 100
      },
      recentTrades: recentTrades.map(trade => ({
        id: trade.id,
        symbol: trade.symbol,
        side: trade.position,
        quantity: trade.quantity,
        entryPrice: trade.entryPrice,
        exitPrice: trade.exitPrice,
        entryDate: trade.entryDate,
        exitDate: trade.exitDate,
        strategy: trade.strategyTags?.[0]?.strategyTag?.name || null,
        pnl: trade.exitPrice ? 
          Math.round(((trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1) - (trade.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0)) * 100) / 100 : 
          null
      })),
      strategyPerformance: strategyPerformanceData
    })
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio data' },
      { status: 500 }
    )
  }
}
