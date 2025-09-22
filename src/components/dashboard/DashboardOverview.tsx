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
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { useAnalytics, AnalyticsFilters } from '@/hooks/useAnalytics'
import { DashboardFilters } from './DashboardFilters'

export function DashboardOverview() {
  const [timeframe, setTimeframe] = useState('Monthly')
  
  // Initialize filters with useMemo to prevent infinite re-renders
  const initialFilters: AnalyticsFilters = useMemo(() => ({
    instrumentType: 'OPTIONS' // Default to Options as requested
  }), [])

  const { data, loading, error, refetch, setFilters, filters } = useAnalytics(initialFilters)

  // Debug logging
  console.log('DashboardOverview - filters from useAnalytics:', filters)
  console.log('DashboardOverview - data loaded:', data ? 'yes' : 'no')

  // Update date filters based on timeframe
  useEffect(() => {
    console.log('DashboardOverview - useEffect triggered for timeframe:', timeframe)
    const now = new Date()
    let dateFrom: string | undefined

    switch (timeframe) {
      case 'Today':
        // Use date-only string for today (YYYY-MM-DD)
        dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0]
        break
      case 'Weekly':
        // Get current week's Monday
        const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, etc.
        const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay // If Sunday, go back 6 days; otherwise go to Monday
        const mondayDate = new Date(now)
        mondayDate.setDate(now.getDate() + daysToMonday)
        mondayDate.setHours(0, 0, 0, 0)
        dateFrom = mondayDate.toISOString().split('T')[0]
        break
      case 'Monthly':
        // Use date-only string for start of current month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        dateFrom = startOfMonth.toISOString().split('T')[0]
        break
      case 'Quarterly':
        // Use date-only string for 90 days ago
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        dateFrom = ninetyDaysAgo.toISOString().split('T')[0]
        break
      case 'Yearly':
        // Use date-only string for 365 days ago
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        dateFrom = oneYearAgo.toISOString().split('T')[0]
        break
    }

    // Use date-only string for today as the end date
    const dateTo = now.toISOString().split('T')[0]

    console.log('DashboardOverview - setting date filters:', { dateFrom, dateTo })
    setFilters({
      dateFrom,
      dateTo
    })
  }, [timeframe, setFilters]) // Remove filters dependency to prevent circular dependency

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
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Trade</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`text-3xl font-bold ${data.overview.totalTrades > 0 ? (data.overview.totalNetPnl / data.overview.totalTrades >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400') : 'text-gray-600 dark:text-gray-400'}`}>
              {data.overview.totalTrades > 0 ? (
                <>
                  {data.overview.totalNetPnl / data.overview.totalTrades >= 0 ? '+' : ''}₹{Math.round(data.overview.totalNetPnl / data.overview.totalTrades).toLocaleString()}
                </>
              ) : (
                '₹0'
              )}
            </div>
            <div className="flex items-center text-sm mt-1">
              <span className="text-gray-600 dark:text-gray-400">
                per trade
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
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Charges</CardTitle>
            <Activity className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              ₹{data.overview.totalTrades > 0 ? Math.round(data.overview.totalCharges / data.overview.totalTrades).toLocaleString() : '0'}
            </div>
            <div className="flex items-center text-sm mt-1">
              <span className="text-gray-600 dark:text-gray-400">
                per trade
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
              Your trading performance over the selected period
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[350px]">
              {data.monthlyPerformanceData && data.monthlyPerformanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={data.monthlyPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'P&L']}
                      labelStyle={{ color: '#374151', fontSize: '14px' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pnl" 
                      stroke="var(--profit-hex)" 
                      strokeWidth={3}
                      dot={{ fill: 'var(--profit-hex)', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: 'var(--profit-hex)', strokeWidth: 2 }}
                      className="drop-shadow-sm"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  No performance data available for the selected period
                </div>
              )}
            </div>
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
              Your trading strategies breakdown
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
                  {data.strategyDistribution.map((strategy, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 rounded-lg bg-gray-50/50 dark:bg-gray-700/50">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: strategy.color }} />
                        <span className="font-medium text-gray-900 dark:text-gray-100">{strategy.name}</span>
                      </div>
                      <span className="text-gray-600 dark:text-gray-400 font-medium">₹{Math.round(strategy.pnl).toLocaleString()}</span>
                    </div>
                  ))}
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
              This week&apos;s trading performance
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[250px]">
              {data.weeklyPerformanceData && data.weeklyPerformanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.weeklyPerformanceData}>
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
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'P&L']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="pnl" 
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
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
              Key performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className={`text-center p-4 rounded-lg border ${data.overview.totalNetPnl >= 0 ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800' : 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-100 dark:border-red-800'}`}>
                <div className={`text-2xl font-bold ${data.overview.totalNetPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {data.overview.totalNetPnl >= 0 ? '+' : ''}₹{Math.round(data.overview.totalNetPnl).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total P&L</div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{data.overview.winRate.toFixed(1)}%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Win Rate</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{data.overview.totalTrades}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Total Trades</div>
                </div>
              </div>

              <div className={`text-center p-3 rounded-lg border ${data.overview.totalTrades > 0 ? (data.overview.totalNetPnl / data.overview.totalTrades >= 0 ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800' : 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-100 dark:border-red-800') : 'bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-600'}`}>
                <div className={`text-lg font-bold ${data.overview.totalTrades > 0 ? (data.overview.totalNetPnl / data.overview.totalTrades >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400') : 'text-gray-600 dark:text-gray-400'}`}>
                  {data.overview.totalTrades > 0 ? (
                    <>
                      {data.overview.totalNetPnl / data.overview.totalTrades >= 0 ? '+' : ''}₹{Math.round(data.overview.totalNetPnl / data.overview.totalTrades).toLocaleString()}
                    </>
                  ) : (
                    '₹0'
                  )}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Trade</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="group cursor-pointer backdrop-blur-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <TrendingUp className="h-5 w-5" />
              Add New Trade
            </CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-400">
              Record your latest trading activity
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <TrendingUp className="h-4 w-4 mr-2" />
              Add Trade
            </Button>
          </CardContent>
        </Card>

        <Card className="group cursor-pointer backdrop-blur-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-300">
              <BarChart3 className="h-5 w-5" />
              View Analytics
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-green-400">
              Deep dive into your performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-900/20 shadow-lg hover:shadow-xl transition-all duration-200">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
