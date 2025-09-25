import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const strategy = searchParams.get('strategy')

    // Build where clause
    const whereClause: any = {
      isDraft: false
    }

    if (dateFrom || dateTo) {
      whereClause.entryDate = {}
      if (dateFrom) whereClause.entryDate.gte = new Date(dateFrom)
      if (dateTo) whereClause.entryDate.lte = new Date(dateTo)
    }

    if (strategy) {
      whereClause.strategyTags = {
        some: {
          strategyTag: {
            name: strategy
          }
        }
      }
    }

    // Get all trades with psychology data
    const trades = await prisma.trade.findMany({
      where: whereClause,
      include: {
        strategyTags: {
          include: {
            strategyTag: true
          }
        },
        emotionalTags: {
          include: {
            emotionalTag: true
          }
        }
      },
      orderBy: {
        entryDate: 'desc'
      }
    })

    if (trades.length === 0) {
      return NextResponse.json({
        overview: {
          disciplineScore: 0,
          riskManagementScore: 0,
          emotionalControlScore: 0,
          patienceScore: 0,
          totalTrades: 0,
          averagePnl: 0,
          winRate: 0
        },
        behaviorPatterns: {
          riskRewardAdherence: { followed: 0, deviated: 0 },
          intradayHunter: { followed: 0, deviated: 0 },
          overtrading: { controlled: 0, excessive: 0, averageTradesPerDay: 0 },
          retracementPatience: { waited: 0, premature: 0 }
        },
        psychologicalFactors: {
          sleepQuality: { average: 0, correlation: 0 },
          stressLevel: { average: 0, correlation: 0 },
          energyLevel: { average: 0, correlation: 0 },
          focusLevel: { average: 0, correlation: 0 },
          fomoLevel: { average: 0, correlation: 0 }
        },
        emotionalAnalysis: {
          greedScore: { average: 0, correlation: 0 },
          fearScore: { average: 0, correlation: 0 },
          revengeTrading: { frequency: 0, impact: 0 },
          impulsiveTrading: { frequency: 0, impact: 0 }
        },
        marketContext: {
          sentimentDistribution: {},
          newsImpactDistribution: {},
          moodDistribution: {}
        },
        timeAnalysis: {
          averageAnalysisTime: 0,
          averageDecisionTime: 0,
          timeCorrelation: 0
        },
        correlations: {
          sleepVsPnl: 0,
          stressVsPnl: 0,
          energyVsPnl: 0,
          focusVsPnl: 0,
          meditationVsPnl: 0,
          internetIssuesVsPnl: 0
        },
        insights: [],
        recommendations: [],
        charts: {
          psychologyTrends: [],
          pnlCorrelations: [],
          behaviorPatterns: [],
          emotionalStates: []
        }
      })
    }

    // Calculate comprehensive analytics
    const totalTrades = trades.length
    const completedTrades = trades.filter(t => t.netPnl !== null)
    const totalPnl = completedTrades.reduce((sum, t) => sum + (t.netPnl || 0), 0)
    const averagePnl = completedTrades.length > 0 ? totalPnl / completedTrades.length : 0
    const winningTrades = completedTrades.filter(t => (t.netPnl || 0) > 0)
    const winRate = completedTrades.length > 0 ? (winningTrades.length / completedTrades.length) * 100 : 0

    // Calculate discipline score
    const disciplineFactors = [
      trades.filter(t => t.followedRiskReward === true).length,
      trades.filter(t => t.followedIntradayHunter === true).length,
      trades.filter(t => t.waitedForRetracement === true).length,
      trades.filter(t => t.hadPatienceWhileExiting === true).length
    ]
    const disciplineScore = Math.round((disciplineFactors.reduce((sum, val) => sum + val, 0) / (disciplineFactors.length * totalTrades)) * 100)

    // Calculate risk management score
    const riskManagementScore = Math.round((trades.filter(t => t.followedRiskReward === true).length / totalTrades) * 100)

    // Calculate emotional control score
    const emotionalControlFactors = [
      trades.filter(t => t.showedGreed === false).length,
      trades.filter(t => t.showedFear === false).length,
      trades.filter(t => t.revengeTrading === false).length,
      trades.filter(t => t.impulsiveTrading === false).length
    ]
    const emotionalControlScore = Math.round((emotionalControlFactors.reduce((sum, val) => sum + val, 0) / (emotionalControlFactors.length * totalTrades)) * 100)

    // Calculate patience score
    const patienceScore = Math.round((trades.filter(t => t.hadPatienceWhileExiting === true).length / totalTrades) * 100)

    // Behavior patterns
    const behaviorPatterns = {
      riskRewardAdherence: {
        followed: trades.filter(t => t.followedRiskReward === true).length,
        deviated: trades.filter(t => t.followedRiskReward === false).length
      },
      intradayHunter: {
        followed: trades.filter(t => t.followedIntradayHunter === true).length,
        deviated: trades.filter(t => t.followedIntradayHunter === false).length
      },
      overtrading: {
        controlled: trades.filter(t => t.overtrading === false).length,
        excessive: trades.filter(t => t.overtrading === true).length,
        averageTradesPerDay: calculateAverageTradesPerDay(trades)
      },
      retracementPatience: {
        waited: trades.filter(t => t.waitedForRetracement === true).length,
        premature: trades.filter(t => t.waitedForRetracement === false).length
      }
    }

    // Psychological factors analysis
    const psychologicalFactors = {
      sleepQuality: {
        average: calculateAverage(trades, 'sleepQuality'),
        correlation: calculateCorrelation(trades, 'sleepQuality', 'netPnl')
      },
      stressLevel: {
        average: calculateAverage(trades, 'stressLevel'),
        correlation: calculateCorrelation(trades, 'stressLevel', 'netPnl')
      },
      energyLevel: {
        average: calculateAverage(trades, 'energyLevel'),
        correlation: calculateCorrelation(trades, 'energyLevel', 'netPnl')
      },
      focusLevel: {
        average: calculateAverage(trades, 'focusLevel'),
        correlation: calculateCorrelation(trades, 'focusLevel', 'netPnl')
      },
      fomoLevel: {
        average: calculateAverage(trades, 'fomoLevel'),
        correlation: calculateCorrelation(trades, 'fomoLevel', 'netPnl')
      }
    }

    // Emotional analysis
    const emotionalAnalysis = {
      greedScore: {
        average: calculateAverage(trades, 'greedScore') || 0,
        correlation: calculateCorrelation(trades, 'greedScore', 'netPnl')
      },
      fearScore: {
        average: calculateAverage(trades, 'fearScore') || 0,
        correlation: calculateCorrelation(trades, 'fearScore', 'netPnl')
      },
      revengeTrading: {
        frequency: (trades.filter(t => t.revengeTrading === true).length / totalTrades) * 100,
        impact: calculateImpact(trades, 'revengeTrading')
      },
      impulsiveTrading: {
        frequency: (trades.filter(t => t.impulsiveTrading === true).length / totalTrades) * 100,
        impact: calculateImpact(trades, 'impulsiveTrading')
      }
    }

    // Market context analysis
    const marketContext = {
      sentimentDistribution: calculateDistribution(trades, 'marketSentiment'),
      newsImpactDistribution: calculateDistribution(trades, 'newsImpact'),
      moodDistribution: {
        preTrade: calculateDistribution(trades, 'preTradeMood'),
        postTrade: calculateDistribution(trades, 'postTradeMood')
      }
    }

    // Time analysis
    const timeAnalysis = {
      averageAnalysisTime: calculateAverage(trades, 'analysisTime'),
      averageDecisionTime: calculateAverage(trades, 'decisionTime'),
      timeCorrelation: calculateCorrelation(trades, 'analysisTime', 'netPnl')
    }

    // Correlations with P&L
    const correlations = {
      sleepVsPnl: calculateCorrelation(trades, 'sleepQuality', 'netPnl'),
      stressVsPnl: calculateCorrelation(trades, 'stressLevel', 'netPnl'),
      energyVsPnl: calculateCorrelation(trades, 'energyLevel', 'netPnl'),
      focusVsPnl: calculateCorrelation(trades, 'focusLevel', 'netPnl'),
      meditationVsPnl: calculateBooleanCorrelation(trades, 'meditationPractice', 'netPnl'),
      internetIssuesVsPnl: calculateBooleanCorrelation(trades, 'internetIssues', 'netPnl')
    }

    // Generate insights
    const insights = generateInsights({
      disciplineScore,
      riskManagementScore,
      emotionalControlScore,
      patienceScore,
      psychologicalFactors,
      emotionalAnalysis,
      correlations,
      totalTrades,
      winRate
    })

    // Generate recommendations
    const recommendations = generateRecommendations({
      disciplineScore,
      riskManagementScore,
      emotionalControlScore,
      patienceScore,
      psychologicalFactors,
      emotionalAnalysis,
      correlations,
      behaviorPatterns
    })

    // Generate chart data
    const charts = generateChartData(trades)

    return NextResponse.json({
      overview: {
        disciplineScore,
        riskManagementScore,
        emotionalControlScore,
        patienceScore,
        totalTrades,
        averagePnl,
        winRate
      },
      behaviorPatterns,
      psychologicalFactors,
      emotionalAnalysis,
      marketContext,
      timeAnalysis,
      correlations,
      insights,
      recommendations,
      charts
    })

  } catch (error) {
    console.error('Psychology analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch psychology analytics' },
      { status: 500 }
    )
  }
}

