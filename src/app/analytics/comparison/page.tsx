'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  BarChart3, 
  Loader2,
  AlertCircle,
  Activity,
  PieChart,
  Target
} from 'lucide-react'
import { AnalyticsFilterPanel } from '@/components/analytics/AnalyticsFilters'
import { useAnalytics, AnalyticsFilters } from '@/hooks/useAnalytics'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import Link from 'next/link'

export default function ComparisonPage() {
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
    console.log('Export comparison data')
  }

  const handleRefresh = () => {
    refetch()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading comparison data...
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
            Error Loading Comparison Data
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
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Comparison Data Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start by adding your first trade to see detailed comparison analytics.
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
            <BreadcrumbPage>Comparison</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Performance Comparison</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Compare your trading performance across different metrics and time periods
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

      {/* Performance Summary Comparison */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="backdrop-blur-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Performance Summary
            </CardTitle>
            <CardDescription>
              Your trading performance overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="font-medium">Net P&L</span>
                <span className={`text-2xl font-bold ${data.overview.totalNetPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {data.overview.totalNetPnl >= 0 ? '+' : ''}₹{Math.round(data.overview.totalNetPnl).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="font-medium">Win Rate</span>
                <span className="text-2xl font-bold text-blue-600">{data.overview.winRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <span className="font-medium">Profit Factor</span>
                <span className="text-2xl font-bold text-purple-600">{data.overview.profitFactor.toFixed(2)}</span>
              </div>
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Based on {data.overview.totalTrades} trades
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Risk Metrics
            </CardTitle>
            <CardDescription>
              Key risk and performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <span className="font-medium">Max Drawdown</span>
                <span className="text-2xl font-bold text-red-600">{Math.abs(data.riskData?.maxDrawdown || 0).toFixed(2)}%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                <span className="font-medium">Total Charges</span>
                <span className="text-2xl font-bold text-gray-600">₹{Math.round(data.overview.totalCharges).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <span className="font-medium">Sharpe Ratio</span>
                <span className="text-2xl font-bold text-orange-600">{(data.riskData?.sharpeRatio || 0).toFixed(2)}</span>
              </div>
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {data.overview.profitFactor >= 2 ? 'Excellent' : data.overview.profitFactor >= 1.5 ? 'Good' : 'Needs Improvement'} performance
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instrument Performance Comparison */}
      <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">Instrument Performance</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Performance breakdown by instrument type</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.instrumentPerformance && data.instrumentPerformance.length > 0 ? (
            <div className="space-y-4">
              {data.instrumentPerformance.map((instrument, index) => (
                <div key={index} className="flex justify-between items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {instrument.instrument}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Total Trades:</span>
                        <span className="ml-2 font-medium">{instrument.trades}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Win Rate:</span>
                        <span className="ml-2 font-medium text-blue-600">{instrument.winRate.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Avg P&L:</span>
                        <span className={`ml-2 font-medium ${instrument.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {instrument.pnl >= 0 ? '+' : ''}₹{Math.round(instrument.pnl / instrument.trades || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold mb-2 ${instrument.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {instrument.pnl >= 0 ? '+' : ''}₹{Math.round(instrument.pnl).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {instrument.trades} trades • {instrument.winRate.toFixed(1)}% win rate
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No instrument data available</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Strategy Performance Comparison */}
      {data.strategyPerformance && data.strategyPerformance.length > 0 && (
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <PieChart className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">Strategy Performance Comparison</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Compare performance across different strategies</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.strategyPerformance
                .sort((a, b) => b.pnl - a.pnl)
                .map((strategy, index) => (
                <div key={strategy.strategy} className="flex justify-between items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {strategy.strategy}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Total Trades:</span>
                        <span className="ml-2 font-medium">{strategy.trades}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Win Rate:</span>
                        <span className="ml-2 font-medium text-blue-600">{strategy.winRate.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Avg P&L:</span>
                        <span className={`ml-2 font-medium ${strategy.avgPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {strategy.avgPnl >= 0 ? '+' : ''}₹{Math.round(strategy.avgPnl).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold mb-2 ${strategy.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {strategy.pnl >= 0 ? '+' : ''}₹{Math.round(strategy.pnl).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total P&L
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Benchmarks */}
      <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">Performance Benchmarks</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">How your performance compares to industry standards</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Win Rate Benchmark</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">Your Win Rate</span>
                  <span className={`font-bold ${data.overview.winRate >= 60 ? 'text-green-600' : data.overview.winRate >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {data.overview.winRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">Industry Average</span>
                  <span className="font-bold text-gray-600">45-55%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">Professional Target</span>
                  <span className="font-bold text-gray-600">60%+</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Profit Factor Benchmark</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">Your Profit Factor</span>
                  <span className={`font-bold ${data.overview.profitFactor >= 2 ? 'text-green-600' : data.overview.profitFactor >= 1.5 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {data.overview.profitFactor.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">Break-even</span>
                  <span className="font-bold text-gray-600">1.0</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">Good Performance</span>
                  <span className="font-bold text-gray-600">1.5+</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Risk Management</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">Max Drawdown</span>
                  <span className={`font-bold ${Math.abs(data.riskData?.maxDrawdown || 0) < 10 ? 'text-green-600' : Math.abs(data.riskData?.maxDrawdown || 0) < 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {Math.abs(data.riskData?.maxDrawdown || 0).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">Conservative</span>
                  <span className="font-bold text-gray-600">&lt; 10%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">Moderate</span>
                  <span className="font-bold text-gray-600">10-20%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
