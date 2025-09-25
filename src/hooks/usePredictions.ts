import { useState, useEffect, useCallback } from 'react'
import { Prediction, PredictionFormData, PredictionUpdateData, PredictionFilters, PredictionAnalytics } from '@/types/prediction'

export function usePredictions(filters?: PredictionFilters) {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPredictions = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams()
      
      if (filters?.dateRange?.from) {
        params.append('fromDate', filters.dateRange.from.toISOString())
      }
      if (filters?.dateRange?.to) {
        params.append('toDate', filters.dateRange.to.toISOString())
      }
      if (filters?.status && filters.status.length > 0) {
        params.append('status', filters.status.join(','))
      }
      if (filters?.strategies && filters.strategies.length > 0) {
        params.append('strategy', filters.strategies.join(','))
      }
      if (filters?.confidenceRange?.min) {
        params.append('minConfidence', filters.confidenceRange.min.toString())
      }
      if (filters?.confidenceRange?.max) {
        params.append('maxConfidence', filters.confidenceRange.max.toString())
      }
      if (filters?.search) {
        params.append('search', filters.search)
      }

      const response = await fetch(`/api/predictions?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setPredictions(data.predictions || [])
      } else {
        setError(data.error || 'Failed to fetch predictions')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error fetching predictions:', err)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  const createPrediction = async (data: PredictionFormData): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        await fetchPredictions()
        return true
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create prediction')
        return false
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error creating prediction:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const updatePrediction = async (id: string, data: PredictionUpdateData): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/predictions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        await fetchPredictions()
        return true
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update prediction')
        return false
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error updating prediction:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const deletePrediction = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/predictions/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchPredictions()
        return true
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to delete prediction')
        return false
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error deleting prediction:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const getPrediction = async (id: string): Promise<Prediction | null> => {
    try {
      const response = await fetch(`/api/predictions/${id}`)
      const data = await response.json()

      if (response.ok) {
        return data.prediction || data.data
      } else {
        setError(data.error || 'Failed to fetch prediction')
        return null
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error fetching prediction:', err)
      return null
    }
  }

  useEffect(() => {
    fetchPredictions()
  }, [filters, fetchPredictions])

  return {
    predictions,
    isLoading,
    error,
    fetchPredictions,
    createPrediction,
    updatePrediction,
    deletePrediction,
    getPrediction
  }
}

export function usePredictionAnalytics() {
  const [analytics, setAnalytics] = useState<PredictionAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async (dateRange?: { from?: Date; to?: Date }) => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams()
      
      if (dateRange?.from) {
        params.append('fromDate', dateRange.from.toISOString())
      }
      if (dateRange?.to) {
        params.append('toDate', dateRange.to.toISOString())
      }

      const response = await fetch(`/api/predictions/analytics?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setAnalytics(data.analytics || data.data)
      } else {
        setError(data.error || 'Failed to fetch analytics')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error fetching analytics:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  return {
    analytics,
    isLoading,
    error,
    fetchAnalytics
  }
}
