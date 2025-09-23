'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  PieChart, 
  BarChart3, 
  Loader2,
  AlertCircle,
  TrendingUp
} from 'lucide-react'
import { GraphicalStrategyPerformance } from '@/components/analytics/GraphicalStrategyPerformance'
import { AnalyticsFilterPanel } from '@/components/analytics/AnalyticsFilters'
import { useAnalytics, AnalyticsFilters } from '@/hooks/useAnalytics'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import Link from 'next/link'

export default function StrategiesPage() {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    instrumentType: 'OPTIONS',
    timeRange: 'month',
    selectedStrategies: []
  })
  const [activeTimeframe, setActiveTimeframe] = useState('month')

  const { data, loading, error, refetch, setFilters: setAnalyticsFilters } = useAnalytics(filters)

  const handleTimeframeChange = (timeframe: string) => {
    setActiveTimeframe(timeframe)
    setAnalyticsFilters({ timeRange: timeframe as 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all' })
  }

  const handleFiltersChange = (newFilters: AnalyticsFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setAnalyticsFilters(newFilters)
  }

  const handleExport = () => {
    console.log('Export strategies data')
  }

  const handleRefresh = () => {
    refetch()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading strategies data...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Error Loading Strategies Data
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Strategies Data Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start by adding your first trade to see detailed strategy analytics.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/analytics">Analytics</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Strategies</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Strategy Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Performance analysis of your trading strategies
          </p>
        </div>
      </div>

      {/* Enhanced Filter System */}
      <AnalyticsFilterPanel
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onTimeframeChange={handleTimeframeChange}
        activeTimeframe={activeTimeframe}
        onExport={handleExport}
        onRefresh={handleRefresh}
        strategies={data?.strategyPerformance?.map(s => s.strategy) || []}
        isLoading={loading}
      />

      {/* Strategy Performance Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {data.strategyPerformance?.slice(0, 4).map((strategy, index) => (
          <Card 
            key={strategy.strategy}
            className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 truncate">
                {strategy.strategy}
              </CardTitle>
              <div className="flex items-center gap-1">
                <PieChart className="h-4 w-4 text-blue-600" />
                <TrendingUp className="h-3 w-3 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold mb-1 ${strategy.totalPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {strategy.totalPnl >= 0 ? '+' : ''}₹{Math.round(strategy.totalPnl).toLocaleString()}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-blue-600 font-medium">
                  {strategy.winRate.toFixed(1)}% win rate
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {strategy.totalTrades} trades
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Strategy Performance Chart */}
      <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <PieChart className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">Strategy Performance</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Compare performance across different strategies</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GraphicalStrategyPerformance 
            data={data.strategyPerformance || []}
            selectedStrategies={filters.selectedStrategies || []}
            onStrategySelect={(strategy) => {
              const current = filters.selectedStrategies || []
              if (current.includes(strategy)) {
                setFilters(prev => ({ 
                  ...prev, 
                  selectedStrategies: current.filter(s => s !== strategy) 
                }))
              } else {
                setFilters(prev => ({ 
                  ...prev, 
                  selectedStrategies: [...current, strategy] 
                }))
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Detailed Strategy Breakdown */}
      {data.strategyPerformance && data.strategyPerformance.length > 0 && (
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">Strategy Breakdown</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Detailed performance metrics for each strategy</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.strategyPerformance.map((strategy, index) => (
                <div 
                  key={strategy.strategy}
                  className="flex justify-between items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg hover:shadow-md transition-all duration-200"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {strategy.strategy}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Total Trades:</span>
                        <span className="ml-2 font-medium">{strategy.totalTrades}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Win Rate:</span>
                        <span className="ml-2 font-medium text-blue-600">{strategy.winRate.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Avg Win:</span>
                        <span className="ml-2 font-medium text-green-600">+₹{Math.round(strategy.averageWin).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Avg Loss:</span>
                        <span className="ml-2 font-medium text-red-600">-₹{Math.round(Math.abs(strategy.averageLoss)).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold mb-2 ${strategy.totalPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {strategy.totalPnl >= 0 ? '+' : ''}₹{Math.round(strategy.totalPnl).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Profit Factor: {strategy.profitFactor.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
