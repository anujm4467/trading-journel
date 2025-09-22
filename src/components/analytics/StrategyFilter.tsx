'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { 
  Filter, 
  X, 
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  Clock
} from 'lucide-react'

interface StrategyFilterProps {
  strategies: string[]
  selectedStrategies: string[]
  onStrategyChange: (strategies: string[]) => void
  timeRange: 'week' | 'month' | 'quarter' | 'year' | 'all'
  onTimeRangeChange: (range: 'week' | 'month' | 'quarter' | 'year' | 'all') => void
  viewMode: 'cards' | 'charts' | 'table'
  onViewModeChange: (mode: 'cards' | 'charts' | 'table') => void
}

export function StrategyFilter({
  strategies,
  selectedStrategies,
  onStrategyChange,
  timeRange,
  onTimeRangeChange,
  viewMode,
  onViewModeChange
}: StrategyFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleStrategyToggle = (strategy: string) => {
    if (selectedStrategies.includes(strategy)) {
      onStrategyChange(selectedStrategies.filter(s => s !== strategy))
    } else {
      onStrategyChange([...selectedStrategies, strategy])
    }
  }

  const handleSelectAll = () => {
    onStrategyChange(strategies)
  }

  const handleClearAll = () => {
    onStrategyChange([])
  }

  const timeRangeOptions = [
    { value: 'week', label: 'This Week', icon: '📅' },
    { value: 'month', label: 'This Month', icon: '📊' },
    { value: 'quarter', label: 'This Quarter', icon: '📈' },
    { value: 'year', label: 'This Year', icon: '🎯' },
    { value: 'all', label: 'All Time', icon: '⏰' }
  ]

  const viewModeOptions = [
    { value: 'charts', label: 'Charts', icon: BarChart3 },
    { value: 'cards', label: 'Cards', icon: PieChart },
    { value: 'table', label: 'Table', icon: Clock }
  ]

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Strategy Filter */}
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <Filter className="h-4 w-4" />
              Strategies
              {selectedStrategies.length > 0 && (
                <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {selectedStrategies.length}
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
                    onClick={handleSelectAll}
                    className="text-xs h-6 px-2"
                  >
                    All
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleClearAll}
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
                  checked={selectedStrategies.includes(strategy)}
                  onCheckedChange={() => handleStrategyToggle(strategy)}
                  className="flex items-center gap-2 p-2"
                >
                  <Checkbox
                    checked={selectedStrategies.includes(strategy)}
                    className="h-4 w-4"
                  />
                  <span className="font-medium">{strategy}</span>
                </DropdownMenuCheckboxItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Time Range Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <Calendar className="h-4 w-4" />
              {timeRangeOptions.find(opt => opt.value === timeRange)?.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 border-white/20 shadow-2xl">
            {timeRangeOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={timeRange === option.value}
                onCheckedChange={() => onTimeRangeChange(option.value as any)}
                className="flex items-center gap-2 p-2"
              >
                <span className="text-lg">{option.icon}</span>
                <span className="font-medium">{option.label}</span>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 rounded-lg shadow-lg">
          {viewModeOptions.map((option) => {
            const Icon = option.icon
            return (
              <Button
                key={option.value}
                variant={viewMode === option.value ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange(option.value as any)}
                className={`flex items-center gap-1 h-8 px-3 ${
                  viewMode === option.value 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs font-medium">{option.label}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedStrategies.length > 0 || timeRange !== 'all') && (
        <Card className="backdrop-blur-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Filters:</span>
              
              {timeRange !== 'all' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  <Clock className="h-3 w-3 mr-1" />
                  {timeRangeOptions.find(opt => opt.value === timeRange)?.label}
                </Badge>
              )}
              
              {selectedStrategies.map((strategy) => (
                <Badge
                  key={strategy}
                  variant="secondary"
                  className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 cursor-pointer hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                  onClick={() => handleStrategyToggle(strategy)}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {strategy}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onStrategyChange([])
                  onTimeRangeChange('all')
                }}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
