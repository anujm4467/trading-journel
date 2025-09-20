import { useState, useEffect, useCallback } from 'react'
import { settingsApi, ApiResponse } from '@/lib/api'

export interface Settings {
  GENERAL?: Record<string, unknown>
  CHARGES?: Record<string, unknown>
  DISPLAY?: Record<string, unknown>
  EXPORT?: Record<string, unknown>
  BACKUP?: Record<string, unknown>
  ADVANCED?: Record<string, unknown>
}

export interface UseSettingsReturn {
  settings: Settings | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  updateSettings: (category: string, data: Record<string, unknown>) => Promise<ApiResponse<{ message: string }>>
  updateAllSettings: (settings: Settings) => Promise<ApiResponse<{ message: string }>>
}

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await settingsApi.getSettings()
      
      if (response.error) {
        setError(response.error)
        return
      }
      
      if (response.data) {
        setSettings(response.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateSettings = useCallback(async (category: string, data: Record<string, unknown>) => {
    try {
      const response = await settingsApi.updateSettings(category, data)
      
      if (!response.error) {
        // Update local state
        setSettings(prev => ({
          ...prev,
          [category]: {
            ...prev?.[category],
            ...data
          }
        }))
      }
      
      return response
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Failed to update settings'
      }
    }
  }, [])

  const updateAllSettings = useCallback(async (newSettings: Settings) => {
    try {
      const response = await settingsApi.updateAllSettings(newSettings)
      
      if (!response.error) {
        setSettings(newSettings)
      }
      
      return response
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Failed to update settings'
      }
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings,
    updateSettings,
    updateAllSettings
  }
}
