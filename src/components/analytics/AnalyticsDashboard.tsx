'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  BarChart3, 
  Target,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Clock,
  Shield,
  Loader2,
  AlertCircle,
  Activity,
  PieChart
} from 'lucide-react'
import { PerformanceChart } from './PerformanceChart'
import { WinLossChart } from './WinLossChart'
import { StrategyPerformance } from './StrategyPerformance'
import { TimeAnalysis } from './TimeAnalysis'
import { RiskMetrics } from './RiskMetrics'
import { StrategyFilter } from './StrategyFilter'
import { AnalyticsFilterPanel } from './AnalyticsFilters'
import { WeeklyGrowthChart } from './WeeklyGrowthChart'
import { GraphicalStrategyPerformance } from './GraphicalStrategyPerformance'
import { PeriodAnalysis } from './PeriodAnalysis'
import { useAnalytics, AnalyticsFilters, generateWeeklyGrowthData } from '@/hooks/useAnalytics'

export function AnalyticsDashboard() {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    instrumentType: 'OPTIONS', // Default to Options
    timeRange: 'month', // Default to current month
    selectedStrategies: []
  })
  const [activeTimeframe, setActiveTimeframe] = useState('month') // Default to current month

  console.log('AnalyticsDashboard - Initial filters:', filters)
  console.log('AnalyticsDashboard - Initial activeTimeframe:', activeTimeframe)

  const { data, loading, error, refetch, setFilters: setAnalyticsFilters } = useAnalytics(filters)

  const handleTimeframeChange = (timeframe: string) => {
    console.log('AnalyticsDashboard - handleTimeframeChange called with:', timeframe)
    setActiveTimeframe(timeframe)
    setAnalyticsFilters({ timeRange: timeframe as any })
  }

  const handleFiltersChange = (newFilters: AnalyticsFilters) => {
    console.log('AnalyticsDashboard - handleFiltersChange called with:', newFilters)
    setFilters(prev => {
      const updated = { ...prev, ...newFilters }
      console.log('AnalyticsDashboard - updated filters:', updated)
      return updated
    })
    setAnalyticsFilters(newFilters)
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export analytics data')
  }

  const handleRefresh = () => {
    refetch()
  }

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

        <Card className="backdrop-blur-sm bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200/50 dark:border-red-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">Total Charges</CardTitle>
            <div className="flex items-center gap-1">
              <Activity className="h-4 w-4 text-red-600" />
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

      {/* Period Analysis */}
      {data.periodAnalysis && (
        <PeriodAnalysis 
          timeframe={filters.timeRange || 'month'}
          data={data.periodAnalysis}
        />
      )}

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-6">
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-white/20 shadow-xl">
          <CardContent className="p-2">
            <TabsList className="grid w-full grid-cols-5 bg-gray-100/50 dark:bg-gray-700/50 backdrop-blur-sm p-1 rounded-lg">
              <TabsTrigger 
                value="performance" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-600 transition-all duration-200"
              >
                <BarChart3 className="h-4 w-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger 
                value="strategies" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-purple-600 transition-all duration-200"
              >
                <PieChart className="h-4 w-4" />
                Strategies
              </TabsTrigger>
              <TabsTrigger 
                value="time" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-green-600 transition-all duration-200"
              >
                <Clock className="h-4 w-4" />
                Time Analysis
              </TabsTrigger>
              <TabsTrigger 
                value="risk" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-red-600 transition-all duration-200"
              >
                <Shield className="h-4 w-4" />
                Risk Metrics
              </TabsTrigger>
              <TabsTrigger 
                value="comparison" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-orange-600 transition-all duration-200"
              >
                <TrendingUp className="h-4 w-4" />
                Comparison
              </TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>

        <TabsContent value="performance" className="space-y-8">
          {/* Weekly Growth Analysis */}
          <WeeklyGrowthChart 
            data={generateWeeklyGrowthData(data.dailyPnlData || [])}
            selectedStrategies={filters.selectedStrategies || []}
            timeRange={filters.timeRange || 'all'}
          />

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
                  <PerformanceChart data={data.monthlyPerformanceData.map(item => ({
                    month: item.month,
                    pnl: item.pnl,
                    trades: item.trades
                  }))} />
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
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
