import { useState, useEffect, useCallback } from 'react'
import { tradesApi, ApiResponse } from '@/lib/api'
import { Trade } from '@/types/trade'

export interface TradesFilters {
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
}

export interface UseTradesReturn {
  trades: Trade[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  } | null
  refetch: () => Promise<void>
  getTradeById: (id: string) => Promise<Trade>
  createTrade: (tradeData: Partial<Trade>) => Promise<ApiResponse<Record<string, unknown>>>
  updateTrade: (id: string, tradeData: Partial<Trade>) => Promise<ApiResponse<Record<string, unknown>>>
  deleteTrade: (id: string) => Promise<ApiResponse<{ message: string }>>
  deleteTrades: (ids: string[]) => Promise<ApiResponse<{ message: string }>>
  setFilters: (filters: TradesFilters) => void
}

export function useTrades(initialFilters: TradesFilters = {}): UseTradesReturn {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<{
    page: number
    limit: number
    total: number
    pages: number
  } | null>(null)
  const [filters, setFilters] = useState<TradesFilters>(initialFilters)

  const fetchTrades = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await tradesApi.getTrades(filters)
      
      if (response.error) {
        setError(response.error)
        return
      }
      
      if (response.data) {
        const data = response.data as { trades?: Trade[]; pagination?: { page: number; limit: number; total: number; pages: number } }
        setTrades(data.trades || [])
        setPagination(data.pagination || null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trades')
    } finally {
      setLoading(false)
    }
  }, [filters])

  const createTrade = useCallback(async (tradeData: Partial<Trade>) => {
    try {
      const response = await tradesApi.createTrade(tradeData)
      
      if (response.data) {
        // Refresh the trades list
        await fetchTrades()
      }
      
      return response
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Failed to create trade'
      }
    }
  }, [fetchTrades])

  const updateTrade = useCallback(async (id: string, tradeData: Partial<Trade>) => {
    try {
      const response = await tradesApi.updateTrade(id, tradeData)
      
      if (response.data) {
        // Update the trade in the local state
        setTrades(prev => prev.map(trade => 
          trade.id === id ? { ...trade, ...(response.data as Partial<Trade>) } : trade
        ))
      }
      
      return response
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Failed to update trade'
      }
    }
  }, [])

  const deleteTrade = useCallback(async (id: string) => {
    try {
      const response = await tradesApi.deleteTrade(id)
      
      if (!response.error) {
        // Remove the trade from local state
        setTrades(prev => prev.filter(trade => trade.id !== id))
        // Update pagination
        if (pagination) {
          setPagination(prev => prev ? {
            ...prev,
            total: prev.total - 1,
            pages: Math.ceil((prev.total - 1) / prev.limit)
          } : null)
        }
      }
      
      return response
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Failed to delete trade'
      }
    }
  }, [pagination])

  const deleteTrades = useCallback(async (ids: string[]) => {
    try {
      const response = await tradesApi.deleteTrades(ids)
      
      if (!response.error) {
        // Remove the trades from local state
        setTrades(prev => prev.filter(trade => !ids.includes(trade.id)))
        // Update pagination
        if (pagination) {
          setPagination(prev => prev ? {
            ...prev,
            total: prev.total - ids.length,
            pages: Math.ceil((prev.total - ids.length) / prev.limit)
          } : null)
        }
      }
      
      return response
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Failed to delete trades'
      }
    }
  }, [pagination])

  const getTradeById = useCallback(async (id: string): Promise<Trade> => {
    try {
      const response = await tradesApi.getTradeById(id)
      
      if (response.error) {
        throw new Error(response.error)
      }
      
      if (response.data) {
        return response.data as Trade
      }
      
      throw new Error('Trade not found')
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch trade')
    }
  }, [])

  const handleSetFilters = useCallback((newFilters: TradesFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  useEffect(() => {
    fetchTrades()
  }, [fetchTrades])

  return {
    trades,
    loading,
    error,
    pagination,
    refetch: fetchTrades,
    getTradeById,
    createTrade,
    updateTrade,
    deleteTrade,
    deleteTrades,
    setFilters: handleSetFilters
  }
}
