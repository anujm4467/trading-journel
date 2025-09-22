'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu'
import { 
  Filter, 
  X, 
  Calendar,
  TrendingUp,
  BarChart3,
  Target,
  Clock,
  Download,
  RefreshCw
} from 'lucide-react'
import { AnalyticsFilters as AnalyticsFiltersType } from '@/hooks/useAnalytics'

interface AnalyticsFiltersProps {
  filters: AnalyticsFiltersType
  onFiltersChange: (filters: AnalyticsFiltersType) => void
  onTimeframeChange: (timeframe: string) => void
  activeTimeframe: string
  onExport?: () => void
  onRefresh?: () => void
  strategies?: string[]
  isLoading?: boolean
}

export function AnalyticsFilterPanel({ 
  filters, 
  onFiltersChange, 
  onTimeframeChange, 
  activeTimeframe,
  onExport,
  onRefresh,
  strategies = [],
  isLoading = false
}: AnalyticsFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const handleInstrumentChange = (value: string) => {
    onFiltersChange({
      ...filters,
      instrumentType: value as 'EQUITY' | 'FUTURES' | 'OPTIONS' | 'ALL'
    })
  }

  const handleStrategyToggle = (strategy: string) => {
    const currentStrategies = filters.selectedStrategies || []
    if (currentStrategies.includes(strategy)) {
      onFiltersChange({
        ...filters,
        selectedStrategies: currentStrategies.filter(s => s !== strategy)
      })
    } else {
      onFiltersChange({
        ...filters,
        selectedStrategies: [...currentStrategies, strategy]
      })
    }
  }

  const handleSelectAllStrategies = () => {
    onFiltersChange({
      ...filters,
      selectedStrategies: strategies
    })
  }

  const handleClearAllStrategies = () => {
    onFiltersChange({
      ...filters,
      selectedStrategies: []
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      instrumentType: 'OPTIONS', // Default to Options
      selectedStrategies: [],
      timeRange: 'month' // Default to current month
    })
  }

  const hasActiveFilters = 
    filters.instrumentType !== 'OPTIONS' || 
    (filters.selectedStrategies && filters.selectedStrategies.length > 0) ||
    (filters.timeRange && filters.timeRange !== 'month')

  const timeframeOptions = [
    { value: 'today', label: 'Today', icon: '📅', description: 'Current day' },
    { value: 'week', label: 'This Week', icon: '📊', description: 'Last 7 days' },
    { value: 'month', label: 'This Month', icon: '📈', description: 'Last 30 days' },
    { value: 'quarter', label: 'This Quarter', icon: '🎯', description: 'Last 90 days' },
    { value: 'year', label: 'This Year', icon: '⏰', description: 'Last 365 days' },
    { value: 'all', label: 'All Time', icon: '🌐', description: 'All data' }
  ]

  const instrumentOptions = [
    { value: 'ALL', label: 'All Assets', icon: BarChart3, color: 'text-gray-600' },
    { value: 'EQUITY', label: 'Equity', icon: TrendingUp, color: 'text-blue-600' },
    { value: 'FUTURES', label: 'Futures', icon: Target, color: 'text-purple-600' },
    { value: 'OPTIONS', label: 'Options', icon: BarChart3, color: 'text-green-600' }
  ]

  return (
    <div className="space-y-6">
      {/* Main Filter Bar */}
      <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-white/20 shadow-xl">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Left Side - Title and Active Filters */}
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Analytics Dashboard
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Deep dive into your trading performance and patterns
                </p>
              </div>
              {hasActiveFilters && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                  <Filter className="h-3 w-3 mr-1" />
                  Filtered
                </Badge>
              )}
            </div>

            {/* Right Side - Action Buttons */}
            <div className="flex items-center gap-2">
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="flex items-center gap-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              )}
              {onExport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExport}
                  className="flex items-center gap-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              )}
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            {/* Timeframe Selector */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {timeframeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={activeTimeframe === option.value ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onTimeframeChange(option.value)}
                  className={`px-3 py-1 text-xs font-medium transition-all duration-200 ${
                    activeTimeframe === option.value
                      ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-gray-100'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                  title={option.description}
                >
                  <span className="mr-1">{option.icon}</span>
                  {option.label}
                </Button>
              ))}
            </div>

            {/* Instrument Type Filter */}
            <Select
              value={filters.instrumentType || 'ALL'}
              onValueChange={handleInstrumentChange}
            >
              <SelectTrigger className="w-40 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-lg">
                <SelectValue placeholder="Asset Type" />
              </SelectTrigger>
              <SelectContent className="backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 border-white/20 shadow-2xl">
                {instrumentOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${option.color}`} />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>

            {/* Strategy Filter */}
            {strategies.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Filter className="h-4 w-4" />
                    Strategies
                    {(filters.selectedStrategies?.length || 0) > 0 && (
                      <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {filters.selectedStrategies?.length || 0}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 border-white/20 shadow-2xl">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Filter Strategies</h4>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleSelectAllStrategies}
                          className="text-xs h-6 px-2"
                        >
                          All
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleClearAllStrategies}
                          className="text-xs h-6 px-2"
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {strategies.map((strategy) => (
                      <DropdownMenuCheckboxItem
                        key={strategy}
                        checked={filters.selectedStrategies?.includes(strategy) || false}
                        onCheckedChange={() => handleStrategyToggle(strategy)}
                        className="flex items-center gap-2 p-2"
                      >
                        <span className="font-medium">{strategy}</span>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Advanced Filters Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Filter className="h-4 w-4" />
              Advanced
              {hasActiveFilters && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {[
                    filters.instrumentType !== 'ALL',
                    (filters.selectedStrategies?.length || 0) > 0,
                    filters.timeRange !== 'all'
                  ].filter(Boolean).length}
                </Badge>
              )}
            </Button>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Advanced Filters
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Custom Date Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Custom Date Range
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Select Date Range
                  </Button>
                </div>

                {/* Additional filters can be added here */}
              </div>

              {/* Clear All Filters */}
              {hasActiveFilters && (
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
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
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active filters:</span>
              
              {filters.instrumentType !== 'ALL' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  {filters.instrumentType}
                </Badge>
              )}
              
              {filters.selectedStrategies && filters.selectedStrategies.map((strategy) => (
                <Badge
                  key={strategy}
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 cursor-pointer hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                  onClick={() => handleStrategyToggle(strategy)}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {strategy}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
              
              {filters.timeRange && filters.timeRange !== 'all' && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                  <Clock className="h-3 w-3 mr-1" />
                  {timeframeOptions.find(opt => opt.value === filters.timeRange)?.label}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
