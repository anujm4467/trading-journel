import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const csvImportSchema = z.object({
  symbols: z.array(z.object({
    symbol: z.string().min(1, 'Symbol is required'),
    companyName: z.string().min(1, 'Company name is required'),
    industry: z.string().optional(),
    series: z.string().default('EQ'),
    isinCode: z.string().optional()
  })).min(1, 'At least one symbol is required'),
  source: z.enum(['CSV_IMPORT', 'API']).default('CSV_IMPORT'),
  replaceExisting: z.boolean().default(false)
})

// POST /api/symbols/import - Import symbols from CSV data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = csvImportSchema.parse(body)

    const results = {
      total: validatedData.symbols.length,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [] as Array<{ symbol: string; error: string }>,
      duplicates: [] as string[]
    }

    // Track processed symbols to detect duplicates within the import
    const processedSymbols = new Set<string>()

    // Process each symbol
    for (const symbolData of validatedData.symbols) {
      try {
        const symbol = symbolData.symbol.toUpperCase()

        // Check for duplicates within the import batch
        if (processedSymbols.has(symbol)) {
          results.duplicates.push(symbol)
          results.skipped++
          continue
        }
        processedSymbols.add(symbol)

        // Check if symbol exists in database
        const existingSymbol = await prisma.stockSymbol.findUnique({
          where: { symbol }
        })

        if (existingSymbol) {
          if (validatedData.replaceExisting) {
            // Update existing symbol
            await prisma.stockSymbol.update({
              where: { symbol },
              data: {
                companyName: symbolData.companyName,
                industry: symbolData.industry,
                series: symbolData.series,
                isinCode: symbolData.isinCode,
                source: validatedData.source,
                isActive: true,
                updatedAt: new Date()
              }
            })
            results.updated++
          } else {
            // Skip existing symbol
            results.skipped++
          }
        } else {
          // Create new symbol
          await prisma.stockSymbol.create({
            data: {
              symbol,
              companyName: symbolData.companyName,
              industry: symbolData.industry,
              series: symbolData.series,
              isinCode: symbolData.isinCode,
              source: validatedData.source,
              isActive: true
            }
          })
          results.created++
        }
      } catch (error) {
        const errorMessage = error instanceof z.ZodError
          ? error.issues.map(e => e.message).join(', ')
          : error instanceof Error ? error.message : 'Unknown error'
        
        results.errors.push({
          symbol: symbolData.symbol,
          error: errorMessage
        })
        results.skipped++
      }
    }

    // Prepare response message
    let message = `Import completed: ${results.created} created`
    if (results.updated > 0) message += `, ${results.updated} updated`
    if (results.skipped > 0) message += `, ${results.skipped} skipped`
    if (results.duplicates.length > 0) message += `, ${results.duplicates.length} duplicates found`

    return NextResponse.json({
      success: true,
      data: results,
      message
    })
  } catch (error) {
    console.error('Error importing symbols:', error)
    
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
        error: 'Failed to import symbols',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
