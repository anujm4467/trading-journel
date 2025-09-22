import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PredictionAnalytics } from '@/types/prediction'

// GET /api/predictions/analytics - Get prediction analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')

    // Build date filter
    const dateFilter: any = {}
    if (fromDate) {
      dateFilter.gte = new Date(fromDate)
    }
    if (toDate) {
      dateFilter.lte = new Date(toDate)
    }

    const where = Object.keys(dateFilter).length > 0 ? { predictionDate: dateFilter } : {}

    // Get basic counts
    const [
      totalPredictions,
      pendingPredictions,
      passedPredictions,
      failedPredictions,
      allPredictions
    ] = await Promise.all([
      prisma.prediction.count({ where }),
      prisma.prediction.count({ where: { ...where, status: 'PENDING' } }),
      prisma.prediction.count({ where: { ...where, status: 'PASSED' } }),
      prisma.prediction.count({ where: { ...where, status: 'FAILED' } }),
      prisma.prediction.findMany({
        where,
        orderBy: { predictionDate: 'desc' },
        take: 10
      })
    ])

    // Calculate success rate
    const completedPredictions = passedPredictions + failedPredictions
    const successRate = completedPredictions > 0 ? (passedPredictions / completedPredictions) * 100 : 0

    // Calculate average confidence
    const confidenceData = await prisma.prediction.aggregate({
      where,
      _avg: { confidence: true }
    })
    const averageConfidence = confidenceData._avg.confidence || 0

    // Strategy performance
    const strategyData = await prisma.prediction.groupBy({
      by: ['strategy'],
      where,
      _count: { strategy: true },
      _avg: { confidence: true }
    })

    const strategyPerformance = await Promise.all(
      strategyData.map(async (strategy) => {
        const [passed, failed] = await Promise.all([
          prisma.prediction.count({
            where: { ...where, strategy: strategy.strategy, status: 'PASSED' }
          }),
          prisma.prediction.count({
            where: { ...where, strategy: strategy.strategy, status: 'FAILED' }
          })
        ])

        const total = passed + failed
        const successRate = total > 0 ? (passed / total) * 100 : 0

        return {
          strategy: strategy.strategy,
          totalPredictions: strategy._count.strategy,
          successRate,
          averageConfidence: strategy._avg.confidence || 0,
          passedCount: passed,
          failedCount: failed
        }
      })
    )

    // Confidence accuracy
    const confidenceAccuracy = []
    for (let i = 1; i <= 10; i++) {
      const [total, passed] = await Promise.all([
        prisma.prediction.count({
          where: { ...where, confidence: i }
        }),
        prisma.prediction.count({
          where: { ...where, confidence: i, status: 'PASSED' }
        })
      ])

      const successRate = total > 0 ? (passed / total) * 100 : 0
      const accuracy = total > 0 ? successRate : 0

      confidenceAccuracy.push({
        confidenceLevel: i,
        totalPredictions: total,
        successRate,
        accuracy
      })
    }

    // Monthly trends
    const monthlyData = await prisma.prediction.findMany({
      where,
      select: {
        predictionDate: true,
        status: true,
        confidence: true
      },
      orderBy: { predictionDate: 'asc' }
    })

    const monthlyTrends = monthlyData.reduce((acc, prediction) => {
      const month = new Date(prediction.predictionDate).toISOString().substring(0, 7)
      
      if (!acc[month]) {
        acc[month] = {
          month,
          totalPredictions: 0,
          passedPredictions: 0,
          totalConfidence: 0
        }
      }

      acc[month].totalPredictions++
      if (prediction.status === 'PASSED') {
        acc[month].passedPredictions++
      }
      acc[month].totalConfidence += prediction.confidence

      return acc
    }, {} as Record<string, any>)

    const monthlyTrendsArray = Object.values(monthlyTrends).map((trend: any) => ({
      month: trend.month,
      totalPredictions: trend.totalPredictions,
      successRate: trend.totalPredictions > 0 ? (trend.passedPredictions / trend.totalPredictions) * 100 : 0,
      averageConfidence: trend.totalPredictions > 0 ? trend.totalConfidence / trend.totalPredictions : 0
    }))

    const analytics: PredictionAnalytics = {
      totalPredictions,
      pendingPredictions,
      passedPredictions,
      failedPredictions,
      successRate,
      averageConfidence,
      strategyPerformance,
      confidenceAccuracy,
      monthlyTrends: monthlyTrendsArray,
      recentPredictions: allPredictions
    }

    return NextResponse.json({ data: analytics })
  } catch (error) {
    console.error('Error fetching prediction analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prediction analytics' },
      { status: 500 }
    )
  }
}
