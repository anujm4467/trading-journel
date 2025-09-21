'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Upload, 
  X, 
  Check, 
  AlertCircle, 
  FileText,
  Download,
  Loader2
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

interface StockSymbol {
  symbol: string
  companyName: string
  industry: string
  series: string
  isinCode: string
}

interface SymbolSearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

// Mock stock data - In a real app, this would come from an API
const mockStockData: StockSymbol[] = [
  { symbol: 'RELIANCE', companyName: 'Reliance Industries Ltd', industry: 'Oil & Gas', series: 'EQ', isinCode: 'INE002A01018' },
  { symbol: 'TCS', companyName: 'Tata Consultancy Services Ltd', industry: 'IT', series: 'EQ', isinCode: 'INE467B01029' },
  { symbol: 'HDFCBANK', companyName: 'HDFC Bank Ltd', industry: 'Banking', series: 'EQ', isinCode: 'INE040A01034' },
  { symbol: 'INFY', companyName: 'Infosys Ltd', industry: 'IT', series: 'EQ', isinCode: 'INE009A01021' },
  { symbol: 'HINDUNILVR', companyName: 'Hindustan Unilever Ltd', industry: 'FMCG', series: 'EQ', isinCode: 'INE030A01027' },
  { symbol: 'ITC', companyName: 'ITC Ltd', industry: 'FMCG', series: 'EQ', isinCode: 'INE154A01025' },
  { symbol: 'SBIN', companyName: 'State Bank of India', industry: 'Banking', series: 'EQ', isinCode: 'INE062A01020' },
  { symbol: 'BHARTIARTL', companyName: 'Bharti Airtel Ltd', industry: 'Telecom', series: 'EQ', isinCode: 'INE397D01024' },
  { symbol: 'KOTAKBANK', companyName: 'Kotak Mahindra Bank Ltd', industry: 'Banking', series: 'EQ', isinCode: 'INE237A01028' },
  { symbol: 'LT', companyName: 'Larsen & Toubro Ltd', industry: 'Engineering', series: 'EQ', isinCode: 'INE018A01030' },
  { symbol: 'NIFTY50', companyName: 'Nifty 50 Index', industry: 'Index', series: 'EQ', isinCode: 'NIFTY50' },
  { symbol: 'BANKNIFTY', companyName: 'Bank Nifty Index', industry: 'Index', series: 'EQ', isinCode: 'BANKNIFTY' },
  { symbol: 'FINNIFTY', companyName: 'Fin Nifty Index', industry: 'Index', series: 'EQ', isinCode: 'FINNIFTY' },
]

