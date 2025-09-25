import { PredictionStatus, PredictionResult } from '@prisma/client'

// Core Prediction Types
export interface Prediction {
  id: string
  predictionDate: Date | string
  strategy: string
  direction: PredictionDirection
  strategyNotes?: string | null
  confidence: number // 1-10 scale
  status: PredictionStatus
  result?: PredictionResult | null
  failureReason?: string | null
  notes?: string | null
  createdAt: Date | string
  updatedAt: Date | string
}

// Form Types
export interface PredictionFormData {
  predictionDate: Date
  strategy: string
  direction: PredictionDirection
  strategyNotes?: string
  confidence: number
  notes?: string
}

export interface PredictionUpdateData {
  status: PredictionStatus
  result?: PredictionResult
  actualDirection?: PredictionDirection
  actualNotes?: string
  failureReason?: string
  notes?: string
}

// Filter Types
export interface PredictionFilters {
  dateRange?: {
    from?: Date
    to?: Date
  }
  status?: PredictionStatus[]
  strategies?: string[]
  confidenceRange?: {
    min?: number
    max?: number
  }
  search?: string
}

// Analytics Types
export interface PredictionAnalytics {
  totalPredictions: number
  pendingPredictions: number
  passedPredictions: number
  failedPredictions: number
  successRate: number
  averageConfidence: number
  strategyPerformance: StrategyPredictionPerformance[]
  confidenceAccuracy: ConfidenceAccuracy[]
  monthlyTrends: MonthlyPredictionTrend[]
  recentPredictions: Prediction[]
}

export interface StrategyPredictionPerformance {
  strategy: string
  totalPredictions: number
  successRate: number
  averageConfidence: number
  passedCount: number
  failedCount: number
}

export interface ConfidenceAccuracy {
  confidenceLevel: number
  totalPredictions: number
  successRate: number
  accuracy: number
}

export interface MonthlyPredictionTrend {
  month: string
  totalPredictions: number
  successRate: number
  averageConfidence: number
}

// Chart Data Types
export interface PredictionChartData {
  date: string
  predictions: number
  successRate: number
  confidence: number
}

export interface StrategyChartData {
  strategy: string
  count: number
  successRate: number
  color?: string
}

export interface ConfidenceChartData {
  confidence: number
  accuracy: number
  count: number
}

// API Response Types
export interface PredictionApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PredictionPaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Strategy Options - Load from JSON data
export type PredictionStrategy = string

// Confidence Levels
export const CONFIDENCE_LEVELS = [
  { value: 1, label: 'Very Low (1)', color: 'text-red-500' },
  { value: 2, label: 'Low (2)', color: 'text-red-400' },
  { value: 3, label: 'Below Average (3)', color: 'text-orange-500' },
  { value: 4, label: 'Below Average (4)', color: 'text-orange-400' },
  { value: 5, label: 'Average (5)', color: 'text-yellow-500' },
  { value: 6, label: 'Above Average (6)', color: 'text-yellow-400' },
  { value: 7, label: 'Good (7)', color: 'text-green-400' },
  { value: 8, label: 'High (8)', color: 'text-green-500' },
  { value: 9, label: 'Very High (9)', color: 'text-green-600' },
  { value: 10, label: 'Maximum (10)', color: 'text-green-700' }
] as const

// Status Options
export const PREDICTION_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending', color: 'text-yellow-600' },
  { value: 'PASSED', label: 'Passed', color: 'text-green-600' },
  { value: 'FAILED', label: 'Failed', color: 'text-red-600' }
] as const

// Result Options
export const PREDICTION_RESULT_OPTIONS = [
  { value: 'SUCCESS', label: 'Success', color: 'text-green-600' },
  { value: 'FAILURE', label: 'Failure', color: 'text-red-600' }
] as const

// Utility Functions
export const getConfidenceColor = (confidence: number): string => {
  if (confidence <= 3) return 'text-red-500'
  if (confidence <= 5) return 'text-orange-500'
  if (confidence <= 7) return 'text-yellow-500'
  if (confidence <= 9) return 'text-green-500'
  return 'text-green-700'
}

export const getConfidenceLabel = (confidence: number): string => {
  const level = CONFIDENCE_LEVELS.find(l => l.value === confidence)
  return level?.label || `Level ${confidence}`
}

export const getStatusColor = (status: PredictionStatus): string => {
  const option = PREDICTION_STATUS_OPTIONS.find(o => o.value === status)
  return option?.color || 'text-gray-500'
}

export const getStatusLabel = (status: PredictionStatus): string => {
  const option = PREDICTION_STATUS_OPTIONS.find(o => o.value === status)
  return option?.label || status
}

export const getResultColor = (result: PredictionResult): string => {
  const option = PREDICTION_RESULT_OPTIONS.find(o => o.value === result)
  return option?.color || 'text-gray-500'
}

export const getResultLabel = (result: PredictionResult): string => {
  const option = PREDICTION_RESULT_OPTIONS.find(o => o.value === result)
  return option?.label || result
}

// Direction Types
export type PredictionDirection = 'BULLISH' | 'BEARISH' | 'NEUTRAL'

export const PREDICTION_DIRECTION_OPTIONS = [
  { value: 'BULLISH', label: 'Bullish', color: 'text-green-600', icon: '📈' },
  { value: 'BEARISH', label: 'Bearish', color: 'text-red-600', icon: '📉' },
  { value: 'NEUTRAL', label: 'Neutral', color: 'text-gray-600', icon: '➡️' }
] as const

export const getDirectionColor = (direction: PredictionDirection): string => {
  const option = PREDICTION_DIRECTION_OPTIONS.find(o => o.value === direction)
  return option?.color || 'text-gray-500'
}

export const getDirectionLabel = (direction: PredictionDirection): string => {
  const option = PREDICTION_DIRECTION_OPTIONS.find(o => o.value === direction)
  return option?.label || direction
}

export const getDirectionIcon = (direction: PredictionDirection): string => {
  const option = PREDICTION_DIRECTION_OPTIONS.find(o => o.value === direction)
  return option?.icon || '❓'
}