// Helper functions
function calculateAverage(trades: any[], field: string): number {
  const values = trades.filter(t => t[field] !== null && t[field] !== undefined).map(t => t[field])
  return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0
}

function calculateCorrelation(trades: any[], field1: string, field2: string): number {
  const validTrades = trades.filter(t => t[field1] !== null && t[field1] !== undefined && t[field2] !== null && t[field2] !== undefined)
  if (validTrades.length < 2) return 0

  const values1 = validTrades.map(t => t[field1])
  const values2 = validTrades.map(t => t[field2])
  
  const mean1 = values1.reduce((sum, val) => sum + val, 0) / values1.length
  const mean2 = values2.reduce((sum, val) => sum + val, 0) / values2.length
  
  let numerator = 0
  let sumSq1 = 0
  let sumSq2 = 0
  
  for (let i = 0; i < values1.length; i++) {
    const diff1 = values1[i] - mean1
    const diff2 = values2[i] - mean2
    numerator += diff1 * diff2
    sumSq1 += diff1 * diff1
    sumSq2 += diff2 * diff2
  }
  
  const denominator = Math.sqrt(sumSq1 * sumSq2)
  return denominator === 0 ? 0 : numerator / denominator
}

function calculateBooleanCorrelation(trades: any[], field: string, pnlField: string): number {
  const trueTrades = trades.filter(t => t[field] === true && t[pnlField] !== null)
  const falseTrades = trades.filter(t => t[field] === false && t[pnlField] !== null)
  
  if (trueTrades.length === 0 || falseTrades.length === 0) return 0
  
  const trueAvgPnl = trueTrades.reduce((sum, t) => sum + (t[pnlField] || 0), 0) / trueTrades.length
  const falseAvgPnl = falseTrades.reduce((sum, t) => sum + (t[pnlField] || 0), 0) / falseTrades.length
  
  return trueAvgPnl - falseAvgPnl
}

