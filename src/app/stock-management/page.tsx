'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Database, 
  Upload, 
  Trash2, 
  Edit, 
  Plus,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SymbolSearchInput } from '@/components/forms/SymbolSearchInput'

interface StockSymbol {
  id: string
  symbol: string
  companyName: string
  industry?: string
  series: string
  isinCode?: string
  isActive: boolean
  source: string
  createdAt: string
  updatedAt: string
}

interface CsvImport {
  id: string
  fileName: string
  totalRows: number
  processedRows: number
  successRows: number
  errorRows: number
  duplicateRows: number
  status: string
  createdAt: string
  completedAt?: string
}

export default function StockManagementPage() {
  const [symbols, setSymbols] = useState<StockSymbol[]>([])
  const [imports, setImports] = useState<CsvImport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSymbol, setSelectedSymbol] = useState('')
  const [activeTab, setActiveTab] = useState('symbols')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch symbols
  const fetchSymbols = async () => {
    try {
      const response = await fetch('/api/symbols')
      const result = await response.json()
      if (result.success) {
        setSymbols(result.data)
      }
    } catch (error) {
      console.error('Error fetching symbols:', error)
    }
  }

  // Fetch import history
  const fetchImports = async () => {
    try {
      const response = await fetch('/api/symbols/csv-history')
      const result = await response.json()
      if (result.success) {
        setImports(result.data)
      }
    } catch (error) {
      console.error('Error fetching imports:', error)
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

      setUploadSuccess(true)
      
      // Refresh data
      await Promise.all([fetchSymbols(), fetchImports()])
      
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

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([fetchSymbols(), fetchImports()])
      setIsLoading(false)
    }
    loadData()
  }, [])

  // Refresh symbols when a new symbol is selected (in case it was imported)
  useEffect(() => {
    if (selectedSymbol) {
      fetchSymbols()
    }
  }, [selectedSymbol])


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />
      case 'PROCESSING':
        return <Clock className="h-4 w-4" />
      case 'FAILED':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto p-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
      />
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Stock Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage stock symbols and CSV imports
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
            <TabsTrigger value="symbols" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Stock Symbols ({symbols.length})
            </TabsTrigger>
            <TabsTrigger value="imports" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import History ({imports.length})
            </TabsTrigger>
          </TabsList>

          {/* Stock Symbols Tab */}
          <TabsContent value="symbols" className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl border border-white/20">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Stock Symbols
                  </h2>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchSymbols}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Symbol
                    </Button>
                  </div>
                </div>

                {/* CSV Upload Section */}
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="text-lg font-medium text-green-900 dark:text-green-100 mb-2">
                    Import Stock Symbols from CSV
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                    Upload a CSV file to import multiple stock symbols at once. Use the search box below to find existing symbols or import new ones.
                  </p>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="search">Search & Import Symbols</Label>
                    <SymbolSearchInput
                      value={selectedSymbol}
                      onChange={setSelectedSymbol}
                      placeholder="Search by symbol, company name, or industry... Or import from CSV"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Use the search to find existing symbols or click the upload icon to import from CSV
                    </p>
                  </div>
                  <div className="sm:w-48">
                    <Label htmlFor="source-filter">Filter by Source</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All sources" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        <SelectItem value="MANUAL">Manual</SelectItem>
                        <SelectItem value="CSV_IMPORT">CSV Import</SelectItem>
                        <SelectItem value="API">API</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Symbols Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Symbol
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Company Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Industry
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Series
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Source
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {isLoading ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center">
                            <div className="flex items-center justify-center">
                              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                              Loading symbols...
                            </div>
                          </td>
                        </tr>
                      ) : symbols.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                            No symbols found. Import some symbols to get started.
                          </td>
                        </tr>
                      ) : (
                        symbols.map((symbol) => (
                          <tr key={symbol.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {symbol.symbol}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900 dark:text-gray-100">
                                {symbol.companyName}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {symbol.industry || '-'}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <Badge variant="outline" className="text-xs">
                                {symbol.series}
                              </Badge>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  symbol.source === 'CSV_IMPORT' 
                                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                    : symbol.source === 'MANUAL'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-purple-50 text-purple-700 border-purple-200'
                                }`}
                              >
                                {symbol.source}
                              </Badge>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  symbol.isActive 
                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                    : 'bg-red-50 text-red-700 border-red-200'
                                }`}
                              >
                                {symbol.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Import History Tab */}
          <TabsContent value="imports" className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl border border-white/20">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Import History
                  </h2>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchImports}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      {isUploading ? 'Processing...' : 'Import CSV'}
                    </Button>
                  </div>
                </div>

                {/* CSV Upload Section */}
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Upload New CSV File
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                    Upload a CSV file to import stock symbols. Switch to the "Stock Symbols" tab to use the upload interface.
                  </p>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isUploading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {isUploading ? 'Processing...' : 'Upload CSV File'}
                  </Button>
                </div>

                {/* Upload Status Messages */}
                {uploadError && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-700 dark:text-red-300">
                        {uploadError}
                      </span>
                    </div>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700 dark:text-green-300">
                        CSV file uploaded successfully! The data has been processed and added to your symbols.
                      </span>
                    </div>
                  </div>
                )}

                {/* Import Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Imports</p>
                        <p className="text-2xl font-bold text-blue-600">{imports.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">Successful</p>
                        <p className="text-2xl font-bold text-green-600">
                          {imports.filter(imp => imp.status === 'COMPLETED').length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                    <div className="flex items-center">
                      <Clock className="h-8 w-8 text-yellow-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Processing</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {imports.filter(imp => imp.status === 'PROCESSING').length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-8 w-8 text-red-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-900 dark:text-red-100">Failed</p>
                        <p className="text-2xl font-bold text-red-600">
                          {imports.filter(imp => imp.status === 'FAILED').length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Imports Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          File Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Rows
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Success
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Errors
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Duplicates
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {isLoading ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center">
                            <div className="flex items-center justify-center">
                              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                              Loading imports...
                            </div>
                          </td>
                        </tr>
                      ) : imports.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                            No imports found. Upload a CSV file to get started.
                          </td>
                        </tr>
                      ) : (
                        imports.map((importItem) => (
                          <tr key={importItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <FileText className="h-5 w-5 text-gray-400 mr-3" />
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {importItem.fileName}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getStatusColor(importItem.status)}`}
                              >
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(importItem.status)}
                                  {importItem.status}
                                </div>
                              </Badge>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {importItem.totalRows}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600">
                              {importItem.successRows}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600">
                              {importItem.errorRows}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-yellow-600">
                              {importItem.duplicateRows}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(importItem.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Floating Action Button for CSV Upload */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            size="lg"
            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setActiveTab('symbols')}
            title="Upload CSV File"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload CSV
          </Button>
        </div>
    </div>
  )
}
