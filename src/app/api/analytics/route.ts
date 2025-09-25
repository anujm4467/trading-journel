import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { Trade, TradeCharge, HedgeCharge } from '../../../types/trade'

// GET /api/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const strategy = searchParams.get('strategy')
    const instrumentType = searchParams.get('instrumentType')
    const selectedStrategies = searchParams.get('selectedStrategies')
    const timeRange = searchParams.get('timeRange')

    console.log('Analytics API - Received request with params:', {
      dateFrom,
      dateTo,
      strategy,
      instrumentType,
      selectedStrategies,
      timeRange
    })

    // Build date filter - normalize dates to start/end of day for proper filtering
    const dateFilter: Record<string, Date> = {}
    
    // Handle timeRange parameter
    if (timeRange && timeRange !== 'all') {
      const now = new Date()
      let startDate: Date
      
      switch (timeRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          startDate = new Date(now)
          startDate.setDate(now.getDate() - 7)
          break
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3)
          startDate = new Date(now.getFullYear(), quarter * 3, 1)
          break
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1)
          break
        default:
          startDate = new Date(0) // All time
      }
      
      startDate.setHours(0, 0, 0, 0)
      dateFilter.gte = startDate
      dateFilter.lte = now
    } else if (dateFrom) {
      const fromDate = new Date(dateFrom)
      // Set to start of day (00:00:00)
      fromDate.setHours(0, 0, 0, 0)
      dateFilter.gte = fromDate
    }
    if (dateTo) {
      const toDate = new Date(dateTo)
      // Set to end of day (23:59:59.999)
      toDate.setHours(23, 59, 59, 999)
      dateFilter.lte = toDate
    }

    // Build where clause
    const where: Record<string, unknown> = {}
    if (Object.keys(dateFilter).length > 0) {
      where.entryDate = dateFilter
    }
    
    // Note: Strategy filtering is handled separately for strategy performance (uses all data)
    // and main analytics (uses time-filtered data)
    
    // Handle instrument type filtering
    if (instrumentType && instrumentType !== 'ALL') {
      where.instrument = instrumentType
    }

    // Get all trades for calculations
    const trades = await prisma.trade.findMany({
      where,
      include: {
        charges: true,
        hedgePosition: {
          include: {
            charges: true
          }
        }
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
        
        // Calculate hedge position P&L if exists
        let hedgeGrossPnl = 0
        let hedgeCharges = 0
        if (trade.hedgePosition && trade.hedgePosition.exitPrice) {
          // Hedge P&L calculation: exit - entry (regardless of position)
          hedgeGrossPnl = (trade.hedgePosition.exitPrice - trade.hedgePosition.entryPrice) * trade.hedgePosition.quantity
          hedgeCharges = trade.hedgePosition.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0
        }
        
        const combinedGrossPnl = grossPnl + hedgeGrossPnl
        const combinedCharges = tradeCharges + hedgeCharges
        
        totalGrossPnl += combinedGrossPnl
        totalCharges += combinedCharges
        totalNetPnl += combinedGrossPnl - combinedCharges
      }
    })

    // Calculate average win/loss
    const averageWin = winningTrades > 0 ? 
      trades.filter(trade => {
        if (!trade.exitPrice) return false
        const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
        const tradeCharges = trade.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0
        
        // Calculate hedge P&L
        let hedgeGrossPnl = 0
        let hedgeCharges = 0
        if (trade.hedgePosition && trade.hedgePosition.exitPrice) {
          hedgeGrossPnl = (trade.hedgePosition.exitPrice - trade.hedgePosition.entryPrice) * trade.hedgePosition.quantity
          hedgeCharges = trade.hedgePosition.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0
        }
        
        return (grossPnl + hedgeGrossPnl) - (tradeCharges + hedgeCharges) > 0
      }).reduce((sum, trade) => {
        const grossPnl = (trade.exitPrice! - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
        const tradeCharges = trade.charges?.reduce((chargeSum, charge) => chargeSum + charge.amount, 0) || 0
        
        // Calculate hedge P&L
        let hedgeGrossPnl = 0
        let hedgeCharges = 0
        if (trade.hedgePosition && trade.hedgePosition.exitPrice) {
          hedgeGrossPnl = (trade.hedgePosition.exitPrice - trade.hedgePosition.entryPrice) * trade.hedgePosition.quantity
          hedgeCharges = trade.hedgePosition.charges?.reduce((chargeSum, charge) => chargeSum + charge.amount, 0) || 0
        }
        
        return sum + (grossPnl + hedgeGrossPnl) - (tradeCharges + hedgeCharges)
      }, 0) / winningTrades : 0

    const averageLoss = losingTrades > 0 ?
      trades.filter(trade => {
        if (!trade.exitPrice) return false
        const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
        const tradeCharges = trade.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0
        
        // Calculate hedge P&L
        let hedgeGrossPnl = 0
        let hedgeCharges = 0
        if (trade.hedgePosition && trade.hedgePosition.exitPrice) {
          hedgeGrossPnl = (trade.hedgePosition.exitPrice - trade.hedgePosition.entryPrice) * trade.hedgePosition.quantity
          hedgeCharges = trade.hedgePosition.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0
        }
        
        return (grossPnl + hedgeGrossPnl) - (tradeCharges + hedgeCharges) < 0
      }).reduce((sum, trade) => {
        const grossPnl = (trade.exitPrice! - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
        const tradeCharges = trade.charges?.reduce((chargeSum, charge) => chargeSum + charge.amount, 0) || 0
        
        // Calculate hedge P&L
        let hedgeGrossPnl = 0
        let hedgeCharges = 0
        if (trade.hedgePosition && trade.hedgePosition.exitPrice) {
          hedgeGrossPnl = (trade.hedgePosition.exitPrice - trade.hedgePosition.entryPrice) * trade.hedgePosition.quantity
          hedgeCharges = trade.hedgePosition.charges?.reduce((chargeSum, charge) => chargeSum + charge.amount, 0) || 0
        }
        
        return sum + (grossPnl + hedgeGrossPnl) - (tradeCharges + hedgeCharges)
      }, 0) / losingTrades : 0

    // Calculate profit factor
    const totalWins = Math.abs(trades.filter(trade => {
      if (!trade.exitPrice) return false
      const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
      const tradeCharges = trade.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0
      
      // Calculate hedge P&L
      let hedgeGrossPnl = 0
      let hedgeCharges = 0
      if (trade.hedgePosition && trade.hedgePosition.exitPrice) {
        hedgeGrossPnl = (trade.hedgePosition.exitPrice - trade.hedgePosition.entryPrice) * trade.hedgePosition.quantity
        hedgeCharges = trade.hedgePosition.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0
      }
      
      return (grossPnl + hedgeGrossPnl) - (tradeCharges + hedgeCharges) > 0
    }).reduce((sum, trade) => {
      const grossPnl = (trade.exitPrice! - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
      const tradeCharges = trade.charges?.reduce((chargeSum, charge) => chargeSum + charge.amount, 0) || 0
      
      // Calculate hedge P&L
      let hedgeGrossPnl = 0
      let hedgeCharges = 0
      if (trade.hedgePosition && trade.hedgePosition.exitPrice) {
        hedgeGrossPnl = (trade.hedgePosition.exitPrice - trade.hedgePosition.entryPrice) * trade.hedgePosition.quantity
        hedgeCharges = trade.hedgePosition.charges?.reduce((chargeSum, charge) => chargeSum + charge.amount, 0) || 0
      }
      
      return sum + (grossPnl + hedgeGrossPnl) - (tradeCharges + hedgeCharges)
    }, 0))

    const totalLosses = Math.abs(trades.filter(trade => {
      if (!trade.exitPrice) return false
      const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
      const tradeCharges = trade.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0
      
      // Calculate hedge P&L
      let hedgeGrossPnl = 0
      let hedgeCharges = 0
      if (trade.hedgePosition && trade.hedgePosition.exitPrice) {
        hedgeGrossPnl = (trade.hedgePosition.exitPrice - trade.hedgePosition.entryPrice) * trade.hedgePosition.quantity
        hedgeCharges = trade.hedgePosition.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0
      }
      
      return (grossPnl + hedgeGrossPnl) - (tradeCharges + hedgeCharges) < 0
    }).reduce((sum, trade) => {
      const grossPnl = (trade.exitPrice! - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
      const tradeCharges = trade.charges?.reduce((chargeSum, charge) => chargeSum + charge.amount, 0) || 0
      
      // Calculate hedge P&L
      let hedgeGrossPnl = 0
      let hedgeCharges = 0
      if (trade.hedgePosition && trade.hedgePosition.exitPrice) {
        hedgeGrossPnl = (trade.hedgePosition.exitPrice - trade.hedgePosition.entryPrice) * trade.hedgePosition.quantity
        hedgeCharges = trade.hedgePosition.charges?.reduce((chargeSum, charge) => chargeSum + charge.amount, 0) || 0
      }
      
      return sum + (grossPnl + hedgeGrossPnl) - (tradeCharges + hedgeCharges)
    }, 0))

    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : 0

    // Calculate strategy performance - use ALL data (no time filter) for strategy distribution
    const strategyPerformanceWhere: Record<string, unknown> = {}
    
    // Only apply instrument type filter for strategy performance
    if (instrumentType && instrumentType !== 'ALL') {
      strategyPerformanceWhere.instrument = instrumentType
    }
    
    // Only get trades that have strategy tags
    strategyPerformanceWhere.strategyTags = {
      some: {}
    }
    
    // Handle strategy filtering - support both single strategy and multiple selected strategies
    if (selectedStrategies) {
      try {
        const strategiesArray = JSON.parse(selectedStrategies)
        if (Array.isArray(strategiesArray) && strategiesArray.length > 0) {
          strategyPerformanceWhere.strategyTags = {
            some: {
              strategyTag: {
                name: { in: strategiesArray }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error parsing selectedStrategies:', error)
      }
    } else if (strategy) {
      strategyPerformanceWhere.strategyTags = {
        some: {
          strategyTag: {
            name: { contains: strategy }
          }
        }
      }
    }
    
    const strategyPerformance = await prisma.trade.findMany({
      where: strategyPerformanceWhere,
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
        charges: true,
        hedgePosition: {
          select: {
            exitDate: true,
            entryPrice: true,
            exitPrice: true,
            quantity: true,
            position: true,
            charges: true
          }
        }
      }
    })

    const dailyPnlMap = new Map<string, number>()
    dailyPnl.forEach(trade => {
      if (trade.exitDate && trade.exitPrice) {
        const date = trade.exitDate.toISOString().split('T')[0]
        
        // Calculate main trade P&L
        const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
        const mainNetPnl = grossPnl - (trade.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0)
        
        // Calculate hedge position P&L if exists
        let hedgeNetPnl = 0
        if (trade.hedgePosition && trade.hedgePosition.exitDate && trade.hedgePosition.exitPrice) {
          // Hedge P&L calculation: exit - entry (regardless of position)
          const hedgeGrossPnl = (trade.hedgePosition.exitPrice - trade.hedgePosition.entryPrice) * trade.hedgePosition.quantity
          hedgeNetPnl = hedgeGrossPnl - (trade.hedgePosition.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0)
        }
        
        // Combine main trade and hedge P&L
        const totalNetPnl = mainNetPnl + hedgeNetPnl
        dailyPnlMap.set(date, (dailyPnlMap.get(date) || 0) + totalNetPnl)
      }
    })

    const dailyPnlData = Array.from(dailyPnlMap.entries())
      .map(([date, pnl]) => ({ date, pnl }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Calculate current week performance (always show current week regardless of time filter)
    const currentWeekData = await calculateCurrentWeekPerformance(instrumentType)

    // Calculate instrument type performance
    const instrumentPerformance = await prisma.trade.groupBy({
      by: ['instrument'],
      where,
      _count: true,
      _sum: {
        netPnl: true
      }
    })

    // Calculate instrument performance with win rates
    const instrumentPerformanceData = await Promise.all(
      instrumentPerformance.map(async (instrument) => {
        const instrumentTrades = await prisma.trade.findMany({
          where: {
            ...where,
            instrument: instrument.instrument
          },
          include: {
            charges: true,
            hedgePosition: {
              include: {
                charges: true
              }
            }
          }
        })

        const instrumentWinningTrades = instrumentTrades.filter(trade => {
          if (!trade.exitPrice) return false
          const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
          const tradeCharges = trade.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0
          
          // Calculate hedge P&L
          let hedgeGrossPnl = 0
          let hedgeCharges = 0
          if (trade.hedgePosition && trade.hedgePosition.exitPrice) {
            hedgeGrossPnl = (trade.hedgePosition.exitPrice - trade.hedgePosition.entryPrice) * trade.hedgePosition.quantity
            hedgeCharges = trade.hedgePosition.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0
          }
          
          return (grossPnl + hedgeGrossPnl) - (tradeCharges + hedgeCharges) > 0
        }).length

        const winRate = instrumentTrades.length > 0 ? (instrumentWinningTrades / instrumentTrades.length) * 100 : 0

        return {
          instrument: instrument.instrument,
          trades: instrument._count,
          pnl: instrument._sum.netPnl || 0,
          winRate: Math.round(winRate * 100) / 100
        }
      })
    )

    // Calculate charges breakdown by type (including hedge charges)
    const tradeChargesBreakdown = await prisma.tradeCharge.groupBy({
      by: ['chargeType'],
      where: {
        trade: where
      },
      _sum: {
        amount: true
      },
      _count: true
    })

    const hedgeChargesBreakdown = await prisma.hedgeCharge.groupBy({
      by: ['chargeType'],
      where: {
        hedgePosition: {
          trade: where
        }
      },
      _sum: {
        amount: true
      },
      _count: true
    })

    // Combine trade charges and hedge charges
    const allChargesMap = new Map<string, { amount: number; count: number }>()
    
    // Add trade charges
    tradeChargesBreakdown.forEach(charge => {
      allChargesMap.set(charge.chargeType, {
        amount: charge._sum.amount || 0,
        count: charge._count
      })
    })
    
    // Add hedge charges
    hedgeChargesBreakdown.forEach(charge => {
      const existing = allChargesMap.get(charge.chargeType) || { amount: 0, count: 0 }
      allChargesMap.set(charge.chargeType, {
        amount: existing.amount + (charge._sum.amount || 0),
        count: existing.count + charge._count
      })
    })

    const chargesBreakdownData = Array.from(allChargesMap.entries()).map(([type, data]) => ({
      type,
      amount: Math.round(data.amount * 100) / 100,
      count: data.count
    }))

    // Calculate additional metrics
    const totalTradesWithExit = trades.filter(trade => trade.exitPrice).length
    const openTrades = totalTrades - totalTradesWithExit
    
    // Calculate risk metrics
    const dailyReturns = dailyPnlData.map(day => day.pnl)
    const maxDrawdown = calculateMaxDrawdown(dailyReturns)
    const sharpeRatio = calculateSharpeRatio(dailyReturns)
    const avgRiskReward = winningTrades > 0 && losingTrades > 0 ? 
      Math.abs(averageWin / averageLoss) : 0

    // Calculate period analysis based on timeRange
    const periodAnalysis = calculatePeriodAnalysis(trades, timeRange || 'month')

    // Calculate weekday analysis
    const weekdayAnalysis = calculateWeekdayAnalysis(trades)

    // Calculate overall stats (without time filter) for Quick Stats
    const overallStats = await calculateOverallStats(instrumentType)

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
        profitFactor: Math.round(profitFactor * 100) / 100,
        openTrades
      },
      strategyPerformance: strategyPerformanceData,
      instrumentPerformance: instrumentPerformanceData,
      chargesBreakdown: chargesBreakdownData,
      dailyPnlData,
      weeklyPerformanceData: currentWeekData,
      weekdayAnalysis,
      riskData: {
        maxDrawdown: Math.round(maxDrawdown * 100) / 100,
        sharpeRatio: Math.round(sharpeRatio * 100) / 100,
        avgRiskReward: Math.round(avgRiskReward * 100) / 100
      },
      periodAnalysis,
      overallStats
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

// Helper function to calculate maximum drawdown
function calculateMaxDrawdown(returns: number[]): number {
  if (returns.length === 0) return 0
  
  let peak = 0
  let maxDrawdown = 0
  let runningSum = 0
  
  for (const return_ of returns) {
    runningSum += return_
    if (runningSum > peak) {
      peak = runningSum
    }
    const drawdown = peak - runningSum
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown
    }
  }
  
  return maxDrawdown
}

// Helper function to calculate Sharpe ratio
function calculateSharpeRatio(returns: number[]): number {
  if (returns.length === 0) return 0
  
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length
  const stdDev = Math.sqrt(variance)
  
  // Assuming risk-free rate of 0 for simplicity
  return stdDev > 0 ? mean / stdDev : 0
}

// Helper function to calculate period analysis
function calculatePeriodAnalysis(trades: Trade[], timeRange: string) {
  if (trades.length === 0) {
    return {
      mostProfitable: null,
      mostLosing: null,
      totalTrades: 0,
      totalPnl: 0
    }
  }

  const periodMap = new Map<string, {
    pnl: number
    trades: number
    winningTrades: number
    date: string
  }>()

  // Group trades by period based on timeRange
  trades.forEach(trade => {
    if (!trade.exitDate || !trade.exitPrice) return

    const exitDate = new Date(trade.exitDate)
    let periodKey: string
    let dateLabel: string

    // Calculate net P&L including charges
    const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
    const tradeCharges = Array.isArray(trade.charges) 
      ? trade.charges.reduce((sum: number, charge: TradeCharge) => sum + charge.amount, 0)
      : trade.charges?.total || 0
    const hedgeCharges = Array.isArray(trade.hedgePosition?.charges)
      ? trade.hedgePosition.charges.reduce((sum: number, charge: HedgeCharge) => sum + charge.amount, 0)
      : 0
    const netPnl = grossPnl - (tradeCharges + hedgeCharges)

    const isWinning = netPnl > 0

    switch (timeRange) {
      case 'week':
        // Group by day
        periodKey = exitDate.toISOString().split('T')[0]
        dateLabel = exitDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        break
      case 'month':
        // Group by week
        const weekStart = new Date(exitDate)
        weekStart.setDate(exitDate.getDate() - exitDate.getDay())
        periodKey = weekStart.toISOString().split('T')[0]
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        dateLabel = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
        break
      case 'quarter':
      case 'year':
        // Group by month
        periodKey = `${exitDate.getFullYear()}-${String(exitDate.getMonth() + 1).padStart(2, '0')}`
        dateLabel = exitDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        break
      default:
        // Default to daily grouping
        periodKey = exitDate.toISOString().split('T')[0]
        dateLabel = exitDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    const existing = periodMap.get(periodKey) || {
      pnl: 0,
      trades: 0,
      winningTrades: 0,
      date: dateLabel
    }

    existing.pnl += netPnl
    existing.trades += 1
    if (isWinning) existing.winningTrades += 1
    existing.date = dateLabel

    periodMap.set(periodKey, existing)
  })

  // Convert to array and find best/worst periods
  const periods = Array.from(periodMap.entries()).map(([, data]) => ({
    period: data.date,
    pnl: data.pnl,
    trades: data.trades,
    winRate: data.trades > 0 ? (data.winningTrades / data.trades) * 100 : 0,
    date: data.date
  }))

  if (periods.length === 0) {
    return {
      mostProfitable: null,
      mostLosing: null,
      totalTrades: 0,
      totalPnl: 0
    }
  }

  // Find most profitable and most losing periods
  const mostProfitable = periods.reduce((best, current) => 
    current.pnl > best.pnl ? current : best
  )

  const mostLosing = periods.reduce((worst, current) => 
    current.pnl < worst.pnl ? current : worst
  )

  const totalTrades = periods.reduce((sum, period) => sum + period.trades, 0)
  const totalPnl = periods.reduce((sum, period) => sum + period.pnl, 0)

  return {
    mostProfitable: mostProfitable.pnl > 0 ? mostProfitable : null,
    mostLosing: mostLosing.pnl < 0 ? mostLosing : null,
    totalTrades,
    totalPnl
  }
}

// Helper function to calculate current week performance
async function calculateCurrentWeekPerformance(instrumentType: string | null) {
  try {
    // Get current week start and end dates (Monday to Friday only)
    const now = new Date()
    const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate Monday of current week
    const weekStart = new Date(now)
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1 // Handle Sunday as 6 days from Monday
    weekStart.setDate(now.getDate() - daysFromMonday)
    weekStart.setHours(0, 0, 0, 0)
    
    // Calculate Friday of current week
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 4) // Friday is 4 days after Monday
    weekEnd.setHours(23, 59, 59, 999)

    // Build where clause for current week (Monday to Friday only)
    const where: Record<string, unknown> = {
      exitDate: {
        gte: weekStart,
        lte: weekEnd
      }
    }
    
    // Only apply instrument type filter
    if (instrumentType && instrumentType !== 'ALL') {
      where.instrument = instrumentType
    }

    // Get trades for current week
    const weekTrades = await prisma.trade.findMany({
      where,
      select: {
        exitDate: true,
        entryPrice: true,
        exitPrice: true,
        quantity: true,
        position: true,
        charges: true,
        hedgePosition: {
          select: {
            exitDate: true,
            entryPrice: true,
            exitPrice: true,
            quantity: true,
            position: true,
            charges: true
          }
        }
      }
    })

    // Group by day of week
    const dayMap = new Map<string, { pnl: number; trades: number }>()
    
    // Initialize trading days only (Monday to Friday)
    const tradingDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    tradingDays.forEach(day => {
      dayMap.set(day, { pnl: 0, trades: 0 })
    })

    weekTrades.forEach(trade => {
      if (trade.exitDate && trade.exitPrice) {
        const dayName = trade.exitDate.toLocaleDateString('en-US', { weekday: 'short' })
        
        // Calculate main trade P&L
        const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
        const mainNetPnl = grossPnl - (trade.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0)
        
        // Calculate hedge position P&L if exists
        let hedgeNetPnl = 0
        if (trade.hedgePosition && trade.hedgePosition.exitDate && trade.hedgePosition.exitPrice) {
          // Hedge P&L calculation: exit - entry (regardless of position)
          const hedgeGrossPnl = (trade.hedgePosition.exitPrice - trade.hedgePosition.entryPrice) * trade.hedgePosition.quantity
          hedgeNetPnl = hedgeGrossPnl - (trade.hedgePosition.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0)
        }
        
        // Combine main trade and hedge P&L
        const totalNetPnl = mainNetPnl + hedgeNetPnl
        
        const existing = dayMap.get(dayName) || { pnl: 0, trades: 0 }
        existing.pnl += totalNetPnl
        existing.trades += 1
        dayMap.set(dayName, existing)
      }
    })

    // Determine which days to show based on current day
    let daysToShow = tradingDays
    const today = new Date()
    const todayDay = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    
    // If today is weekend, show all trading days
    // If today is a trading day, only show up to today
    if (todayDay >= 1 && todayDay <= 5) { // Monday to Friday
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const todayName = dayNames[todayDay]
      const todayIndex = tradingDays.indexOf(todayName)
      if (todayIndex !== -1) {
        daysToShow = tradingDays.slice(0, todayIndex + 1)
      }
    }

    // Return only the days that should be shown
    return daysToShow.map(day => {
      const data = dayMap.get(day) || { pnl: 0, trades: 0 }
      return {
        day,
        pnl: Math.round(data.pnl * 100) / 100,
        trades: data.trades
      }
    })
  } catch (error) {
    console.error('Error calculating current week performance:', error)
    // Return empty data for trading days only
    const tradingDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    return tradingDays.map(day => ({
      day,
      pnl: 0,
      trades: 0
    }))
  }
}

// Helper function to calculate overall stats (without time filter)
async function calculateOverallStats(instrumentType: string | null) {
  try {
    // Build where clause for overall stats (no time filter)
    const where: Record<string, unknown> = {}
    
    // Only apply instrument type filter
    if (instrumentType && instrumentType !== 'ALL') {
      where.instrument = instrumentType
    }

    // Get all trades for overall calculations
    const allTrades = await prisma.trade.findMany({
      where,
      include: {
        charges: true,
        hedgePosition: {
          include: {
            charges: true
          }
        }
      }
    })

    // Calculate overall performance metrics
    const totalTrades = allTrades.length
    const winningTrades = allTrades.filter(trade => {
      if (!trade.exitPrice) return false
      const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
      const tradeCharges = trade.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0
      const hedgeCharges = trade.hedgePosition?.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0
      return grossPnl - (tradeCharges + hedgeCharges) > 0
    }).length

    const losingTrades = allTrades.filter(trade => {
      if (!trade.exitPrice) return false
      const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
      const tradeCharges = trade.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0
      const hedgeCharges = trade.hedgePosition?.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0
      return grossPnl - (tradeCharges + hedgeCharges) < 0
    }).length

    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0

    // Calculate overall P&L
    let totalGrossPnl = 0
    let totalCharges = 0
    let totalNetPnl = 0

    allTrades.forEach(trade => {
      if (trade.exitPrice) {
        const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
        const tradeCharges = trade.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0
        const hedgeCharges = trade.hedgePosition?.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0
        const totalTradeCharges = tradeCharges + hedgeCharges
        
        totalGrossPnl += grossPnl
        totalCharges += totalTradeCharges
        totalNetPnl += grossPnl - totalTradeCharges
      }
    })

    // Calculate average trade P&L
    const avgTrade = totalTrades > 0 ? totalNetPnl / totalTrades : 0

    // Find strategy with most trades
    const strategyTrades = await prisma.trade.findMany({
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

    const strategyCountMap = new Map<string, number>()
    strategyTrades.forEach(trade => {
      trade.strategyTags.forEach(tag => {
        const strategyName = tag.strategyTag.name
        strategyCountMap.set(strategyName, (strategyCountMap.get(strategyName) || 0) + 1)
      })
    })

    const maxTradesStrategy = strategyCountMap.size > 0 
      ? Array.from(strategyCountMap.entries()).reduce((max, [strategy, count]) => 
          count > max.count ? { strategy, count } : max, 
          { strategy: '', count: 0 }
        )
      : { strategy: 'No strategies', count: 0 }

    return {
      totalTrades,
      winningTrades,
      losingTrades,
      winRate: Math.round(winRate * 100) / 100,
      totalGrossPnl: Math.round(totalGrossPnl * 100) / 100,
      totalCharges: Math.round(totalCharges * 100) / 100,
      totalNetPnl: Math.round(totalNetPnl * 100) / 100,
      avgTrade: Math.round(avgTrade * 100) / 100,
      maxTradesStrategy: {
        name: maxTradesStrategy.strategy,
        count: maxTradesStrategy.count
      }
    }
  } catch (error) {
    console.error('Error calculating overall stats:', error)
    return {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      totalGrossPnl: 0,
      totalCharges: 0,
      totalNetPnl: 0,
      avgTrade: 0,
      maxTradesStrategy: {
        name: 'No strategies',
        count: 0
      }
    }
  }
}

// Helper function to calculate weekday analysis
function calculateWeekdayAnalysis(trades: Trade[]) {
  const weekdayMap = new Map<string, {
    trades: number
    wins: number
    losses: number
    totalPnl: number
    avgPnl: number
    winRate: number
  }>()

  // Initialize all weekdays
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  weekdays.forEach(day => {
    weekdayMap.set(day, {
      trades: 0,
      wins: 0,
      losses: 0,
      totalPnl: 0,
      avgPnl: 0,
      winRate: 0
    })
  })

  // Process each trade
  trades.forEach(trade => {
    if (!trade.exitPrice) return // Skip open trades

    const entryDate = new Date(trade.entryDate)
    const dayName = entryDate.toLocaleDateString('en-US', { weekday: 'long' })
    
    // Calculate net P&L including charges
    const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
    const tradeCharges = Array.isArray(trade.charges) 
      ? trade.charges.reduce((sum: number, charge: TradeCharge) => sum + charge.amount, 0)
      : trade.charges?.total || 0
    const hedgeCharges = Array.isArray(trade.hedgePosition?.charges)
      ? trade.hedgePosition.charges.reduce((sum: number, charge: HedgeCharge) => sum + charge.amount, 0)
      : 0
    const netPnl = grossPnl - (tradeCharges + hedgeCharges)

    const existing = weekdayMap.get(dayName) || {
      trades: 0,
      wins: 0,
      losses: 0,
      totalPnl: 0,
      avgPnl: 0,
      winRate: 0
    }

    existing.trades += 1
    existing.totalPnl += netPnl
    
    if (netPnl > 0) {
      existing.wins += 1
    } else if (netPnl < 0) {
      existing.losses += 1
    }

    weekdayMap.set(dayName, existing)
  })

  // Calculate derived metrics
  weekdayMap.forEach((data) => {
    data.avgPnl = data.trades > 0 ? data.totalPnl / data.trades : 0
    data.winRate = data.trades > 0 ? (data.wins / data.trades) * 100 : 0
  })

  // Convert to array and sort by day order
  const weekdayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  return weekdayOrder.map(dayName => {
    const data = weekdayMap.get(dayName) || {
      trades: 0,
      wins: 0,
      losses: 0,
      totalPnl: 0,
      avgPnl: 0,
      winRate: 0
    }
    
    return {
      day: dayName,
      trades: data.trades,
      wins: data.wins,
      losses: data.losses,
      totalPnl: Math.round(data.totalPnl * 100) / 100,
      avgPnl: Math.round(data.avgPnl * 100) / 100,
      winRate: Math.round(data.winRate * 100) / 100
    }
  })
}