export function SymbolSearchInput({ 
  value, 
  onChange, 
  placeholder = "Search symbol...", 
  className = "",
  disabled = false 
}: SymbolSearchInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredSymbols, setFilteredSymbols] = useState<StockSymbol[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [importedSymbols, setImportedSymbols] = useState<StockSymbol[]>([])
  const [showImportModal, setShowImportModal] = useState(false)
  const [showImportedTable, setShowImportedTable] = useState(false)
  const [duplicateWarning, setDuplicateWarning] = useState<string[]>([])
  
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Search symbols from backend API
  const searchSymbols = useCallback(async (query: string) => {
    try {
      const response = await fetch(`/api/symbols/search?q=${encodeURIComponent(query)}&limit=20`)
      const result = await response.json()
      
      if (result.success) {
        // Convert backend format to frontend format
        const backendSymbols: StockSymbol[] = result.data.map((item: Record<string, unknown>) => ({
          symbol: item.symbol,
          companyName: item.companyName,
          industry: item.industry || '',
          series: item.series || 'EQ',
          isinCode: item.isinCode || ''
        }))
        
        // Combine with imported symbols and remove duplicates
        const allSymbols = [...backendSymbols, ...importedSymbols]
        const uniqueSymbols = allSymbols.filter((symbol, index, self) => 
          index === self.findIndex(s => s.symbol === symbol.symbol)
        )
        
        setFilteredSymbols(uniqueSymbols)
      } else {
        // Fallback to local search
        const queryLower = query.toLowerCase()
        const filtered = [...mockStockData, ...importedSymbols].filter(symbol =>
          symbol.symbol.toLowerCase().includes(queryLower) ||
          symbol.companyName.toLowerCase().includes(queryLower) ||
          symbol.industry.toLowerCase().includes(queryLower)
        )
        setFilteredSymbols(filtered)
      }
    } catch (error) {
      console.error('Error searching symbols:', error)
      // Fallback to local search
      const queryLower = query.toLowerCase()
      const filtered = [...mockStockData, ...importedSymbols].filter(symbol =>
        symbol.symbol.toLowerCase().includes(queryLower) ||
        symbol.companyName.toLowerCase().includes(queryLower) ||
        symbol.industry.toLowerCase().includes(queryLower)
      )
      setFilteredSymbols(filtered)
    }
    
    setSelectedIndex(-1)
  }, [importedSymbols])

  // Filter symbols based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSymbols([])
      return
    }

    // Search in backend first, then fallback to local data
    searchSymbols(searchQuery)
  }, [searchQuery, searchSymbols])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredSymbols.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < filteredSymbols.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSymbols.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < filteredSymbols.length) {
          handleSymbolSelect(filteredSymbols[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSearchQuery('')
        break
    }
  }

  // Handle symbol selection
  const handleSymbolSelect = (symbol: StockSymbol) => {
    onChange(symbol.symbol)
    setSearchQuery('')
    setIsOpen(false)
    setSelectedIndex(-1)
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchQuery(newValue)
    setIsOpen(true)
    
    // If user types directly, update the value
    if (!isOpen) {
      onChange(newValue)
    }
  }

  // Handle input focus
  const handleInputFocus = () => {
    setIsOpen(true)
    if (searchQuery) {
      setSearchQuery('')
    }
  }

  // Handle CSV file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError(null)
    setUploadSuccess(false)

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      
      if (lines.length === 0) {
        throw new Error('File is empty')
      }

      // Parse CSV data
      const headers = lines[0].split(',').map(h => h.trim())
      const data = lines.slice(1).map(line => 
        line.split(',').map(v => v.trim().replace(/"/g, ''))
      )

      // Send to backend for processing
      const response = await fetch('/api/symbols/csv-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          headers,
          data
        })
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to import CSV')
      }

      // Convert backend response to frontend format
      const symbols: StockSymbol[] = []
      const seenSymbols = new Set<string>()
      const duplicates: string[] = []

      // Process the data using the column mapping from backend
      const columnMapping = result.data.columnMapping
      
      for (let i = 0; i < data.length; i++) {
        const row = data[i]
        
        const symbol = getMappedValue(row, headers, columnMapping.symbol)?.toUpperCase() || ''
        const companyName = getMappedValue(row, headers, columnMapping.companyName) || ''
        const industry = getMappedValue(row, headers, columnMapping.industry) || companyName
        const series = getMappedValue(row, headers, columnMapping.series) || 'EQ'
        const isinCode = getMappedValue(row, headers, columnMapping.isinCode) || ''
        
        if (symbol && companyName) {
          // Check for duplicates within the CSV
          if (seenSymbols.has(symbol)) {
            duplicates.push(symbol)
          } else {
            seenSymbols.add(symbol)
            symbols.push({
              symbol,
              companyName,
              industry,
              series,
              isinCode
            })
          }
        }
      }

      if (symbols.length === 0) {
        throw new Error('No valid symbols found in CSV')
      }

      // Show warning if duplicates found
      if (duplicates.length > 0) {
        console.warn('Duplicate symbols found in CSV:', duplicates)
        setDuplicateWarning(duplicates)
      } else {
        setDuplicateWarning([])
      }

      setImportedSymbols(symbols)
      setUploadSuccess(true)
      setShowImportedTable(true)
      setShowImportModal(false)
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to process CSV file')
    } finally {
      setIsUploading(false)
    }
  }

  // Helper function to get mapped value from row
  const getMappedValue = (row: string[], headers: string[], mappedHeader: string): string | undefined => {
    if (!mappedHeader) return undefined
    const index = headers.indexOf(mappedHeader)
    return index !== -1 ? row[index] : undefined
  }

  // Download sample CSV
  const downloadSampleCSV = () => {
    const sampleData = [
      'Company N Industry,Symbol,Series,ISIN Code',
      'Reliance Industries Ltd,RELIANCE,EQ,INE002A01018',
      'Tata Consultancy Services Ltd,TCS,EQ,INE467B01029',
      'HDFC Bank Ltd,HDFCBANK,EQ,INE040A01034',
      'Infosys Ltd,INFY,EQ,INE009A01021',
      'Hindustan Unilever Ltd,HINDUNILVR,EQ,INE030A01027'
    ].join('\n')

    const blob = new Blob([sampleData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample_symbols.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <div className="relative">
        <Input
          ref={inputRef}
          value={isOpen ? searchQuery : value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-24"
        />
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {importedSymbols.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowImportedTable(true)}
              className="h-6 w-6 p-0 hover:bg-gray-100"
              disabled={disabled}
              title={`View ${importedSymbols.length} imported symbols`}
            >
              <FileText className="h-3 w-3" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log('Upload button clicked')
              fileInputRef.current?.click()
            }}
            className="h-6 w-6 p-0 hover:bg-gray-100 bg-blue-50 hover:bg-blue-100"
            disabled={disabled}
            title="Import CSV"
          >
            <Upload className="h-3 w-3 text-blue-600" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery('')
              setIsOpen(true)
            }}
            className="h-6 w-6 p-0 hover:bg-gray-100"
            disabled={disabled}
            title="Search symbols"
          >
            <Search className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && filteredSymbols.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {filteredSymbols.map((symbol, index) => (
              <div
                key={`${symbol.symbol}-${index}`}
                className={`px-4 py-3 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => handleSymbolSelect(symbol)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {symbol.symbol}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {symbol.companyName}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {symbol.series}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowImportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Import Stock Symbols
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImportModal(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Upload CSV File</Label>
                  <div className="mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full"
                    >
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      {isUploading ? 'Processing...' : 'Choose CSV File'}
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={downloadSampleCSV}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Sample CSV
                  </Button>
                </div>

                {uploadError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-700 dark:text-red-300">
                      {uploadError}
                    </span>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700 dark:text-green-300">
                        Successfully imported {importedSymbols.length} symbols! Click &quot;View Imported&quot; to see the list.
                      </span>
                    </div>
                    {duplicateWarning.length > 0 && (
                      <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <div className="text-sm text-yellow-700 dark:text-yellow-300">
                          <p className="font-medium">Duplicates found and skipped:</p>
                          <p className="text-xs mt-1">{duplicateWarning.join(', ')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p className="font-medium mb-1">Required CSV format:</p>
                  <p>Company N Industry, Symbol, Series, ISIN Code</p>
                  <p className="mt-1 text-xs">Note: &quot;Company N Industry&quot; will be mapped to Company Name</p>
                </div>
              </div>

              <div className="flex justify-between gap-2 mt-6">
                {importedSymbols.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowImportModal(false)
                      setShowImportedTable(true)
                    }}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    View Imported ({importedSymbols.length})
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setShowImportModal(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Imported Symbols Table Modal */}
      <AnimatePresence>
        {showImportedTable && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowImportedTable(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Imported Stock Symbols ({importedSymbols.length})
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImportedSymbols([])
                      setShowImportedTable(false)
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowImportedTable(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[60vh]">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Symbol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Company Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Series
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          ISIN Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {importedSymbols.map((symbol, index) => (
                        <tr key={`${symbol.symbol}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {symbol.symbol}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {symbol.companyName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline" className="text-xs">
                              {symbol.series}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {symbol.isinCode}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                handleSymbolSelect(symbol)
                                setShowImportedTable(false)
                              }}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Select
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {importedSymbols.length} symbols imported
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowImportedTable(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
