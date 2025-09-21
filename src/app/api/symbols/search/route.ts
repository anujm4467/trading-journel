import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const searchQuerySchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  limit: z.string().optional(),
  includeInactive: z.string().optional()
})

// GET /api/symbols/search - Search symbols with autocomplete
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchQuerySchema.parse({
      q: searchParams.get('q') || undefined,
      limit: searchParams.get('limit') || undefined,
      includeInactive: searchParams.get('includeInactive') || undefined
    })

    const limit = Math.min(parseInt(query.limit || '20'), 50) // Max 50 for search results
    const includeInactive = query.includeInactive === 'true'

    // Build where clause for search (SQLite doesn't support mode: 'insensitive')
    const where: Record<string, unknown> = {
      OR: [
        { symbol: { contains: query.q } },
        { companyName: { contains: query.q } },
        { industry: { contains: query.q } }
      ]
    }

    if (!includeInactive) {
      where.isActive = true
    }

    const symbols = await prisma.stockSymbol.findMany({
      where,
      take: limit,
      orderBy: [
        // Prioritize exact symbol matches
        { symbol: 'asc' },
        // Then company name matches
        { companyName: 'asc' }
      ],
      select: {
        id: true,
        symbol: true,
        companyName: true,
        industry: true,
        series: true,
        isinCode: true,
        isActive: true
      }
    })

    // Sort results to prioritize exact matches and active symbols
    const sortedSymbols = symbols.sort((a, b) => {
      const queryLower = query.q.toLowerCase()
      
      // Exact symbol match gets highest priority
      if (a.symbol.toLowerCase() === queryLower && b.symbol.toLowerCase() !== queryLower) return -1
      if (b.symbol.toLowerCase() === queryLower && a.symbol.toLowerCase() !== queryLower) return 1
      
      // Symbol starts with query gets second priority
      if (a.symbol.toLowerCase().startsWith(queryLower) && !b.symbol.toLowerCase().startsWith(queryLower)) return -1
      if (b.symbol.toLowerCase().startsWith(queryLower) && !a.symbol.toLowerCase().startsWith(queryLower)) return 1
      
      // Active symbols get priority over inactive
      if (a.isActive && !b.isActive) return -1
      if (b.isActive && !a.isActive) return 1
      
      // Alphabetical order
      return a.symbol.localeCompare(b.symbol)
    })

    return NextResponse.json({
      success: true,
      data: sortedSymbols,
      query: query.q,
      count: sortedSymbols.length
    })
  } catch (error) {
    console.error('Error searching symbols:', error)
    
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
        error: 'Failed to search symbols',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
