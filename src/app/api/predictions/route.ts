import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PredictionFormData, PredictionFilters } from '@/types/prediction'

// GET /api/predictions - Get all predictions with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')
    const strategy = searchParams.get('strategy')
    const search = searchParams.get('search')
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')
    const minConfidence = searchParams.get('minConfidence')
    const maxConfidence = searchParams.get('maxConfidence')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (strategy) {
      where.strategy = {
        contains: strategy,
        mode: 'insensitive'
      }
    }

    if (search) {
      where.OR = [
        { strategy: { contains: search, mode: 'insensitive' } },
        { strategyNotes: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (fromDate || toDate) {
      where.predictionDate = {}
      if (fromDate) {
        where.predictionDate.gte = new Date(fromDate)
      }
      if (toDate) {
        where.predictionDate.lte = new Date(toDate)
      }
    }

    if (minConfidence || maxConfidence) {
      where.confidence = {}
      if (minConfidence) {
        where.confidence.gte = parseInt(minConfidence)
      }
      if (maxConfidence) {
        where.confidence.lte = parseInt(maxConfidence)
      }
    }

    const [predictions, total] = await Promise.all([
      prisma.prediction.findMany({
        where,
        orderBy: { predictionDate: 'desc' },
        skip,
        take: limit
      }),
      prisma.prediction.count({ where })
    ])

    return NextResponse.json({
      data: predictions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching predictions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch predictions' },
      { status: 500 }
    )
  }
}

// POST /api/predictions - Create a new prediction
export async function POST(request: NextRequest) {
  try {
    const body: PredictionFormData = await request.json()

    // Validate required fields
    if (!body.predictionDate || !body.strategy || !body.direction || !body.confidence) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate confidence range
    if (body.confidence < 1 || body.confidence > 10) {
      return NextResponse.json(
        { error: 'Confidence must be between 1 and 10' },
        { status: 400 }
      )
    }

    const prediction = await prisma.prediction.create({
      data: {
        predictionDate: new Date(body.predictionDate),
        strategy: body.strategy,
        direction: body.direction,
        strategyNotes: body.strategyNotes || null,
        confidence: body.confidence,
        notes: body.notes || null,
        status: 'PENDING'
      }
    })

    return NextResponse.json({
      data: prediction,
      message: 'Prediction created successfully'
    })
  } catch (error) {
    console.error('Error creating prediction:', error)
    return NextResponse.json(
      { error: 'Failed to create prediction' },
      { status: 500 }
    )
  }
}
