'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Shield, 
  AlertTriangle, 
  Loader2,
  AlertCircle,
  TrendingDown,
  Activity,
  BarChart3
} from 'lucide-react'
import { RiskMetrics } from '@/components/analytics/RiskMetrics'
import { AnalyticsFilterPanel } from '@/components/analytics/AnalyticsFilters'
import { useAnalytics, AnalyticsFilters } from '@/hooks/useAnalytics'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import Link from 'next/link'

export default function RiskMetricsPage() {
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
    console.log('Export risk metrics data')
  }

  const handleRefresh = () => {
    refetch()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading risk metrics data...
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
            Error Loading Risk Metrics Data
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
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Risk Metrics Data Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start by adding your first trade to see detailed risk analytics.
          </p>
        </div>
      </div>
    )
  }

  const riskData = data.riskData || {
    maxDrawdown: 0,
    sharpeRatio: 0,
    avgRiskReward: 0
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
            <BreadcrumbPage>Risk Metrics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Risk Metrics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive analysis of your trading risk and risk management
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

      {/* Risk Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="backdrop-blur-sm bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200/50 dark:border-red-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">Max Drawdown</CardTitle>
            <div className="flex items-center gap-1">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <AlertTriangle className="h-3 w-3 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
              {Math.abs(riskData.maxDrawdown).toFixed(2)}%
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-red-600 font-medium">
                {riskData.maxDrawdown < -20 ? 'High Risk' : riskData.maxDrawdown < -10 ? 'Medium Risk' : 'Low Risk'}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Maximum peak-to-trough decline
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Sharpe Ratio</CardTitle>
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-blue-600" />
              <BarChart3 className="h-3 w-3 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {riskData.sharpeRatio.toFixed(2)}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-blue-600 font-medium">
                {riskData.sharpeRatio > 2 ? 'Excellent' : riskData.sharpeRatio > 1 ? 'Good' : riskData.sharpeRatio > 0 ? 'Fair' : 'Poor'}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Risk-adjusted returns
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Risk-Reward Ratio</CardTitle>
            <div className="flex items-center gap-1">
              <Activity className="h-4 w-4 text-green-600" />
              <BarChart3 className="h-3 w-3 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
              {riskData.avgRiskReward.toFixed(2)}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600 font-medium">
                {riskData.avgRiskReward > 2 ? 'Excellent' : riskData.avgRiskReward > 1.5 ? 'Good' : riskData.avgRiskReward > 1 ? 'Fair' : 'Poor'}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Average risk to reward ratio
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 dark:border-purple-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Charges</CardTitle>
            <div className="flex items-center gap-1">
              <Activity className="h-4 w-4 text-purple-600" />
              <AlertTriangle className="h-3 w-3 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              ₹{Math.round(data.overview.totalCharges).toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-purple-600 font-medium">
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

      {/* Risk Metrics Chart */}
      <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">Risk Analysis</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Comprehensive risk metrics and drawdown analysis</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RiskMetrics 
            maxDrawdown={riskData.maxDrawdown}
            sharpeRatio={riskData.sharpeRatio}
            avgRiskReward={riskData.avgRiskReward}
            totalCharges={data.overview.totalCharges}
            dailyPnlData={data.dailyPnlData}
            totalTrades={data.overview.totalTrades}
          />
        </CardContent>
      </Card>

      {/* Risk Management Insights */}
      <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">Risk Management Insights</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Key insights and recommendations for risk management</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Risk Assessment</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">Drawdown Risk</span>
                  <span className={`font-bold ${Math.abs(riskData.maxDrawdown) < 10 ? 'text-green-600' : Math.abs(riskData.maxDrawdown) < 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {Math.abs(riskData.maxDrawdown) < 10 ? 'Low' : Math.abs(riskData.maxDrawdown) < 20 ? 'Medium' : 'High'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">Sharpe Ratio</span>
                  <span className={`font-bold ${riskData.sharpeRatio > 2 ? 'text-green-600' : riskData.sharpeRatio > 1 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {riskData.sharpeRatio > 2 ? 'Excellent' : riskData.sharpeRatio > 1 ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">Risk-Reward</span>
                  <span className={`font-bold ${riskData.avgRiskReward > 2 ? 'text-green-600' : riskData.avgRiskReward > 1.5 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {riskData.avgRiskReward > 2 ? 'Excellent' : riskData.avgRiskReward > 1.5 ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recommendations</h3>
              <div className="space-y-3">
                {Math.abs(riskData.maxDrawdown) > 20 && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-800 dark:text-red-200">High Drawdown Risk</p>
                        <p className="text-sm text-red-600 dark:text-red-300">Consider reducing position sizes and implementing stricter stop-losses.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {riskData.sharpeRatio < 1 && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800 dark:text-yellow-200">Low Sharpe Ratio</p>
                        <p className="text-sm text-yellow-600 dark:text-yellow-300">Focus on improving risk-adjusted returns through better trade selection.</p>
                      </div>
                    </div>
                  </div>
                )}

                {riskData.avgRiskReward < 1.5 && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800 dark:text-blue-200">Improve Risk-Reward</p>
                        <p className="text-sm text-blue-600 dark:text-blue-300">Aim for trades with better risk-reward ratios (1:2 or higher).</p>
                      </div>
                    </div>
                  </div>
                )}

                {Math.abs(riskData.maxDrawdown) <= 10 && riskData.sharpeRatio > 1.5 && riskData.avgRiskReward > 1.5 && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-200">Excellent Risk Management</p>
                        <p className="text-sm text-green-600 dark:text-green-300">Your risk metrics are well-balanced. Keep up the good work!</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
