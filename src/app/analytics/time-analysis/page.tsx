'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  BarChart3, 
  Loader2,
  AlertCircle,
  Calendar,
  TrendingUp
} from 'lucide-react'
import { TimeAnalysis } from '@/components/analytics/TimeAnalysis'
import { WeekdayAnalysis } from '@/components/analytics/WeekdayAnalysis'
import { AnalyticsFilterPanel } from '@/components/analytics/AnalyticsFilters'
import { useAnalytics, AnalyticsFilters } from '@/hooks/useAnalytics'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import Link from 'next/link'

export default function TimeAnalysisPage() {
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
    console.log('Export time analysis data')
  }

  const handleRefresh = () => {
    refetch()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading time analysis data...
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
            Error Loading Time Analysis Data
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
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Time Analysis Data Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start by adding your first trade to see detailed time-based analytics.
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
            <BreadcrumbPage>Time Analysis</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Time Analysis</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Analyze your trading performance by time periods and patterns
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

      {/* Time Analysis Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Best Day</CardTitle>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-blue-600" />
              <TrendingUp className="h-3 w-3 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {data.weekdayAnalysis?.find(day => day.winRate === Math.max(...(data.weekdayAnalysis?.map(d => d.winRate) || [0])))?.dayOfWeek || 'N/A'}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600 font-medium">
                {Math.max(...(data.weekdayAnalysis?.map(d => d.winRate) || [0])).toFixed(1)}% win rate
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Highest performing day
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200/50 dark:border-red-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">Worst Day</CardTitle>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-red-600" />
              <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
              {data.weekdayAnalysis?.find(day => day.winRate === Math.min(...(data.weekdayAnalysis?.map(d => d.winRate) || [0])))?.dayOfWeek || 'N/A'}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-red-600 font-medium">
                {Math.min(...(data.weekdayAnalysis?.map(d => d.winRate) || [0])).toFixed(1)}% win rate
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Lowest performing day
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 dark:border-purple-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Most Active Day</CardTitle>
            <div className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <Clock className="h-3 w-3 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {data.weekdayAnalysis?.reduce((max, day) => day.totalTrades > max.totalTrades ? day : max, data.weekdayAnalysis[0] || { dayOfWeek: 'N/A', totalTrades: 0 })?.dayOfWeek || 'N/A'}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-purple-600 font-medium">
                {data.weekdayAnalysis?.reduce((max, day) => day.totalTrades > max.totalTrades ? day : max, data.weekdayAnalysis[0] || { totalTrades: 0 })?.totalTrades || 0} trades
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Highest trading activity
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Overall Performance</CardTitle>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <Clock className="h-3 w-3 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {data.overview.winRate.toFixed(1)}%
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600 font-medium">
                {data.overview.winningTrades} wins / {data.overview.losingTrades} losses
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {data.overview.totalTrades} total trades
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekday Analysis Chart */}
      <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">Weekday Analysis</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Trading performance by day of the week</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WeekdayAnalysis data={data.weekdayAnalysis || []} />
        </CardContent>
      </Card>

      {/* Time of Day Analysis */}
      <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">Time of Day Analysis</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Performance patterns throughout the trading day</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TimeAnalysis data={data.timeAnalysis || { dayOfWeek: {}, timeOfDay: {} }} />
        </CardContent>
      </Card>

      {/* Time-based Performance Summary */}
      <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">Time-based Performance Summary</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Key insights from your time-based trading patterns</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Day of Week Performance</h3>
              {data.weekdayAnalysis && data.weekdayAnalysis.length > 0 ? (
                <div className="space-y-3">
                  {data.weekdayAnalysis
                    .sort((a, b) => b.winRate - a.winRate)
                    .map((day, index) => (
                    <div key={day.dayOfWeek} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium">{day.dayOfWeek}</span>
                      <div className="text-right">
                        <span className={`font-bold ${day.winRate >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                          {day.winRate.toFixed(1)}%
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                          ({day.totalTrades} trades)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No weekday data available</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Trading Activity</h3>
              {data.weekdayAnalysis && data.weekdayAnalysis.length > 0 ? (
                <div className="space-y-3">
                  {data.weekdayAnalysis
                    .sort((a, b) => b.totalTrades - a.totalTrades)
                    .map((day, index) => (
                    <div key={day.dayOfWeek} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium">{day.dayOfWeek}</span>
                      <div className="text-right">
                        <span className="font-bold text-blue-600">
                          {day.totalTrades} trades
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                          {day.winRate.toFixed(1)}% win rate
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No activity data available</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
