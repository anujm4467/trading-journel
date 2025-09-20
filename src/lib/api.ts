// API utility functions for the trading journal

export interface ApiResponse<T> {
  data?: T
  success?: boolean
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Base API configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
      }
    }

    return { data }
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error)
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

// Trades API
export const tradesApi = {
  // Get all trades with filters
  async getTrades(params: {
    page?: number
    limit?: number
    search?: string
    instrumentType?: string
    side?: string
    strategy?: string
    dateFrom?: string
    dateTo?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  } = {}) {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    const queryString = searchParams.toString()
    return apiCall<PaginatedResponse<Record<string, unknown>>>(`/api/trades${queryString ? `?${queryString}` : ''}`)
  },

  // Get a specific trade
  async getTrade(id: string) {
    return apiCall<Record<string, unknown>>(`/api/trades/${id}`)
  },

  // Get a specific trade by ID (alias for getTrade)
  async getTradeById(id: string) {
    return apiCall<Record<string, unknown>>(`/api/trades/${id}`)
  },

  // Create a new trade
  async createTrade(tradeData: Record<string, unknown>) {
    return apiCall<Record<string, unknown>>('/api/trades', {
      method: 'POST',
      body: JSON.stringify(tradeData),
    })
  },

  // Update a trade
  async updateTrade(id: string, tradeData: Record<string, unknown>) {
    return apiCall<Record<string, unknown>>(`/api/trades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tradeData),
    })
  },

  // Delete a trade
  async deleteTrade(id: string) {
    return apiCall<{ message: string }>(`/api/trades/${id}`, {
      method: 'DELETE',
    })
  },

  // Bulk delete trades
  async deleteTrades(ids: string[]) {
    const deletePromises = ids.map(id => this.deleteTrade(id))
    const results = await Promise.all(deletePromises)
    
    const errors = results.filter(result => result.error)
    if (errors.length > 0) {
      return { error: `Failed to delete ${errors.length} trades` }
    }
    
    return { data: { message: `Successfully deleted ${ids.length} trades` } }
  }
}

// Analytics API
export const analyticsApi = {
  // Get analytics data
  async getAnalytics(params: {
    dateFrom?: string
    dateTo?: string
    strategy?: string
  } = {}) {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    const queryString = searchParams.toString()
    return apiCall<Record<string, unknown>>(`/api/analytics${queryString ? `?${queryString}` : ''}`)
  }
}

// Portfolio API
export const portfolioApi = {
  // Get portfolio data
  async getPortfolio() {
    return apiCall<Record<string, unknown>>('/api/portfolio')
  }
}

// Settings API
export const settingsApi = {
  // Get all settings
  async getSettings() {
    return apiCall<Record<string, Record<string, unknown>>>('/api/settings')
  },

  // Update settings for a category
  async updateSettings(category: string, data: Record<string, unknown>) {
    return apiCall<{ message: string }>('/api/settings', {
      method: 'POST',
      body: JSON.stringify({ category, data }),
    })
  },

  // Bulk update settings
  async updateAllSettings(settings: Record<string, Record<string, unknown>>) {
    return apiCall<{ message: string }>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    })
  }
}

// Export functions
export const exportApi = {
  // Export trades to CSV
  async exportTradesCSV(params: Record<string, unknown> = {}) {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    const queryString = searchParams.toString()
    const response = await fetch(`/api/export/trades/csv${queryString ? `?${queryString}` : ''}`)
    
    if (!response.ok) {
      throw new Error('Export failed')
    }
    
    return response.blob()
  },

  // Export trades to Excel
  async exportTradesExcel(params: Record<string, unknown> = {}) {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    const queryString = searchParams.toString()
    const response = await fetch(`/api/export/trades/excel${queryString ? `?${queryString}` : ''}`)
    
    if (!response.ok) {
      throw new Error('Export failed')
    }
    
    return response.blob()
  },

  // Export trades to PDF
  async exportTradesPDF(params: Record<string, unknown> = {}) {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    const queryString = searchParams.toString()
    const response = await fetch(`/api/export/trades/pdf${queryString ? `?${queryString}` : ''}`)
    
    if (!response.ok) {
      throw new Error('Export failed')
    }
    
    return response.blob()
  }
}

// Utility functions
export const apiUtils = {
  // Handle API errors
  handleError(error: unknown): string {
    if (typeof error === 'string') return error
    if (error && typeof error === 'object' && 'message' in error) return (error as { message: string }).message
    if (error && typeof error === 'object' && 'error' in error) return (error as { error: string }).error
    return 'An unexpected error occurred'
  },

  // Download file from blob
  downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  },

  // Format date for API
  formatDateForAPI(date: Date): string {
    return date.toISOString()
  },

  // Parse date from API
  parseDateFromAPI(dateString: string): Date {
    return new Date(dateString)
  }
}
