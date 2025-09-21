import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.string().optional()
})

// GET /api/symbols/csv-history - Get CSV import history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse({
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      status: searchParams.get('status') || undefined
    })

    const page = parseInt(query.page || '1')
    const limit = Math.min(parseInt(query.limit || '20'), 100)
    const skip = (page - 1) * limit

    // Build where clause
    const where: Record<string, unknown> = {}
    if (query.status) {
      where.status = query.status
    }

    // Get import history with pagination
    const [imports, total] = await Promise.all([
      prisma.csvImport.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          template: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        }
      }),
      prisma.csvImport.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: imports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching CSV import history:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch CSV import history',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
