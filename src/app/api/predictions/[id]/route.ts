import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'
// import { PredictionUpdateData } from '@/types/prediction'

// GET /api/predictions/[id] - Get a specific prediction
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // TODO: Implement prediction model in Prisma schema
  return NextResponse.json(
    { error: 'Prediction model not implemented yet' },
    { status: 501 }
  )
  
  /* try {
    const { id } = await params
    const prediction = await prisma.prediction.findUnique({
      where: { id }
    })

    if (!prediction) {
      return NextResponse.json(
        { error: 'Prediction not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: prediction })
  } catch (error) {
    console.error('Error fetching prediction:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prediction' },
      { status: 500 }
    )
  } */
}

// PUT /api/predictions/[id] - Update a prediction
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // TODO: Implement prediction model in Prisma schema
  return NextResponse.json(
    { error: 'Prediction model not implemented yet' },
    { status: 501 }
  )
}

// DELETE /api/predictions/[id] - Delete a prediction
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // TODO: Implement prediction model in Prisma schema
  return NextResponse.json(
    { error: 'Prediction model not implemented yet' },
    { status: 501 }
  )
}
