import { useState, useEffect, useCallback } from 'react'

export interface PsychologyFilters {
  dateFrom?: string
  dateTo?: string
  strategy?: string
}

export interface PsychologyData {
  overview: {
    disciplineScore: number
    riskManagementScore: number
    emotionalControlScore: number
    patienceScore: number
  }
  behaviorPatterns: {
    riskRewardAdherence: {
      followed: number
      deviated: number
    }
    intradayHunter: {
      followed: number
      deviated: number
    }
    overtrading: {
      controlled: number
      excessive: number
      averageTradesPerDay: number
    }
    retracementPatience: {
      waited: number
      premature: number
    }
  }
  emotionalAnalysis: {
    greedFear: {
      greed: number
      fear: number
      balanced: number
    }
    exitPatience: {
      patient: number
      impatient: number
      averageHoldTime: string
    }
  }
  disciplineTracking: {
    followedRules: number
    ruleViolations: number
    score: number
    totalTrades: number
    disciplineTrends: Array<{
      month: string
      disciplineScore: number
    }>
  }
  aiInsights: {
    insights: Array<{
      type: 'positive' | 'warning' | 'suggestion'
      title: string
      description: string
      category: string
    }>
    recommendations: Array<{
      priority: 'high' | 'medium' | 'low'
      title: string
      description: string
      category: string
    }>
    performanceCorrelation: Array<{
      psychologyState: string
      averagePnl: number
    }>
  }
}

export interface UsePsychologyReturn {
  data: PsychologyData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  setFilters: (filters: PsychologyFilters) => void
}

export function usePsychology(initialFilters: PsychologyFilters = {}): UsePsychologyReturn {
  const [data, setData] = useState<PsychologyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<PsychologyFilters>(initialFilters)

  const fetchPsychology = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Build query parameters
      const params = new URLSearchParams()
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
      if (filters.dateTo) params.append('dateTo', filters.dateTo)
      if (filters.strategy) params.append('strategy', filters.strategy)

      const response = await fetch(`/api/psychology?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const psychologyData = await response.json()
      
      if (psychologyData.error) {
        setError(psychologyData.error)
        return
      }

      setData(psychologyData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch psychology data')
    } finally {
      setLoading(false)
    }
  }, [filters])

  const handleSetFilters = useCallback((newFilters: PsychologyFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  useEffect(() => {
    fetchPsychology()
  }, [fetchPsychology])

  return {
    data,
    loading,
    error,
    refetch: fetchPsychology,
    setFilters: handleSetFilters
  }
}
