'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  PieChart, 
  Clock, 
  Shield, 
  TrendingUp,
  ArrowRight,
  Loader2,
  AlertCircle,
  Activity
} from 'lucide-react'
import { useAnalytics, AnalyticsFilters } from '@/hooks/useAnalytics'
import { AnalyticsFilterPanel } from '@/components/analytics/AnalyticsFilters'

const analyticsSections = [
  {
    title: 'Performance',
    description: 'Detailed analysis of your trading performance over time',
    href: '/analytics/performance',
    icon: BarChart3,
    color: 'blue',
    features: ['P&L Charts', 'Win/Loss Analysis', 'Growth Tracking', 'Performance Metrics']
  },
  {
    title: 'Strategies',
    description: 'Performance analysis of your trading strategies',
    href: '/analytics/strategies',
    icon: PieChart,
    color: 'purple',
    features: ['Strategy Comparison', 'Performance Breakdown', 'Success Rates', 'ROI Analysis']
  },
  {
    title: 'Time Analysis',
    description: 'Analyze your trading performance by time periods and patterns',
    href: '/analytics/time-analysis',
    icon: Clock,
    color: 'green',
    features: ['Weekday Analysis', 'Time of Day Patterns', 'Seasonal Trends', 'Activity Tracking']
  },
  {
    title: 'Risk Metrics',
    description: 'Comprehensive analysis of your trading risk and risk management',
    href: '/analytics/risk-metrics',
    icon: Shield,
    color: 'red',
    features: ['Drawdown Analysis', 'Sharpe Ratio', 'Risk-Reward Ratios', 'Risk Assessment']
  },
  {
    title: 'Comparison',
    description: 'Compare your trading performance across different metrics and time periods',
    href: '/analytics/comparison',
    icon: TrendingUp,
    color: 'orange',
    features: ['Benchmark Comparison', 'Instrument Analysis', 'Strategy Ranking', 'Performance Insights']
  }
]

export default function AnalyticsPage() {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading analytics overview...
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
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Filter Panel */}
      <AnalyticsFilterPanel
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onTimeframeChange={handleTimeframeChange}
        activeTimeframe={activeTimeframe}
        onExport={() => console.log('Export analytics data')}
        onRefresh={refetch}
        strategies={data?.strategyPerformance?.map(s => s.strategy) || []}
        isLoading={loading}
      />

      {/* Quick Stats Overview */}
      {data && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="backdrop-blur-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Net P&L</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold mb-1 ${data.overview.totalNetPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {data.overview.totalNetPnl >= 0 ? '+' : ''}₹{Math.round(data.overview.totalNetPnl).toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {data.overview.totalTrades} total trades
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Win Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {data.overview.winRate.toFixed(1)}%
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {data.overview.winningTrades} wins / {data.overview.losingTrades} losses
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 dark:border-purple-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Profit Factor</CardTitle>
              <PieChart className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {data.overview.profitFactor.toFixed(2)}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {data.overview.profitFactor >= 2 ? 'Excellent' : data.overview.profitFactor >= 1.5 ? 'Good' : 'Needs Improvement'}
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200/50 dark:border-red-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">Max Drawdown</CardTitle>
              <Shield className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                {Math.abs(data.riskData?.maxDrawdown || 0).toFixed(1)}%
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {Math.abs(data.riskData?.maxDrawdown || 0) < 10 ? 'Low Risk' : Math.abs(data.riskData?.maxDrawdown || 0) < 20 ? 'Medium Risk' : 'High Risk'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Sections */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {analyticsSections.map((section, index) => {
          const Icon = section.icon
          const colorClasses = {
            blue: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 text-blue-600',
            purple: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 dark:border-purple-700/50 text-purple-600',
            green: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50 text-green-600',
            red: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200/50 dark:border-red-700/50 text-red-600',
            orange: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200/50 dark:border-orange-700/50 text-orange-600'
          }

          return (
            <Link key={section.title} href={section.href}>
              <Card className={`backdrop-blur-sm bg-gradient-to-br ${colorClasses[section.color as keyof typeof colorClasses]} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group cursor-pointer`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className={`p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className={`h-6 w-6 ${colorClasses[section.color as keyof typeof colorClasses].split(' ')[4]}`} />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                        {section.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {section.description}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {section.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${colorClasses[section.color as keyof typeof colorClasses].split(' ')[4].replace('text-', 'bg-')}`} />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/20 dark:border-gray-700/20">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        View Details
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-500 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common analytics tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button asChild variant="outline" className="h-auto p-6 flex flex-col items-start gap-2">
              <Link href="/analytics/performance">
                <BarChart3 className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">View Performance</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">See detailed performance charts</div>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-6 flex flex-col items-start gap-2">
              <Link href="/analytics/risk-metrics">
                <Shield className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Check Risk</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Review risk metrics</div>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-6 flex flex-col items-start gap-2">
              <Link href="/analytics/comparison">
                <TrendingUp className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Compare Performance</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Benchmark your results</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
