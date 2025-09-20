import { useState, useEffect, useCallback } from 'react'
import { portfolioApi } from '@/lib/api'

export interface Position {
  id: string
  symbol: string
  instrumentType: 'EQUITY' | 'FUTURES' | 'OPTIONS'
  side: 'BUY' | 'SELL'
  quantity: number
  entryPrice: number
  currentPrice: number
  invested: number
  currentValue: number
  pnl: number
  pnlPercentage: number
  entryDate: string
  strategy?: string
}

export interface PortfolioData {
  summary: {
    totalPositions: number
    totalCurrentValue: number
    totalInvested: number
    unrealizedPnl: number
    realizedPnl: number
    totalPnl: number
    totalReturn: number
  }
  positions: Position[]
  allocation: Record<string, {
    count: number
    value: number
    percentage: number
  }>
  riskMetrics: {
    totalExposure: number
    maxSinglePosition: number
    concentrationRisk: number
  }
  recentTrades: Array<{
    id: string
    symbol: string
    side: 'BUY' | 'SELL'
    quantity: number
    entryPrice: number
    exitPrice?: number
    entryDate: string
    exitDate?: string
    strategy?: string
    pnl?: number
  }>
  strategyPerformance: Array<{
    strategy: string
    _count: number
    _avg: {
      quantity: number | null
    }
  }>
}

export interface UsePortfolioReturn {
  data: PortfolioData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function usePortfolio(): UsePortfolioReturn {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPortfolio = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await portfolioApi.getPortfolio()
      
      if (response.error) {
        setError(response.error)
        return
      }
      
      if (response.data) {
        setData(response.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPortfolio()
  }, [fetchPortfolio])

  return {
    data,
    loading,
    error,
    refetch: fetchPortfolio
  }
}
