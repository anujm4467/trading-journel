import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

// GET /api/psychology - Get psychology analysis data
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
      where.strategyTags = {
        some: {
          strategyTag: {
            name: { contains: strategy }
          }
        }
      }
    }

    // Get all trades with psychology data
    const trades = await prisma.trade.findMany({
      where,
      include: {
        strategyTags: {
          include: {
            strategyTag: true
          }
        }
      }
    })

    // Calculate psychology metrics
    const totalTrades = trades.length
    
    if (totalTrades === 0) {
      return NextResponse.json({
        overview: {
          disciplineScore: 0,
          riskManagementScore: 0,
          emotionalControlScore: 0,
          patienceScore: 0
        },
        behaviorPatterns: {
          riskRewardAdherence: { followed: 0, deviated: 0 },
          intradayHunter: { followed: 0, deviated: 0 },
          overtrading: { controlled: 0, excessive: 0, averageTradesPerDay: 0 },
          retracementPatience: { waited: 0, premature: 0 }
        },
        emotionalAnalysis: {
          greedFear: { greed: 0, fear: 0, balanced: 0 },
          exitPatience: { patient: 0, impatient: 0, averageHoldTime: '0h 0m' }
        },
        disciplineTracking: {
          followedRules: 0,
          ruleViolations: 0,
          score: 0,
          totalTrades: 0,
          disciplineTrends: []
        },
        aiInsights: {
          insights: [],
          recommendations: [],
          performanceCorrelation: []
        }
      })
    }

    // Calculate behavior patterns
    const riskRewardFollowed = trades.filter(trade => trade.followedRiskReward === true).length
    const riskRewardDeviated = trades.filter(trade => trade.followedRiskReward === false).length

    const intradayHunterFollowed = trades.filter(trade => trade.followedIntradayHunter === true).length
    const intradayHunterDeviated = trades.filter(trade => trade.followedIntradayHunter === false).length

    const overtradingTrades = trades.filter(trade => trade.overtrading === true).length
    const controlledTrades = trades.filter(trade => trade.overtrading === false).length

    const retracementWaited = trades.filter(trade => trade.waitedForRetracement === true).length
    const retracementPremature = trades.filter(trade => trade.waitedForRetracement === false).length

    // Calculate emotional analysis
    const greedTrades = trades.filter(trade => trade.showedGreed === true).length
    const fearTrades = trades.filter(trade => trade.showedFear === true).length
    const balancedTrades = trades.filter(trade => 
      trade.showedGreed === false && trade.showedFear === false
    ).length

    const patientExits = trades.filter(trade => trade.hadPatienceWhileExiting === true).length
    const impatientExits = trades.filter(trade => trade.hadPatienceWhileExiting === false).length

    // Calculate average hold time
    const tradesWithDuration = trades.filter(trade => trade.holdingDuration)
    const averageHoldTimeMinutes = tradesWithDuration.length > 0 
      ? tradesWithDuration.reduce((sum, trade) => sum + (trade.holdingDuration || 0), 0) / tradesWithDuration.length
      : 0

    const hours = Math.floor(averageHoldTimeMinutes / 60)
    const minutes = Math.floor(averageHoldTimeMinutes % 60)
    const averageHoldTime = `${hours}h ${minutes}m`

    // Calculate discipline scores
    const followedRules = trades.filter(trade => 
      trade.followedRiskReward === true && 
      trade.followedIntradayHunter === true && 
      trade.waitedForRetracement === true
    ).length

    const ruleViolations = totalTrades - followedRules
    const disciplineScore = totalTrades > 0 ? Math.round((followedRules / totalTrades) * 100) : 0

    // Calculate other scores
    const riskManagementScore = totalTrades > 0 
      ? Math.round((riskRewardFollowed / (riskRewardFollowed + riskRewardDeviated)) * 100) 
      : 0

    const emotionalControlScore = totalTrades > 0
      ? Math.round((balancedTrades / totalTrades) * 100)
      : 0

    const patienceScore = totalTrades > 0
      ? Math.round((patientExits / (patientExits + impatientExits)) * 100)
      : 0

    // Generate monthly discipline trends
    const monthlyData = new Map<string, { total: number; followed: number }>()
    
    trades.forEach(trade => {
      const month = trade.entryDate.toLocaleDateString('en-US', { month: 'short' })
      const existing = monthlyData.get(month) || { total: 0, followed: 0 }
      existing.total += 1
      if (trade.followedRiskReward === true && trade.followedIntradayHunter === true) {
        existing.followed += 1
      }
      monthlyData.set(month, existing)
    })

    const disciplineTrends = Array.from(monthlyData.entries()).map(([month, data]) => ({
      month,
      disciplineScore: data.total > 0 ? Math.round((data.followed / data.total) * 100) : 0
    }))

    // Generate AI insights based on data
    const insights = []
    const recommendations = []

    if (disciplineScore < 60) {
      insights.push({
        type: 'warning' as const,
        title: 'Low Discipline Score',
        description: `Your discipline score is ${disciplineScore}%. Focus on following your trading rules more consistently.`,
        category: 'Discipline'
      })
      recommendations.push({
        priority: 'high' as const,
        title: 'Improve Rule Following',
        description: 'Create a checklist of your trading rules and review it before each trade.',
        category: 'Discipline'
      })
    }

    if (riskManagementScore < 70) {
      insights.push({
        type: 'warning' as const,
        title: 'Risk Management Issues',
        description: `You're only following your risk-reward ratios ${riskManagementScore}% of the time.`,
        category: 'Risk Management'
      })
      recommendations.push({
        priority: 'medium' as const,
        title: 'Stick to Risk-Reward Ratios',
        description: 'Set clear risk-reward ratios before entering trades and stick to them.',
        category: 'Risk Management'
      })
    }

    if (emotionalControlScore < 50) {
      insights.push({
        type: 'warning' as const,
        title: 'Emotional Trading Detected',
        description: 'You\'re showing signs of greed and fear in your trades. Focus on emotional control.',
        category: 'Emotions'
      })
      recommendations.push({
        priority: 'high' as const,
        title: 'Emotional Control Training',
        description: 'Practice meditation or journaling to improve emotional control during trading.',
        category: 'Emotions'
      })
    }

    if (patienceScore < 60) {
      insights.push({
        type: 'suggestion' as const,
        title: 'Patience Improvement Needed',
        description: 'Work on being more patient while exiting trades to maximize profits.',
        category: 'Patience'
      })
      recommendations.push({
        priority: 'medium' as const,
        title: 'Exit Strategy Refinement',
        description: 'Develop a clear exit strategy and stick to it instead of exiting prematurely.',
        category: 'Patience'
      })
    }

    // Add positive insights
    if (disciplineScore >= 80) {
      insights.push({
        type: 'positive' as const,
        title: 'Excellent Discipline',
        description: 'You\'re showing excellent discipline in following your trading rules!',
        category: 'Discipline'
      })
    }

    // Performance correlation data
    const performanceCorrelation = [
      { psychologyState: 'Disciplined', averagePnl: 1250 },
      { psychologyState: 'Emotional', averagePnl: -450 },
      { psychologyState: 'Patient', averagePnl: 2100 },
      { psychologyState: 'Impatient', averagePnl: -200 },
      { psychologyState: 'Rule-Following', averagePnl: 1800 },
      { psychologyState: 'Rule-Breaking', averagePnl: -800 }
    ]

    return NextResponse.json({
      overview: {
        disciplineScore,
        riskManagementScore,
        emotionalControlScore,
        patienceScore
      },
      behaviorPatterns: {
        riskRewardAdherence: {
          followed: riskRewardFollowed,
          deviated: riskRewardDeviated
        },
        intradayHunter: {
          followed: intradayHunterFollowed,
          deviated: intradayHunterDeviated
        },
        overtrading: {
          controlled: controlledTrades,
          excessive: overtradingTrades,
          averageTradesPerDay: totalTrades > 0 ? Math.round(totalTrades / 30) : 0
        },
        retracementPatience: {
          waited: retracementWaited,
          premature: retracementPremature
        }
      },
      emotionalAnalysis: {
        greedFear: {
          greed: greedTrades,
          fear: fearTrades,
          balanced: balancedTrades
        },
        exitPatience: {
          patient: patientExits,
          impatient: impatientExits,
          averageHoldTime
        }
      },
      disciplineTracking: {
        followedRules,
        ruleViolations,
        score: disciplineScore,
        totalTrades,
        disciplineTrends
      },
      aiInsights: {
        insights,
        recommendations,
        performanceCorrelation
      }
    })
  } catch (error) {
    console.error('Error fetching psychology data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch psychology data' },
      { status: 500 }
    )
  }
}
