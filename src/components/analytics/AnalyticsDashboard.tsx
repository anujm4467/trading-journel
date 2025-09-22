'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  BarChart3, 
  Activity,
  Target,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  PieChart,
  Clock,
  Shield,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { PerformanceChart } from './PerformanceChart'
import { WinLossChart } from './WinLossChart'
import { StrategyPerformance } from './StrategyPerformance'
import { TimeAnalysis } from './TimeAnalysis'
import { RiskMetrics } from './RiskMetrics'
import { StrategyFilter } from './StrategyFilter'
import { WeeklyGrowthChart } from './WeeklyGrowthChart'
import { GraphicalStrategyPerformance } from './GraphicalStrategyPerformance'
import { useAnalytics, AnalyticsFilters, generateWeeklyGrowthData } from '@/hooks/useAnalytics'

export function AnalyticsDashboard() {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    instrumentType: 'ALL',
    timeRange: 'all',
    selectedStrategies: []
  })
  const [viewMode, setViewMode] = useState<'cards' | 'charts' | 'table'>('charts')

  const { data, loading, error, refetch } = useAnalytics(filters)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading analytics data...
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
            Error Loading Analytics
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
            No Analytics Data Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start by adding your first trade to see detailed analytics.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Deep dive into your trading performance and patterns
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
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
            <div className={`text-3xl font-bold mb-1 ${data.overview.totalNetPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.overview.totalNetPnl >= 0 ? '+' : ''}₹{Math.round(data.overview.totalNetPnl).toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className={`font-medium ${data.overview.totalNetPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
              <Target className="h-4 w-4 text-blue-600" />
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

        <Card className="backdrop-blur-sm bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200/50 dark:border-orange-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Total Charges</CardTitle>
            <div className="flex items-center gap-1">
              <Activity className="h-4 w-4 text-orange-600" />
              <ArrowDownRight className="h-3 w-3 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 mb-1">
              ₹{Math.round(data.overview.totalCharges).toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-orange-600 font-medium">
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

      {/* Strategy Filter */}
      <StrategyFilter
        strategies={data.strategyPerformance?.map(s => s.strategy) || []}
        selectedStrategies={filters.selectedStrategies || []}
        onStrategyChange={(strategies) => setFilters(prev => ({ ...prev, selectedStrategies: strategies }))}
        timeRange={filters.timeRange || 'all'}
        onTimeRangeChange={(range) => setFilters(prev => ({ ...prev, timeRange: range }))}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm p-1 rounded-lg">
          <TabsTrigger value="performance" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg">
            <BarChart3 className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="strategies" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg">
            <PieChart className="h-4 w-4" />
            Strategies
          </TabsTrigger>
          <TabsTrigger value="time" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg">
            <Clock className="h-4 w-4" />
            Time Analysis
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg">
            <Shield className="h-4 w-4" />
            Risk Metrics
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg">
            <TrendingUp className="h-4 w-4" />
            Comparison
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          {/* Weekly Growth Analysis */}
          <WeeklyGrowthChart 
            data={generateWeeklyGrowthData(data.dailyPnlData || [])}
            selectedStrategies={filters.selectedStrategies || []}
            timeRange={filters.timeRange || 'all'}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  P&L Over Time
                </CardTitle>
                <CardDescription>
                  Your trading performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data.monthlyPerformanceData && data.monthlyPerformanceData.length > 0 ? (
                  <PerformanceChart data={data.monthlyPerformanceData.map(item => ({
                    month: item.month,
                    pnl: item.pnl,
                    trades: item.trades
                  }))} />
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No performance data available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-600" />
                  Win/Loss Distribution
                </CardTitle>
                <CardDescription>
                  Distribution of your winning and losing trades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WinLossChart 
                  winningTrades={data.overview.winningTrades}
                  losingTrades={data.overview.losingTrades}
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="backdrop-blur-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-300">
                  <ArrowUpRight className="h-5 w-5" />
                  Average Win
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  +₹{Math.round(data.overview.averageWin).toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Per winning trade
                </p>
                <div className="mt-2 text-xs text-green-600 font-medium">
                  {data.overview.winningTrades} winning trades
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200/50 dark:border-red-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-red-700 dark:text-red-300">
                  <ArrowDownRight className="h-5 w-5" />
                  Average Loss
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                  -₹{Math.round(Math.abs(data.overview.averageLoss)).toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Per losing trade
                </p>
                <div className="mt-2 text-xs text-red-600 font-medium">
                  {data.overview.losingTrades} losing trades
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <DollarSign className="h-5 w-5" />
                  Gross P&L
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold mb-2 ${data.overview.totalGrossPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {data.overview.totalGrossPnl >= 0 ? '+' : ''}₹{Math.round(data.overview.totalGrossPnl).toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Before charges
                </p>
                <div className="mt-2 text-xs text-blue-600 font-medium">
                  {data.overview.totalTrades} total trades
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
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
            viewMode={viewMode}
          />
        </TabsContent>

        <TabsContent value="time" className="space-y-6">
          <TimeAnalysis data={data.timeAnalysis || { dayOfWeek: {}, timeOfDay: {} }} />
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <RiskMetrics 
            maxDrawdown={data.riskData?.maxDrawdown || 0}
            sharpeRatio={data.riskData?.sharpeRatio || 0}
            avgRiskReward={data.riskData?.avgRiskReward || 0}
            totalCharges={data.overview.totalCharges}
            dailyPnlData={data.dailyPnlData}
            totalTrades={data.overview.totalTrades}
          />
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
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
                  <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Based on {data.overview.totalTrades} trades
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Risk Metrics
                </CardTitle>
                <CardDescription>
                  Key risk and performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <span className="font-medium">Profit Factor</span>
                    <span className="text-2xl font-bold text-purple-600">{data.overview.profitFactor.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                    <span className="font-medium">Total Charges</span>
                    <span className="text-2xl font-bold text-gray-600">₹{Math.round(data.overview.totalCharges).toLocaleString()}</span>
                  </div>
                  <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    {data.overview.profitFactor >= 2 ? 'Excellent' : data.overview.profitFactor >= 1.5 ? 'Good' : 'Needs Improvement'} performance
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-600" />
                Instrument Performance
              </CardTitle>
              <CardDescription>
                Performance breakdown by instrument type
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.instrumentPerformance && data.instrumentPerformance.length > 0 ? (
                <div className="space-y-4">
                  {data.instrumentPerformance.map((instrument, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                      <span className="font-medium">{instrument.instrument}</span>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${instrument.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
