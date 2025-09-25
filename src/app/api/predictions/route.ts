import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PredictionFormData } from '@/types/prediction'
import { Prisma, PredictionStatus } from '@prisma/client'

// GET /api/predictions - Get all predictions with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const direction = searchParams.get('direction')
    const strategy = searchParams.get('strategy')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    const where: Prisma.PredictionWhereInput = {}
    
    if (status) {
      where.status = status as PredictionStatus
    }
    if (direction) {
      where.direction = direction as any
    }
    if (strategy) {
      where.strategy = {
        contains: strategy,
        mode: 'insensitive'
      }
    }

    const [predictions, total] = await Promise.all([
      prisma.prediction.findMany({
        where,
        orderBy: { predictionDate: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.prediction.count({ where })
    ])

    return NextResponse.json({
      predictions,
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
    const data: PredictionFormData = await request.json()
    
    const prediction = await prisma.prediction.create({
      data: {
        predictionDate: data.predictionDate,
        strategy: data.strategy,
        direction: data.direction,
        strategyNotes: data.strategyNotes,
        confidence: data.confidence,
        notes: data.notes,
        status: 'PENDING'
      }
    })

    return NextResponse.json(prediction, { status: 201 })
  } catch (error) {
    console.error('Error creating prediction:', error)
    return NextResponse.json(
      { error: 'Failed to create prediction' },
      { status: 500 }
    )
  }
}