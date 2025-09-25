'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Target, 
  DollarSign,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LineChart,
  Users,
  Calendar,
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, ComposedChart } from 'recharts'
import { EnhancedPerformanceChart } from '@/components/analytics/EnhancedPerformanceChart'
import { useAnalytics, AnalyticsFilters } from '@/hooks/useAnalytics'
import { DashboardFilters } from './DashboardFilters'

export function DashboardOverview() {
  const [timeframe, setTimeframe] = useState('Today')
  
  // Map dashboard timeframe to analytics API timeRange
  const getTimeRangeFromTimeframe = (timeframe: string): 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all' => {
    switch (timeframe) {
      case 'Today': return 'today'
      case 'Weekly': return 'week'
      case 'Monthly': return 'month'
      case 'Quarterly': return 'quarter'
      case 'Yearly': return 'year'
      default: return 'month'
    }
  }
  
  // Initialize filters with useMemo to prevent infinite re-renders
  const initialFilters: AnalyticsFilters = useMemo(() => ({
    instrumentType: 'OPTIONS', // Default to Options as requested
    timeRange: 'today' // Default to today
  }), [])

  const { data, loading, error, refetch, setFilters, filters } = useAnalytics(initialFilters)

  // Debug logging
  console.log('DashboardOverview - filters from useAnalytics:', filters)
  console.log('DashboardOverview - data loaded:', data ? 'yes' : 'no')

  // Update timeRange based on timeframe
  useEffect(() => {
    console.log('DashboardOverview - useEffect triggered for timeframe:', timeframe)
    const timeRange = getTimeRangeFromTimeframe(timeframe)
    console.log('DashboardOverview - setting timeRange:', timeRange)
    setFilters({
      timeRange
    })
  }, [timeframe, setFilters])

  const handleFiltersChange = (newFilters: AnalyticsFilters) => {
    console.log('DashboardOverview - handleFiltersChange called with:', newFilters)
    setFilters(newFilters)
  }

  const handleTimeframeChange = (newTimeframe: string) => {
    console.log('DashboardOverview - timeframe changing from', timeframe, 'to', newTimeframe)
    setTimeframe(newTimeframe)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading dashboard data...
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
            Error Loading Data
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
            No Data Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start by adding your first trade to see analytics.
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-8 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Trading Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your trading performance and analyze your strategies
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700">
            Last updated: {new Date().toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <DashboardFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onTimeframeChange={handleTimeframeChange}
        activeTimeframe={timeframe}
      />

      {/* Key Metrics Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Trades</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{data.overview.totalTrades.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {timeframe === 'Today' ? 'Today' : `${timeframe} period`} trades
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Net P&L</CardTitle>
            <DollarSign className={`h-4 w-4 ${data.overview.totalNetPnl >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`text-3xl font-bold ${data.overview.totalNetPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {data.overview.totalNetPnl >= 0 ? '+' : ''}₹{Math.round(data.overview.totalNetPnl).toLocaleString()}
            </div>
            <div className="flex items-center text-sm mt-1">
              {data.overview.totalNetPnl >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={`font-medium ${data.overview.totalNetPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {data.overview.totalNetPnl >= 0 ? '+' : ''}{data.overview.winRate.toFixed(1)}%
              </span>
              <span className="text-muted-foreground ml-1">win rate</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{data.overview.winRate.toFixed(1)}%</div>
            <div className="flex items-center text-sm mt-1">
              <span className="text-gray-600 dark:text-gray-400">
                {data.overview.winningTrades} wins / {data.overview.losingTrades} losses
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Best Trade</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              +₹{Math.round(data.overview.averageWin).toLocaleString()}
            </div>
            <div className="flex items-center text-sm mt-1">
              <span className="text-gray-600 dark:text-gray-400">
                highest single trade
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Gross P&L</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`text-3xl font-bold ${data.overview.totalGrossPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {data.overview.totalGrossPnl >= 0 ? '+' : ''}₹{Math.round(data.overview.totalGrossPnl).toLocaleString()}
            </div>
            <div className="flex items-center text-sm mt-1">
              <span className="text-gray-600 dark:text-gray-400">
                before charges
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Charges</CardTitle>
            <BarChart3 className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              -₹{Math.round(data.overview.totalCharges).toLocaleString()}
            </div>
            <div className="flex items-center text-sm mt-1">
              <span className="text-gray-600 dark:text-gray-400">
                STT, Exchange, SEBI, Stamp Duty
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Worst Trade</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              -₹{Math.round(Math.abs(data.overview.averageLoss)).toLocaleString()}
            </div>
            <div className="flex items-center text-sm mt-1">
              <span className="text-gray-600 dark:text-gray-400">
                largest single loss
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Profit Factor</CardTitle>
            <Target className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`text-3xl font-bold ${data.overview.profitFactor >= 1 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {data.overview.profitFactor.toFixed(2)}
            </div>
            <div className="flex items-center text-sm mt-1">
              <span className="text-gray-600 dark:text-gray-400">
                {data.overview.profitFactor >= 1 ? 'Profitable' : 'Loss-making'} strategy
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charges Breakdown Card */}
      {data.chargesBreakdown && data.chargesBreakdown.length > 0 && (
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
              <BarChart3 className="h-5 w-5 text-red-600" />
              Charges Breakdown
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Detailed breakdown of all trading charges
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.chargesBreakdown.map((charge, index) => {
                const chargeTypeLabels: Record<string, string> = {
                  'BROKERAGE': 'Brokerage',
                  'STT': 'Securities Transaction Tax',
                  'EXCHANGE': 'Exchange Charges',
                  'SEBI': 'SEBI Charges',
                  'STAMP_DUTY': 'Stamp Duty',
                  'CUSTOM': 'Custom Charges'
                }
                
                const chargeColors: Record<string, string> = {
                  'BROKERAGE': 'text-blue-600 dark:text-blue-400',
                  'STT': 'text-green-600 dark:text-green-400',
                  'EXCHANGE': 'text-purple-600 dark:text-purple-400',
                  'SEBI': 'text-orange-600 dark:text-orange-400',
                  'STAMP_DUTY': 'text-red-600 dark:text-red-400',
                  'CUSTOM': 'text-gray-600 dark:text-gray-400'
                }

                return (
                  <div key={index} className="p-4 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                        {chargeTypeLabels[charge.type] || charge.type}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {charge.count} charges
                      </span>
                    </div>
                    <div className={`text-2xl font-bold ${chargeColors[charge.type] || 'text-gray-600 dark:text-gray-400'}`}>
                      ₹{Math.round(charge.amount).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {data.overview.totalCharges > 0 ? 
                        `${((charge.amount / data.overview.totalCharges) * 100).toFixed(1)}% of total charges` : 
                        '0% of total charges'
                      }
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts and Analytics */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Performance Chart */}
        <Card className="lg:col-span-4 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
              <LineChart className="h-5 w-5 text-blue-600" />
              Performance Overview
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Your trading performance over the selected period with profit/loss visualization
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {data.monthlyPerformanceData && data.monthlyPerformanceData.length > 0 ? (
              <EnhancedPerformanceChart data={data.monthlyPerformanceData.map(item => ({
                month: item.month,
                pnl: item.pnl,
                trades: item.trades
              }))} />
            ) : (
              <div className="h-[600px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <LineChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm font-medium">No performance data available</p>
                  <p className="text-xs text-gray-400 mt-1">Start trading to see your performance chart</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Trades */}
        <Card className="lg:col-span-3 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
              <Activity className="h-5 w-5 text-green-600" />
              Recent Trades
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Your latest trading activity
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {data.recentTrades && data.recentTrades.length > 0 ? (
                data.recentTrades.map((trade, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-all duration-200 border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center space-x-3">
                      <div className={`h-3 w-3 rounded-full ${
                        trade.type === 'profit' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{trade.symbol}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {trade.time} • {trade.instrument}
                        </p>
                      </div>
                    </div>
                    <div className={`font-bold text-sm ${
                      trade.type === 'profit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {trade.type === 'profit' ? '+' : ''}₹{Math.round(trade.pnl).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent trades found</p>
                </div>
              )}
            </div>
            <Button variant="outline" className="w-full mt-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-gray-200 dark:border-gray-600">
              View All Trades
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Strategy Distribution */}
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
              <PieChart className="h-5 w-5 text-purple-600" />
              Strategy Distribution
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Your trading strategies breakdown (all time data)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {data.strategyDistribution && data.strategyDistribution.length > 0 ? (
              <>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={data.strategyDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {data.strategyDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number, name: string) => [`${value}%`, name]}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 mt-4">
                  {data.strategyDistribution.map((strategy, index) => {
                    // Find the corresponding strategy performance data to get trade count
                    const strategyData = data.strategyPerformance?.find(s => s.strategy === strategy.name)
                    const tradeCount = strategyData?.trades || 0
                    const isMaxTrades = data.overallStats?.maxTradesStrategy?.name === strategy.name
                    
                    return (
                      <div key={index} className={`flex items-center justify-between text-sm p-2 rounded-lg ${isMaxTrades ? 'bg-blue-50/50 dark:bg-blue-700/50 border border-blue-200 dark:border-blue-600' : 'bg-gray-50/50 dark:bg-gray-700/50'}`}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: strategy.color }} />
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 dark:text-gray-100">{strategy.name}</span>
                            {isMaxTrades && (
                              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Most Used</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-600 dark:text-gray-400 font-medium">₹{Math.round(strategy.pnl).toLocaleString()}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{tradeCount} trades</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <PieChart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No strategy data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Performance */}
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
              <Calendar className="h-5 w-5 text-orange-600" />
              Weekly Performance
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              This week&apos;s trading performance with profit/loss indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[250px]">
              {data.weeklyPerformanceData && data.weeklyPerformanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data.weeklyPerformanceData.map(item => ({
                    ...item,
                    isProfit: item.pnl >= 0,
                    color: item.pnl >= 0 ? '#10b981' : '#ef4444'
                  }))}>
                    <defs>
                      <linearGradient id="weeklyProfitGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
                      </linearGradient>
                      <linearGradient id="weeklyLossGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="rounded-lg border bg-white dark:bg-gray-800 p-3 shadow-lg">
                              <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <div className={`w-3 h-3 rounded-full ${data.isProfit ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className="text-sm font-medium">
                                  P&L: <span className={data.isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                    ₹{data.pnl.toLocaleString()}
                                  </span>
                                </span>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar 
                      dataKey="pnl" 
                      fill={(entry) => entry.isProfit ? "url(#weeklyProfitGradient)" : "url(#weeklyLossGradient)"}
                      radius={[4, 4, 0, 0]}
                      stroke={(entry) => entry.isProfit ? "#10b981" : "#ef4444"}
                      strokeWidth={1}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No weekly data available</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
              <Users className="h-5 w-5 text-indigo-600" />
              Quick Stats
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Overall performance indicators (all time)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className={`text-center p-4 rounded-lg border ${data.overallStats?.totalNetPnl && data.overallStats.totalNetPnl >= 0 ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800' : 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-100 dark:border-red-800'}`}>
                <div className={`text-2xl font-bold ${data.overallStats?.totalNetPnl && data.overallStats.totalNetPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {data.overallStats?.totalNetPnl ? (data.overallStats.totalNetPnl >= 0 ? '+' : '') : ''}₹{Math.round(data.overallStats?.totalNetPnl || 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total P&L</div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{data.overallStats?.winRate?.toFixed(1) || '0.0'}%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Win Rate</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{data.overallStats?.totalTrades || 0}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Total Trades</div>
                </div>
              </div>

              <div className={`text-center p-3 rounded-lg border ${data.overallStats?.avgTrade && data.overallStats.avgTrade >= 0 ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800' : 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-100 dark:border-red-800'}`}>
                <div className={`text-lg font-bold ${data.overallStats?.avgTrade && data.overallStats.avgTrade >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {data.overallStats?.avgTrade ? (data.overallStats.avgTrade >= 0 ? '+' : '') : ''}₹{Math.round(data.overallStats?.avgTrade || 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Trade</div>
              </div>

              {data.overallStats?.maxTradesStrategy && data.overallStats.maxTradesStrategy.count > 0 && (
                <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{data.overallStats.maxTradesStrategy.count}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Max Trades: {data.overallStats.maxTradesStrategy.name}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
