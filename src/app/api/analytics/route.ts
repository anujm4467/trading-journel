import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

// GET /api/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const strategy = searchParams.get('strategy')

    // Build date filter
    const dateFilter: Record<string, Date> = {}
    if (dateFrom) dateFilter.gte = new Date(dateFrom)
    if (dateTo) dateFilter.lte = new Date(dateTo)

    // Build where clause
    const where: Record<string, unknown> = {}
    if (Object.keys(dateFilter).length > 0) {
      where.entryDate = dateFilter
    }
    if (strategy) {
      where.strategy = strategy
    }

    // Get all trades for calculations
    const trades = await prisma.trade.findMany({
      where,
      include: {
        charges: true
      }
    })

    // Calculate performance metrics
    const totalTrades = trades.length
    const winningTrades = trades.filter(trade => {
      if (!trade.exitPrice) return false
      const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
      return grossPnl > 0
    }).length

    const losingTrades = trades.filter(trade => {
      if (!trade.exitPrice) return false
      const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
      return grossPnl < 0
    }).length

    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0

    // Calculate P&L
    let totalGrossPnl = 0
    let totalCharges = 0
    let totalNetPnl = 0

    trades.forEach(trade => {
      if (trade.exitPrice) {
        const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
        const tradeCharges = trade.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0
        totalGrossPnl += grossPnl
        totalCharges += tradeCharges
        totalNetPnl += grossPnl - tradeCharges
      }
    })

    // Calculate average win/loss
    const averageWin = winningTrades > 0 ? 
      trades.filter(trade => {
        if (!trade.exitPrice) return false
        const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
        return grossPnl > 0
      }).reduce((sum, trade) => {
        const grossPnl = (trade.exitPrice! - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
        const tradeCharges = trade.charges?.reduce((chargeSum, charge) => chargeSum + charge.amount, 0) || 0
        return sum + grossPnl - tradeCharges
      }, 0) / winningTrades : 0

    const averageLoss = losingTrades > 0 ?
      trades.filter(trade => {
        if (!trade.exitPrice) return false
        const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
        return grossPnl < 0
      }).reduce((sum, trade) => {
        const grossPnl = (trade.exitPrice! - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
        const tradeCharges = trade.charges?.reduce((chargeSum, charge) => chargeSum + charge.amount, 0) || 0
        return sum + grossPnl - tradeCharges
      }, 0) / losingTrades : 0

    // Calculate profit factor
    const totalWins = Math.abs(trades.filter(trade => {
      if (!trade.exitPrice) return false
      const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
      return grossPnl > 0
    }).reduce((sum, trade) => {
      const grossPnl = (trade.exitPrice! - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
      const tradeCharges = trade.charges?.reduce((chargeSum, charge) => chargeSum + charge.amount, 0) || 0
      return sum + grossPnl - tradeCharges
    }, 0))

    const totalLosses = Math.abs(trades.filter(trade => {
      if (!trade.exitPrice) return false
      const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
      return grossPnl < 0
    }).reduce((sum, trade) => {
      const grossPnl = (trade.exitPrice! - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
      const tradeCharges = trade.charges?.reduce((chargeSum, charge) => chargeSum + charge.amount, 0) || 0
      return sum + grossPnl - tradeCharges
    }, 0))

    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : 0

    // Calculate strategy performance
    const strategyPerformance = await prisma.trade.findMany({
      where: {
        ...where,
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
      trades: number;
      totalQuantity: number;
      totalPnl: number;
      winningTrades: number;
    }>()

    strategyPerformance.forEach(trade => {
      trade.strategyTags.forEach(tag => {
        const strategyName = tag.strategyTag.name
        const existing = strategyMap.get(strategyName) || {
          trades: 0,
          totalQuantity: 0,
          totalPnl: 0,
          winningTrades: 0
        }
        
        existing.trades += 1
        existing.totalQuantity += trade.quantity
        existing.totalPnl += trade.netPnl || 0
        if (trade.netPnl && trade.netPnl > 0) {
          existing.winningTrades += 1
        }
        
        strategyMap.set(strategyName, existing)
      })
    })

    const strategyPerformanceData = Array.from(strategyMap.entries()).map(([strategy, data]) => ({
      strategy,
      trades: data.trades,
      winRate: data.trades > 0 ? (data.winningTrades / data.trades) * 100 : 0,
      pnl: data.totalPnl,
      avgPnl: data.trades > 0 ? data.totalPnl / data.trades : 0
    }))

    // Calculate daily P&L for charts
    const dailyPnl = await prisma.trade.findMany({
      where: {
        ...where,
        exitDate: { not: null }
      },
      select: {
        exitDate: true,
        entryPrice: true,
        exitPrice: true,
        quantity: true,
        position: true,
        charges: true
      }
    })

    const dailyPnlMap = new Map<string, number>()
    dailyPnl.forEach(trade => {
      if (trade.exitDate && trade.exitPrice) {
        const date = trade.exitDate.toISOString().split('T')[0]
        const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
        const netPnl = grossPnl - (trade.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0)
        dailyPnlMap.set(date, (dailyPnlMap.get(date) || 0) + netPnl)
      }
    })

    const dailyPnlData = Array.from(dailyPnlMap.entries())
      .map(([date, pnl]) => ({ date, pnl }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Calculate instrument type performance
    const instrumentPerformance = await prisma.trade.groupBy({
      by: ['instrument'],
      where,
      _count: true
    })

    return NextResponse.json({
      overview: {
        totalTrades,
        winningTrades,
        losingTrades,
        winRate: Math.round(winRate * 100) / 100,
        totalGrossPnl: Math.round(totalGrossPnl * 100) / 100,
        totalCharges: Math.round(totalCharges * 100) / 100,
        totalNetPnl: Math.round(totalNetPnl * 100) / 100,
        averageWin: Math.round(averageWin * 100) / 100,
        averageLoss: Math.round(averageLoss * 100) / 100,
        profitFactor: Math.round(profitFactor * 100) / 100
      },
      strategyPerformance: strategyPerformanceData,
      instrumentPerformance,
      dailyPnlData
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
