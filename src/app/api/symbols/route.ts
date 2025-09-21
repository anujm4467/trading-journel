import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const createSymbolSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  companyName: z.string().min(1, 'Company name is required'),
  industry: z.string().optional(),
  series: z.string().default('EQ'),
  isinCode: z.string().optional(),
  source: z.enum(['MANUAL', 'CSV_IMPORT', 'API']).default('MANUAL')
})


const searchQuerySchema = z.object({
  q: z.string().optional(),
  industry: z.string().optional(),
  series: z.string().optional(),
  isActive: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
})

// GET /api/symbols - Get all symbols with search and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchQuerySchema.parse({
      q: searchParams.get('q') || undefined,
      industry: searchParams.get('industry') || undefined,
      series: searchParams.get('series') || undefined,
      isActive: searchParams.get('isActive') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined
    })

    const page = parseInt(query.page || '1')
    const limit = Math.min(parseInt(query.limit || '50'), 100) // Max 100 per page
    const skip = (page - 1) * limit

    // Build where clause
    const where: Record<string, unknown> = {}
    
    if (query.q) {
      where.OR = [
        { symbol: { contains: query.q, mode: 'insensitive' } },
        { companyName: { contains: query.q, mode: 'insensitive' } },
        { industry: { contains: query.q, mode: 'insensitive' } }
      ]
    }
    
    if (query.industry) {
      where.industry = { contains: query.industry, mode: 'insensitive' }
    }
    
    if (query.series) {
      where.series = query.series
    }
    
    if (query.isActive !== undefined) {
      where.isActive = query.isActive === 'true'
    }

    // Get symbols with pagination
    const [symbols, total] = await Promise.all([
      prisma.stockSymbol.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { symbol: 'asc' }
        ]
      }),
      prisma.stockSymbol.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: symbols,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching symbols:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch symbols',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST /api/symbols - Create a new symbol
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createSymbolSchema.parse(body)

    // Check if symbol already exists
    const existingSymbol = await prisma.stockSymbol.findUnique({
      where: { symbol: validatedData.symbol.toUpperCase() }
    })

    if (existingSymbol) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Symbol already exists',
          details: `Symbol '${validatedData.symbol}' is already in the database`
        },
        { status: 409 }
      )
    }

    const symbol = await prisma.stockSymbol.create({
      data: {
        ...validatedData,
        symbol: validatedData.symbol.toUpperCase()
      }
    })

    return NextResponse.json({
      success: true,
      data: symbol,
      message: 'Symbol created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating symbol:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation error',
          details: error.issues
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create symbol',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT /api/symbols - Bulk create/update symbols (for CSV import)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { symbols, source = 'CSV_IMPORT' } = body

    if (!Array.isArray(symbols) || symbols.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid data',
          details: 'Symbols array is required and must not be empty'
        },
        { status: 400 }
      )
    }

    const results = {
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [] as string[]
    }

    // Process each symbol
    for (const symbolData of symbols) {
      try {
        const validatedData = createSymbolSchema.parse({
          ...symbolData,
          source
        })

        const symbol = validatedData.symbol.toUpperCase()

        // Check if symbol exists
        const existingSymbol = await prisma.stockSymbol.findUnique({
          where: { symbol }
        })

        if (existingSymbol) {
          // Update existing symbol
          await prisma.stockSymbol.update({
            where: { symbol },
            data: {
              companyName: validatedData.companyName,
              industry: validatedData.industry,
              series: validatedData.series,
              isinCode: validatedData.isinCode,
              source: validatedData.source,
              isActive: true
            }
          })
          results.updated++
        } else {
          // Create new symbol
          await prisma.stockSymbol.create({
            data: {
              ...validatedData,
              symbol
            }
          })
          results.created++
        }
      } catch (error) {
        const errorMessage = error instanceof z.ZodError
          ? `Validation error for symbol ${symbolData.symbol}: ${error.issues.map(e => e.message).join(', ')}`
          : `Error processing symbol ${symbolData.symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`
        
        results.errors.push(errorMessage)
        results.skipped++
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      message: `Processed ${symbols.length} symbols: ${results.created} created, ${results.updated} updated, ${results.skipped} skipped`
    })
  } catch (error) {
    console.error('Error bulk processing symbols:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process symbols',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
