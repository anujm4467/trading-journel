import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PredictionUpdateData } from '@/types/prediction'

// GET /api/predictions/[id] - Get a specific prediction
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    return NextResponse.json({ prediction })
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data: PredictionUpdateData = await request.json()
    
    // Prepare update data, handling empty strings properly
    const updateData: any = {
      status: data.status,
      notes: data.notes || null
    }

    // Handle result field - only set if it's a valid enum value, otherwise set to null
    if (data.result && (data.result === 'SUCCESS' || data.result === 'FAILURE')) {
      updateData.result = data.result
    } else {
      updateData.result = null
    }

    // Handle actualDirection - only set if provided
    if (data.actualDirection) {
      updateData.actualDirection = data.actualDirection
    }

    // Handle actualNotes - only set if provided
    if (data.actualNotes) {
      updateData.actualNotes = data.actualNotes
    }

    // Handle failureReason - only set if provided
    if (data.failureReason) {
      updateData.failureReason = data.failureReason
    }

    const prediction = await prisma.prediction.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ prediction })
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.prediction.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting prediction:', error)
    return NextResponse.json(
      { error: 'Failed to delete prediction' },
      { status: 500 }
    )
  }
}
