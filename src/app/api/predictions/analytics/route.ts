import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PredictionAnalytics } from '@/types/prediction'

// Analytics calculation interfaces
interface StrategyStats {
  total: number
  passed: number
  failed: number
  confidenceSum: number
}

interface ConfidenceStats {
  total: number
  passed: number
  failed: number
}

interface DateFilter {
  gte?: Date
  lte?: Date
}

// GET /api/predictions/analytics - Get prediction analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')

    // Build date filter
    const dateFilter: DateFilter = {}
    if (fromDate) {
      dateFilter.gte = new Date(fromDate)
    }
    if (toDate) {
      dateFilter.lte = new Date(toDate)
    }

    const whereClause = Object.keys(dateFilter).length > 0 ? { predictionDate: dateFilter } : {}

    // Get all predictions for analytics
    const predictions = await prisma.prediction.findMany({
      where: whereClause,
      orderBy: { predictionDate: 'desc' }
    })

    // Calculate basic metrics
    const totalPredictions = predictions.length
    const pendingPredictions = predictions.filter(p => p.status === 'PENDING').length
    const passedPredictions = predictions.filter(p => p.status === 'PASSED').length
    const failedPredictions = predictions.filter(p => p.status === 'FAILED').length

    // Calculate success rate (only for completed predictions)
    const completedPredictions = passedPredictions + failedPredictions
    const successRate = completedPredictions > 0 ? (passedPredictions / completedPredictions) * 100 : 0

    // Calculate average confidence
    const averageConfidence = totalPredictions > 0 
      ? predictions.reduce((sum, p) => sum + p.confidence, 0) / totalPredictions 
      : 0

    // Strategy performance
    const strategyMap = new Map<string, StrategyStats>()

    predictions.forEach(prediction => {
      const strategy = prediction.strategy
      if (!strategyMap.has(strategy)) {
        strategyMap.set(strategy, { total: 0, passed: 0, failed: 0, confidenceSum: 0 })
      }
      
      const stats = strategyMap.get(strategy)!
      stats.total++
      stats.confidenceSum += prediction.confidence
      
      if (prediction.status === 'PASSED') stats.passed++
      if (prediction.status === 'FAILED') stats.failed++
    })

    const strategyPerformance = Array.from(strategyMap.entries()).map(([strategy, stats]) => ({
      strategy,
      totalPredictions: stats.total,
      successRate: stats.total > 0 ? (stats.passed / (stats.passed + stats.failed)) * 100 : 0,
      averageConfidence: stats.total > 0 ? stats.confidenceSum / stats.total : 0,
      passedCount: stats.passed,
      failedCount: stats.failed
    }))

    // Confidence accuracy
    const confidenceMap = new Map<number, ConfidenceStats>()

    predictions.forEach(prediction => {
      const confidence = prediction.confidence
      if (!confidenceMap.has(confidence)) {
        confidenceMap.set(confidence, { total: 0, passed: 0, failed: 0 })
      }
      
      const stats = confidenceMap.get(confidence)!
      stats.total++
      
      if (prediction.status === 'PASSED') stats.passed++
      if (prediction.status === 'FAILED') stats.failed++
    })

    const confidenceAccuracy = Array.from(confidenceMap.entries()).map(([confidence, stats]) => ({
      confidenceLevel: confidence,
      totalPredictions: stats.total,
      successRate: stats.total > 0 ? (stats.passed / (stats.passed + stats.failed)) * 100 : 0,
      accuracy: stats.total > 0 ? (stats.passed / (stats.passed + stats.failed)) * 100 : 0
    }))

    // Monthly trends (last 12 months)
    const monthlyTrends = []
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1)
      
      const monthPredictions = predictions.filter(p => {
        const predDate = new Date(p.predictionDate)
        return predDate >= date && predDate < nextMonth
      })
      
      const monthPassed = monthPredictions.filter(p => p.status === 'PASSED').length
      const monthFailed = monthPredictions.filter(p => p.status === 'FAILED').length
      const monthCompleted = monthPassed + monthFailed
      const monthSuccessRate = monthCompleted > 0 ? (monthPassed / monthCompleted) * 100 : 0
      const monthAvgConfidence = monthPredictions.length > 0 
        ? monthPredictions.reduce((sum, p) => sum + p.confidence, 0) / monthPredictions.length 
        : 0

      monthlyTrends.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        totalPredictions: monthPredictions.length,
        successRate: monthSuccessRate,
        averageConfidence: monthAvgConfidence
      })
    }

    // Recent predictions (last 10)
    const recentPredictions = predictions.slice(0, 10)

    const analytics: PredictionAnalytics = {
      totalPredictions,
      pendingPredictions,
      passedPredictions,
      failedPredictions,
      successRate,
      averageConfidence,
      strategyPerformance,
      confidenceAccuracy,
      monthlyTrends,
      recentPredictions
    }

    return NextResponse.json({ analytics })
  } catch (error) {
    console.error('Error fetching prediction analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
