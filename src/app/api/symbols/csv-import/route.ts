import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const csvUploadSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  headers: z.array(z.string()).min(1, 'Headers are required'),
  data: z.array(z.array(z.string())).min(1, 'Data rows are required'),
  columnMapping: z.record(z.string(), z.string()).optional()
})

// POST /api/symbols/csv-import - Import symbols from CSV with column mapping
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = csvUploadSchema.parse(body)

    const { fileName, headers, data, columnMapping } = validatedData

    // Create column mapping if not provided
    const mapping = columnMapping || createDefaultColumnMapping(headers)
    
    // Validate required columns are mapped
    const requiredFields = ['symbol', 'companyName']
    const missingFields = requiredFields.filter(field => !mapping[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required column mappings',
          details: `Required fields not mapped: ${missingFields.join(', ')}`
        },
        { status: 400 }
      )
    }

    // Create CSV import record
    const csvImport = await prisma.csvImport.create({
      data: {
        fileName,
        originalHeaders: headers,
        columnMapping: mapping,
        totalRows: data.length,
        processedRows: 0,
        successRows: 0,
        errorRows: 0,
        duplicateRows: 0,
        status: 'PROCESSING'
      }
    })

    const results = {
      total: data.length,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [] as Array<{ row: number; symbol: string; error: string }>,
      duplicates: [] as string[]
    }

    // Track processed symbols to detect duplicates within the import
    const processedSymbols = new Set<string>()

    // Process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      
      try {
        // Map row data using column mapping
        const symbolData = mapRowData(row, headers, mapping)
        
        if (!symbolData.symbol || !symbolData.companyName) {
          results.errors.push({
            row: i + 1,
            symbol: symbolData.symbol || 'Unknown',
            error: 'Missing required fields (symbol or company name)'
          })
          results.skipped++
          continue
        }

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
          // Update existing symbol
          await prisma.stockSymbol.update({
            where: { symbol },
            data: {
              companyName: symbolData.companyName,
              industry: symbolData.industry,
              series: symbolData.series || 'EQ',
              isinCode: symbolData.isinCode,
              source: 'CSV_IMPORT',
              isActive: true,
              updatedAt: new Date()
            }
          })
          results.updated++
        } else {
          // Create new symbol
          await prisma.stockSymbol.create({
            data: {
              symbol,
              companyName: symbolData.companyName,
              industry: symbolData.industry,
              series: symbolData.series || 'EQ',
              isinCode: symbolData.isinCode,
              source: 'CSV_IMPORT',
              isActive: true
            }
          })
          results.created++
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        
        results.errors.push({
          row: i + 1,
          symbol: row[mapping.symbol ? headers.indexOf(mapping.symbol) : 0] || 'Unknown',
          error: errorMessage
        })
        results.skipped++
      }
    }

    // Update CSV import record with results
    await prisma.csvImport.update({
      where: { id: csvImport.id },
      data: {
        processedRows: data.length,
        successRows: results.created + results.updated,
        errorRows: results.errors.length,
        duplicateRows: results.duplicates.length,
        status: 'COMPLETED',
        completedAt: new Date()
      }
    })

    // Prepare response message
    let message = `Import completed: ${results.created} created`
    if (results.updated > 0) message += `, ${results.updated} updated`
    if (results.skipped > 0) message += `, ${results.skipped} skipped`
    if (results.duplicates.length > 0) message += `, ${results.duplicates.length} duplicates found`

    return NextResponse.json({
      success: true,
      data: {
        importId: csvImport.id,
        results,
        columnMapping: mapping
      },
      message
    })
  } catch (error) {
    console.error('Error importing CSV:', error)
    
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
        error: 'Failed to import CSV',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Helper function to create default column mapping
function createDefaultColumnMapping(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {}
  
  // Common variations of column names
  const columnVariations = {
    symbol: ['symbol', 'ticker', 'code', 'stock code', 'symbol/ticker'],
    companyName: ['company name', 'company', 'name', 'company n industry', 'company & industry'],
    industry: ['industry', 'sector', 'category'],
    series: ['series', 'type', 'class'],
    isinCode: ['isin code', 'isin', 'isincode', 'isn code']
  }

  // Map each field to the best matching header
  Object.entries(columnVariations).forEach(([field, variations]) => {
    for (const variation of variations) {
      const matchingHeader = headers.find(header => 
        header.toLowerCase().includes(variation.toLowerCase()) ||
        variation.toLowerCase().includes(header.toLowerCase())
      )
      if (matchingHeader) {
        mapping[field] = matchingHeader
        break
      }
    }
  })

  return mapping
}

// Helper function to map row data using column mapping
function mapRowData(row: string[], headers: string[], mapping: Record<string, string>) {
  const result: Record<string, string> = {}
  
  Object.entries(mapping).forEach(([field, headerName]) => {
    const headerIndex = headers.indexOf(headerName)
    if (headerIndex !== -1 && row[headerIndex]) {
      result[field] = row[headerIndex].trim().replace(/"/g, '')
    }
  })
  
  return result
}