function calculateImpact(trades: any[], field: string): number {
  const trueTrades = trades.filter(t => t[field] === true && t.netPnl !== null)
  const falseTrades = trades.filter(t => t[field] === false && t.netPnl !== null)
  
  if (trueTrades.length === 0 || falseTrades.length === 0) return 0
  
  const trueAvgPnl = trueTrades.reduce((sum, t) => sum + (t.netPnl || 0), 0) / trueTrades.length
  const falseAvgPnl = falseTrades.reduce((sum, t) => sum + (t.netPnl || 0), 0) / falseTrades.length
  
  return ((trueAvgPnl - falseAvgPnl) / Math.abs(falseAvgPnl)) * 100
}

function calculateDistribution(trades: any[], field: string): Record<string, number> {
  const distribution: Record<string, number> = {}
  trades.forEach(trade => {
    const value = trade[field]
    if (value) {
      distribution[value] = (distribution[value] || 0) + 1
    }
  })
  return distribution
}

function calculateAverageTradesPerDay(trades: any[]): number {
  if (trades.length === 0) return 0
  
  const dates = trades.map(t => new Date(t.entryDate).toDateString())
  const uniqueDates = [...new Set(dates)]
  return trades.length / uniqueDates.length
}

function generateInsights(data: any): any[] {
  const insights = []
  
  if (data.disciplineScore < 50) {
    insights.push({
      type: 'warning',
      title: 'Low Discipline Score',
      description: `Your discipline score is ${data.disciplineScore}%. Focus on following your trading rules more consistently.`,
      impact: 'high'
    })
  }
  
  if (data.riskManagementScore < 70) {
    insights.push({
      type: 'warning',
      title: 'Risk Management Issues',
      description: `You're only following your risk-reward ratios ${data.riskManagementScore}% of the time.`,
      impact: 'high'
    })
  }
  
  if (data.emotionalControlScore < 60) {
    insights.push({
      type: 'warning',
      title: 'Emotional Trading Detected',
      description: 'You\'re showing signs of greed and fear in your trades. Focus on emotional control.',
      impact: 'medium'
    })
  }
  
  if (data.psychologicalFactors.sleepQuality.average < 6) {
    insights.push({
      type: 'info',
      title: 'Sleep Quality Impact',
      description: `Your average sleep quality is ${data.psychologicalFactors.sleepQuality.average.toFixed(1)}/10. Poor sleep may be affecting your trading performance.`,
      impact: 'medium'
    })
  }
  
  if (data.correlations.meditationVsPnl > 0) {
    insights.push({
      type: 'positive',
      title: 'Meditation Benefits',
      description: 'Your meditation practice shows positive correlation with trading performance.',
      impact: 'low'
    })
  }
  
  return insights
}

