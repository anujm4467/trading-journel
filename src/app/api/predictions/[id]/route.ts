import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PredictionUpdateData } from '@/types/prediction'

// GET /api/predictions/[id] - Get a specific prediction
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prediction = await prisma.prediction.findUnique({
      where: { id: params.id }
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
  }
}

// PUT /api/predictions/[id] - Update a prediction
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: PredictionUpdateData = await request.json()

    // Validate status
    const validStatuses = ['PENDING', 'PASSED', 'FAILED']
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Validate result
    const validResults = ['SUCCESS', 'FAILURE']
    if (body.result && !validResults.includes(body.result)) {
      return NextResponse.json(
        { error: 'Invalid result' },
        { status: 400 }
      )
    }

    // If status is FAILED, result should be FAILURE
    if (body.status === 'FAILED' && body.result !== 'FAILURE') {
      body.result = 'FAILURE'
    }

    // If status is PASSED, result should be SUCCESS
    if (body.status === 'PASSED' && body.result !== 'SUCCESS') {
      body.result = 'SUCCESS'
    }

    const prediction = await prisma.prediction.update({
      where: { id: params.id },
      data: {
        ...body,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      data: prediction,
      message: 'Prediction updated successfully'
    })
  } catch (error) {
    console.error('Error updating prediction:', error)
    return NextResponse.json(
      { error: 'Failed to update prediction' },
      { status: 500 }
    )
  }
}

// DELETE /api/predictions/[id] - Delete a prediction
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.prediction.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'Prediction deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting prediction:', error)
    return NextResponse.json(
      { error: 'Failed to delete prediction' },
      { status: 500 }
    )
  }
}
