'use client'

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
  Shield
} from 'lucide-react'
import { PerformanceChart } from './PerformanceChart'
import { WinLossChart } from './WinLossChart'
import { StrategyPerformance } from './StrategyPerformance'
import { TimeAnalysis } from './TimeAnalysis'
import { RiskMetrics } from './RiskMetrics'
import { mockTradingData } from '@/lib/mockData'

export function AnalyticsDashboard() {
  // Comment out real API call and use mock data for better visualization
  // const { data: analytics, loading, error, refetch } = useAnalytics()
  
  // Use shared mock data for visualization
  const data = mockTradingData

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
              <ArrowUpRight className="h-3 w-3 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">
              ₹{data.overview.totalNetPnl.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600 font-medium">+12.8%</span>
              <span className="text-gray-500 dark:text-gray-400">from last month</span>
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
              {data.overview.winRate}%
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-blue-600 font-medium">+2.3%</span>
              <span className="text-gray-500 dark:text-gray-400">from last month</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {data.overview.winningTrades} wins, {data.overview.losingTrades} losses
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
              {data.overview.profitFactor}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-purple-600 font-medium">Excellent</span>
              <span className="text-gray-500 dark:text-gray-400">performance</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Avg win: ₹{data.overview.averageWin.toLocaleString()}
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
              ₹{data.overview.totalCharges.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-orange-600 font-medium">33.7%</span>
              <span className="text-gray-500 dark:text-gray-400">of gross P&L</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Brokerage, taxes & fees
            </p>
          </CardContent>
        </Card>
      </div>

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
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  P&L Over Time
                </CardTitle>
                <CardDescription>
                  Your trading performance over the last 12 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceChart data={data.dailyPnlData.map(item => ({
                  month: new Date(item.date).toLocaleDateString('en-US', { month: 'short' }),
                  pnl: item.pnl,
                  trades: Math.floor(Math.random() * 20) + 10 // Mock trade count
                }))} />
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
                <div className="text-3xl font-bold text-green-600 mb-2">
                  ₹{data.overview.averageWin.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Per winning trade
                </p>
                <div className="mt-2 text-xs text-green-600 font-medium">
                  +15.2% from last month
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
                <div className="text-3xl font-bold text-red-600 mb-2">
                  ₹{Math.abs(data.overview.averageLoss).toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Per losing trade
                </p>
                <div className="mt-2 text-xs text-red-600 font-medium">
                  -8.3% from last month
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
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ₹{data.overview.totalGrossPnl.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Before charges
                </p>
                <div className="mt-2 text-xs text-blue-600 font-medium">
                  +18.5% from last month
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          <StrategyPerformance data={data.strategyPerformance} />
        </TabsContent>

        <TabsContent value="time" className="space-y-6">
          <TimeAnalysis data={data.timeAnalysis} />
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <RiskMetrics 
            maxDrawdown={data.riskData.maxDrawdown}
            sharpeRatio={data.riskData.sharpeRatio}
            avgRiskReward={data.riskData.avgRiskReward}
            totalCharges={data.overview.totalCharges}
          />
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Performance vs Nifty 50
                </CardTitle>
                <CardDescription>
                  Your trading performance compared to Nifty 50 index
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="font-medium">Your Performance</span>
                    <span className="text-2xl font-bold text-green-600">+68.5%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="font-medium">Nifty 50</span>
                    <span className="text-2xl font-bold text-blue-600">+12.3%</span>
                  </div>
                  <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    You&apos;re outperforming the market by <span className="font-bold text-green-600">+56.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Risk-Adjusted Returns
                </CardTitle>
                <CardDescription>
                  Sharpe ratio comparison with market benchmarks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <span className="font-medium">Your Sharpe Ratio</span>
                    <span className="text-2xl font-bold text-purple-600">1.67</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                    <span className="font-medium">Market Average</span>
                    <span className="text-2xl font-bold text-gray-600">0.85</span>
                  </div>
                  <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-bold text-purple-600">96%</span> better risk-adjusted returns
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-600" />
                Monthly Performance Comparison
              </CardTitle>
              <CardDescription>
                Month-by-month performance vs market indices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                  <p className="text-orange-600 font-medium text-lg">Interactive Comparison Chart</p>
                  <p className="text-orange-500 text-sm">Coming soon with advanced analytics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
