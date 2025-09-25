'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  BarChart3, 
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Loader2,
  AlertCircle,
  PieChart
} from 'lucide-react'
import { PerformanceChart } from '@/components/analytics/PerformanceChart'
import { EnhancedPerformanceChart } from '@/components/analytics/EnhancedPerformanceChart'
import { WinLossChart } from '@/components/analytics/WinLossChart'
import { AnalyticsFilterPanel } from '@/components/analytics/AnalyticsFilters'
import { WeeklyGrowthChart } from '@/components/analytics/WeeklyGrowthChart'
import { useAnalytics, AnalyticsFilters, generateWeeklyGrowthData } from '@/hooks/useAnalytics'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import Link from 'next/link'

export default function PerformancePage() {
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
    console.log('Export performance data')
  }

  const handleRefresh = () => {
    refetch()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading performance data...
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
            Error Loading Performance Data
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
            No Performance Data Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start by adding your first trade to see detailed performance analytics.
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
            <BreadcrumbPage>Performance</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Performance Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Detailed analysis of your trading performance over time
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

      {/* Key Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="backdrop-blur-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Net P&L</CardTitle>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              {data.overview.totalNetPnl >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-600" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold mb-1 ${data.overview.totalNetPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {data.overview.totalNetPnl >= 0 ? '+' : ''}₹{Math.round(data.overview.totalNetPnl).toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className={`font-medium ${data.overview.totalNetPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {data.overview.winRate.toFixed(1)}% win rate
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {data.overview.totalTrades} total trades
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Win Rate</CardTitle>
            <div className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <ArrowUpRight className="h-3 w-3 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {data.overview.winRate.toFixed(1)}%
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-blue-600 font-medium">
                {data.overview.winningTrades} wins
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {data.overview.losingTrades} losses
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 dark:border-purple-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Profit Factor</CardTitle>
            <div className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <ArrowUpRight className="h-3 w-3 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {data.overview.profitFactor.toFixed(2)}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-purple-600 font-medium">
                {data.overview.profitFactor >= 2 ? 'Excellent' : data.overview.profitFactor >= 1.5 ? 'Good' : 'Needs Improvement'}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Avg win: ₹{Math.round(data.overview.averageWin).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200/50 dark:border-red-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">Total Charges</CardTitle>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-red-600" />
              <ArrowDownRight className="h-3 w-3 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
              ₹{Math.round(data.overview.totalCharges).toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-red-600 dark:text-red-400 font-medium">
                {data.overview.totalGrossPnl > 0 ? 
                  `${((data.overview.totalCharges / data.overview.totalGrossPnl) * 100).toFixed(1)}%` : 
                  '0%'
                }
              </span>
              <span className="text-gray-500 dark:text-gray-400">of gross P&L</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Brokerage, taxes & fees
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Growth Analysis */}
      <WeeklyGrowthChart 
        data={generateWeeklyGrowthData(data.dailyPnlData || [])}
        selectedStrategies={filters.selectedStrategies || []}
        timeRange={filters.timeRange || 'all'}
      />

      {/* Performance Charts */}
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">P&L Over Time</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Your trading performance over time</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.monthlyPerformanceData && data.monthlyPerformanceData.length > 0 ? (
              <EnhancedPerformanceChart data={data.monthlyPerformanceData.map(item => ({
                month: item.month,
                pnl: item.pnl,
                trades: item.trades
              }))} />
            ) : (
              <div className="h-[600px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 opacity-50" />
                  </div>
                  <p className="text-sm font-medium">No performance data available</p>
                  <p className="text-xs text-gray-400 mt-1">Start trading to see your performance chart</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 dark:border-purple-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <PieChart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">Win/Loss Distribution</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Distribution of your winning and losing trades</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WinLossChart 
              winningTrades={data.overview.winningTrades}
              losingTrades={data.overview.losingTrades}
            />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="backdrop-blur-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <ArrowUpRight className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-green-700 dark:text-green-300">Average Win</div>
                <div className="text-sm text-green-600 dark:text-green-400">Per winning trade</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              +₹{Math.round(data.overview.averageWin).toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Winning trades</span>
              <span className="text-green-600 font-medium">{data.overview.winningTrades}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200/50 dark:border-red-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <ArrowDownRight className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-red-700 dark:text-red-300">Average Loss</div>
                <div className="text-sm text-red-600 dark:text-red-400">Per losing trade</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
              -₹{Math.round(Math.abs(data.overview.averageLoss)).toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Losing trades</span>
              <span className="text-red-600 font-medium">{data.overview.losingTrades}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-blue-700 dark:text-blue-300">Gross P&L</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Before charges</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold mb-2 ${data.overview.totalGrossPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {data.overview.totalGrossPnl >= 0 ? '+' : ''}₹{Math.round(data.overview.totalGrossPnl).toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total trades</span>
              <span className="text-blue-600 font-medium">{data.overview.totalTrades}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
