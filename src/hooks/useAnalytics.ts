import { useState, useEffect, useCallback } from 'react'
import { analyticsApi } from '@/lib/api'

export interface AnalyticsData {
  overview: {
    totalTrades: number
    winningTrades: number
    losingTrades: number
    winRate: number
    totalGrossPnl: number
    totalCharges: number
    totalNetPnl: number
    averageWin: number
    averageLoss: number
    profitFactor: number
  }
  strategyPerformance: Array<{
    strategy: string
    _count: number
    _sum: {
      quantity: number | null
    }
  }>
  instrumentPerformance: Array<{
    instrumentType: string
    _count: number
  }>
  dailyPnlData: Array<{
    date: string
    pnl: number
  }>
}

export interface AnalyticsFilters {
  dateFrom?: string
  dateTo?: string
  strategy?: string
}

export interface UseAnalyticsReturn {
  data: AnalyticsData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  setFilters: (filters: AnalyticsFilters) => void
}

export function useAnalytics(initialFilters: AnalyticsFilters = {}): UseAnalyticsReturn {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AnalyticsFilters>(initialFilters)

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await analyticsApi.getAnalytics(filters)
      
      if (response.error) {
        setError(response.error)
        return
      }
      
      if (response.data) {
        setData(response.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }, [filters])

  const handleSetFilters = useCallback((newFilters: AnalyticsFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics,
    setFilters: handleSetFilters
  }
}
