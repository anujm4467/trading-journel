import { useState, useEffect, useCallback } from 'react'

export interface AnalyticsFilters {
  dateFrom?: string
  dateTo?: string
  instrumentType?: 'EQUITY' | 'FUTURES' | 'OPTIONS' | 'ALL'
  strategy?: string
}

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
    trades: number
    winRate: number
    pnl: number
    avgPnl: number
  }>
  instrumentPerformance: Array<{
    instrument: string
    trades: number
    pnl: number
    winRate: number
  }>
  dailyPnlData: Array<{
    date: string
    pnl: number
  }>
  monthlyPerformanceData: Array<{
    month: string
    pnl: number
    trades: number
  }>
  weeklyPerformanceData: Array<{
    day: string
    pnl: number
    trades: number
  }>
  recentTrades: Array<{
    symbol: string
    pnl: number
    type: 'profit' | 'loss'
    time: string
    instrument: string
  }>
  strategyDistribution: Array<{
    name: string
    value: number
    pnl: number
    color: string
  }>
  timeAnalysis: {
    dayOfWeek: Record<string, number>
    timeOfDay: Record<string, number>
  }
  riskData?: {
    maxDrawdown: number
    sharpeRatio: number
    avgRiskReward: number
  }
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
      
      // Build query parameters
      const params = new URLSearchParams()
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
      if (filters.dateTo) params.append('dateTo', filters.dateTo)
      if (filters.instrumentType && filters.instrumentType !== 'ALL') {
        params.append('instrumentType', filters.instrumentType)
      }
      if (filters.strategy) params.append('strategy', filters.strategy)

      const response = await fetch(`/api/analytics?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const analyticsData = await response.json()
      
      if (analyticsData.error) {
        setError(analyticsData.error)
        return
      }

      // Transform the data to match our expected format
      const transformedData: AnalyticsData = {
        overview: analyticsData.overview,
        strategyPerformance: analyticsData.strategyPerformance || [],
        instrumentPerformance: analyticsData.instrumentPerformance || [],
        dailyPnlData: analyticsData.dailyPnlData || [],
        monthlyPerformanceData: generateMonthlyData(analyticsData.dailyPnlData || []),
        weeklyPerformanceData: generateWeeklyData(analyticsData.dailyPnlData || []),
        recentTrades: await getRecentTrades(filters),
        strategyDistribution: generateStrategyDistribution(analyticsData.strategyPerformance || []),
        timeAnalysis: generateTimeAnalysis(analyticsData.dailyPnlData || []),
        riskData: {
          maxDrawdown: analyticsData.riskData?.maxDrawdown || 0,
          sharpeRatio: analyticsData.riskData?.sharpeRatio || 0,
          avgRiskReward: analyticsData.riskData?.avgRiskReward || 0
        }
      }

      setData(transformedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data')
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

// Helper function to get recent trades
async function getRecentTrades(filters: AnalyticsFilters): Promise<Array<{
  symbol: string
  pnl: number
  type: 'profit' | 'loss'
  time: string
  instrument: string
}>> {
  try {
    const params = new URLSearchParams()
    params.append('limit', '5')
    params.append('sortBy', 'entryDate')
    params.append('sortOrder', 'desc')
    
    if (filters.instrumentType && filters.instrumentType !== 'ALL') {
      params.append('instrumentType', filters.instrumentType)
    }

    const response = await fetch(`/api/trades?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.error) {
      return []
    }

    return data.trades.map((trade: { symbol: string; netPnl: number; entryDate: string; instrument: string }) => ({
      symbol: trade.symbol,
      pnl: trade.netPnl || 0,
      type: (trade.netPnl || 0) >= 0 ? 'profit' : 'loss',
      time: getTimeAgo(trade.entryDate),
      instrument: trade.instrument
    }))
  } catch (error) {
    console.error('Error fetching recent trades:', error)
    return []
  }
}

// Helper function to generate monthly performance data
function generateMonthlyData(dailyData: Array<{ date: string; pnl: number }>): Array<{
  month: string
  pnl: number
  trades: number
}> {
  const monthlyMap = new Map<string, { pnl: number; trades: number }>()
  
  dailyData.forEach(day => {
    const date = new Date(day.date)
    const monthKey = date.toLocaleDateString('en-US', { month: 'short' })
    
    const existing = monthlyMap.get(monthKey) || { pnl: 0, trades: 0 }
    existing.pnl += day.pnl
    existing.trades += 1
    monthlyMap.set(monthKey, existing)
  })

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  return months.map(month => ({
    month,
    pnl: monthlyMap.get(month)?.pnl || 0,
    trades: monthlyMap.get(month)?.trades || 0
  }))
}

// Helper function to generate weekly performance data
function generateWeeklyData(dailyData: Array<{ date: string; pnl: number }>): Array<{
  day: string
  pnl: number
  trades: number
}> {
  const weeklyMap = new Map<string, { pnl: number; trades: number }>()
  
  dailyData.forEach(day => {
    const date = new Date(day.date)
    const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' })
    
    const existing = weeklyMap.get(dayKey) || { pnl: 0, trades: 0 }
    existing.pnl += day.pnl
    existing.trades += 1
    weeklyMap.set(dayKey, existing)
  })

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  return days.map(day => ({
    day,
    pnl: weeklyMap.get(day)?.pnl || 0,
    trades: weeklyMap.get(day)?.trades || 0
  }))
}

// Helper function to generate strategy distribution
function generateStrategyDistribution(strategyPerformance: Array<{
  strategy: string
  trades: number
  pnl: number
}>): Array<{
  name: string
  value: number
  pnl: number
  color: string
}> {
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16']
  
  const totalTrades = strategyPerformance.reduce((sum, strategy) => sum + strategy.trades, 0)
  
  return strategyPerformance.map((strategy, index) => ({
    name: strategy.strategy,
    value: totalTrades > 0 ? Math.round((strategy.trades / totalTrades) * 100) : 0,
    pnl: strategy.pnl,
    color: colors[index % colors.length]
  }))
}

// Helper function to generate time analysis data
function generateTimeAnalysis(dailyData: Array<{ date: string; pnl: number }>): {
  dayOfWeek: Record<string, number>
  timeOfDay: Record<string, number>
} {
  const dayOfWeek: Record<string, number> = {}
  const timeOfDay: Record<string, number> = {}
  
  dailyData.forEach(day => {
    const date = new Date(day.date)
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
    const hour = date.getHours()
    
    // Group by day of week
    dayOfWeek[dayName] = (dayOfWeek[dayName] || 0) + day.pnl
    
    // Group by time of day (simplified to morning/afternoon/evening)
    let timeSlot = 'Morning'
    if (hour >= 12 && hour < 17) timeSlot = 'Afternoon'
    else if (hour >= 17) timeSlot = 'Evening'
    
    timeOfDay[timeSlot] = (timeOfDay[timeSlot] || 0) + day.pnl
  })
  
  return { dayOfWeek, timeOfDay }
}

// Helper function to get time ago string
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInHours / 24)
  
  if (diffInDays > 0) {
    return `${diffInDays}d ago`
  } else if (diffInHours > 0) {
    return `${diffInHours}h ago`
  } else {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    return `${diffInMinutes}m ago`
  }
}