function generateRecommendations(data: any): any[] {
  const recommendations = []
  
  if (data.disciplineScore < 50) {
    recommendations.push({
      priority: 'high',
      title: 'Improve Rule Following',
      description: 'Create a checklist of your trading rules and review it before each trade.',
      category: 'Discipline',
      action: 'Create a pre-trade checklist'
    })
  }
  
  if (data.riskManagementScore < 70) {
    recommendations.push({
      priority: 'high',
      title: 'Stick to Risk-Reward Ratios',
      description: 'Set clear risk-reward ratios before entering trades and stick to them.',
      category: 'Risk Management',
      action: 'Define clear risk-reward rules'
    })
  }
  
  if (data.emotionalControlScore < 60) {
    recommendations.push({
      priority: 'medium',
      title: 'Emotional Control Training',
      description: 'Practice meditation or journaling to improve emotional control during trading.',
      category: 'Emotions',
      action: 'Start daily meditation practice'
    })
  }
  
  if (data.psychologicalFactors.sleepQuality.average < 6) {
    recommendations.push({
      priority: 'medium',
      title: 'Improve Sleep Quality',
      description: 'Establish a consistent sleep schedule and create a bedtime routine.',
      category: 'Health',
      action: 'Set a consistent bedtime'
    })
  }
  
  if (data.patienceScore < 50) {
    recommendations.push({
      priority: 'medium',
      title: 'Exit Strategy Refinement',
      description: 'Develop a clear exit strategy and stick to it instead of exiting prematurely.',
      category: 'Patience',
      action: 'Define exit criteria'
    })
  }
  
  return recommendations
}

function generateChartData(trades: any[]): any {
  // Psychology trends over time
  const psychologyTrends = trades.map(trade => ({
    date: trade.entryDate,
    sleepQuality: trade.sleepQuality || 0,
    stressLevel: trade.stressLevel || 0,
    energyLevel: trade.energyLevel || 0,
    focusLevel: trade.focusLevel || 0,
    netPnl: trade.netPnl || 0
  }))

  // P&L correlations
  const pnlCorrelations = [
    { factor: 'Sleep Quality', correlation: calculateCorrelation(trades, 'sleepQuality', 'netPnl') },
    { factor: 'Stress Level', correlation: calculateCorrelation(trades, 'stressLevel', 'netPnl') },
    { factor: 'Energy Level', correlation: calculateCorrelation(trades, 'energyLevel', 'netPnl') },
    { factor: 'Focus Level', correlation: calculateCorrelation(trades, 'focusLevel', 'netPnl') },
    { factor: 'Meditation', correlation: calculateBooleanCorrelation(trades, 'meditationPractice', 'netPnl') }
  ]

  // Behavior patterns
  const behaviorPatterns = [
    { pattern: 'Followed Risk-Reward', count: trades.filter(t => t.followedRiskReward === true).length },
    { pattern: 'Followed Strategy', count: trades.filter(t => t.followedIntradayHunter === true).length },
    { pattern: 'Avoided Overtrading', count: trades.filter(t => t.overtrading === false).length },
    { pattern: 'Had Patience', count: trades.filter(t => t.hadPatienceWhileExiting === true).length }
  ]

  // Emotional states
  const emotionalStates = [
    { emotion: 'Greed', count: trades.filter(t => t.showedGreed === true).length },
    { emotion: 'Fear', count: trades.filter(t => t.showedFear === true).length },
    { emotion: 'Revenge Trading', count: trades.filter(t => t.revengeTrading === true).length },
    { emotion: 'Impulsive Trading', count: trades.filter(t => t.impulsiveTrading === true).length }
  ]

  return {
    psychologyTrends,
    pnlCorrelations,
    behaviorPatterns,
    emotionalStates
  }
}
