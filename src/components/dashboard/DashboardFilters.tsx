'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Calendar,
  Filter,
  X,
  TrendingUp,
  BarChart3,
  Target
} from 'lucide-react'
import { AnalyticsFilters } from '@/hooks/useAnalytics'

interface DashboardFiltersProps {
  filters: AnalyticsFilters
  onFiltersChange: (filters: AnalyticsFilters) => void
  onTimeframeChange: (timeframe: string) => void
  activeTimeframe: string
}

export function DashboardFilters({ 
  filters, 
  onFiltersChange, 
  onTimeframeChange, 
  activeTimeframe 
}: DashboardFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const handleInstrumentChange = (value: string) => {
    onFiltersChange({
      ...filters,
      instrumentType: value as 'EQUITY' | 'FUTURES' | 'OPTIONS' | 'ALL'
    })
  }

  const handleStrategyChange = (value: string) => {
    onFiltersChange({
      ...filters,
      strategy: value === 'all' ? undefined : value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      instrumentType: 'ALL',
      strategy: undefined
    })
  }

  const hasActiveFilters = filters.instrumentType !== 'ALL' || filters.strategy

  return (
    <div className="space-y-4">
      {/* Timeframe and Filter Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Performance Overview
          </h2>
          {hasActiveFilters && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              Filtered
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Timeframe Selector */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {['Today', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'].map((timeframe) => (
              <Button
                key={timeframe}
                variant={activeTimeframe === timeframe ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTimeframeChange(timeframe)}
                className={`px-3 py-1 text-xs font-medium transition-all duration-200 ${
                  activeTimeframe === timeframe
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                {timeframe}
              </Button>
            ))}
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                {[filters.instrumentType !== 'ALL', filters.strategy].filter(Boolean).length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Advanced Filters
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Instrument Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Asset Type
              </label>
              <Select
                value={filters.instrumentType || 'ALL'}
                onValueChange={handleInstrumentChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      All Assets
                    </div>
                  </SelectItem>
                  <SelectItem value="EQUITY">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Equity
                    </div>
                  </SelectItem>
                  <SelectItem value="FUTURES">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Futures
                    </div>
                  </SelectItem>
                  <SelectItem value="OPTIONS">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Options
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Strategy Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Strategy
              </label>
              <Select
                value={filters.strategy || 'all'}
                onValueChange={handleStrategyChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Strategies</SelectItem>
                  <SelectItem value="Support & Resistance">Support & Resistance</SelectItem>
                  <SelectItem value="Intraday Hunter">Intraday Hunter</SelectItem>
                  <SelectItem value="Breakout">Breakout</SelectItem>
                  <SelectItem value="Momentum">Momentum</SelectItem>
                  <SelectItem value="Swing">Swing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Date Range
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Custom Range
                </Button>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
          {filters.instrumentType !== 'ALL' && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              {filters.instrumentType}
            </Badge>
          )}
          {filters.strategy && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
              {filters.strategy}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
