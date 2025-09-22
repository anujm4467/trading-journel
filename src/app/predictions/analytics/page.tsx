'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Target, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar,
  Filter,
  Download
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DateRangePicker } from '@/components/ui/date-range-picker'

import { 
  PredictionAnalytics, 
  StrategyPredictionPerformance, 
  ConfidenceAccuracy,
  MonthlyPredictionTrend 
} from '@/types/prediction'

// Chart Components
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie,
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'

export default function PredictionAnalyticsPage() {
  const [analytics, setAnalytics] = useState<PredictionAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [selectedStrategy, setSelectedStrategy] = useState<string>('all')

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      
      if (dateRange.from) {
        params.append('fromDate', dateRange.from.toISOString())
      }
      if (dateRange.to) {
        params.append('toDate', dateRange.to.toISOString())
      }

      const response = await fetch(`/api/predictions/analytics?${params.toString()}`)
      const data = await response.json()
      
      if (data.data) {
        setAnalytics(data.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Loading analytics...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No Analytics Data
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Create some predictions to see analytics
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Chart data preparation
  const monthlyTrendData = analytics.monthlyTrends.map(trend => ({
    month: new Date(trend.month + '-01').toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
    predictions: trend.totalPredictions,
    successRate: trend.successRate,
    confidence: trend.averageConfidence
  }))

  const strategyChartData = analytics.strategyPerformance.map((strategy, index) => ({
    name: strategy.strategy,
    value: strategy.totalPredictions,
    successRate: strategy.successRate,
    fill: `hsl(${(index * 137.5) % 360}, 70%, 50%)`
  }))

  const confidenceChartData = analytics.confidenceAccuracy.map(conf => ({
    confidence: conf.confidenceLevel,
    accuracy: conf.accuracy,
    predictions: conf.totalPredictions
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Prediction Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Analyze your prediction performance and accuracy
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder="Select date range"
            />
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { 
              label: 'Total Predictions', 
              value: analytics.totalPredictions, 
              icon: Target, 
              color: 'blue',
              change: '+12%'
            },
            { 
              label: 'Success Rate', 
              value: `${analytics.successRate.toFixed(1)}%`, 
              icon: CheckCircle, 
              color: 'green',
              change: '+5.2%'
            },
            { 
              label: 'Avg Confidence', 
              value: analytics.averageConfidence.toFixed(1), 
              icon: TrendingUp, 
              color: 'purple',
              change: '+0.3'
            },
            { 
              label: 'Pending', 
              value: analytics.pendingPredictions, 
              icon: Clock, 
              color: 'yellow',
              change: '-2'
            }
          ].map((metric, index) => (
            <Card key={metric.label} className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.label}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-xs text-green-600 dark:text-green-400">{metric.change}</p>
                  </div>
                  <div className={`p-2 rounded-full bg-${metric.color}-100 dark:bg-${metric.color}-900/30`}>
                    <metric.icon className={`h-5 w-5 text-${metric.color}-600 dark:text-${metric.color}-400`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Monthly Trends</span>
                </CardTitle>
                <CardDescription>
                  Prediction volume and success rate over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="predictions"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                      name="Predictions"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="successRate"
                      stroke="#10B981"
                      strokeWidth={2}
                      name="Success Rate %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Strategy Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Strategy Performance</span>
                </CardTitle>
                <CardDescription>
                  Prediction distribution by strategy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={strategyChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {strategyChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Confidence vs Accuracy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Confidence vs Accuracy</span>
                </CardTitle>
                <CardDescription>
                  How confidence level correlates with actual accuracy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={confidenceChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="confidence" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="predictions"
                      fill="#3B82F6"
                      name="Predictions"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#10B981"
                      strokeWidth={2}
                      name="Accuracy %"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Strategy Success Rates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Strategy Success Rates</span>
                </CardTitle>
                <CardDescription>
                  Success rate by trading strategy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.strategyPerformance
                    .sort((a, b) => b.successRate - a.successRate)
                    .map((strategy, index) => (
                    <div key={strategy.strategy} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{strategy.strategy}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {strategy.successRate.toFixed(1)}%
                          </Badge>
                          <span className="text-xs text-gray-500">
                            ({strategy.totalPredictions} predictions)
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${strategy.successRate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Recent Predictions</span>
              </CardTitle>
              <CardDescription>
                Your latest prediction entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentPredictions.map((prediction) => (
                  <div
                    key={prediction.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">{prediction.strategy}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(prediction.predictionDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className={`${
                          prediction.status === 'PASSED'
                            ? 'text-green-600 border-green-200'
                            : prediction.status === 'FAILED'
                            ? 'text-red-600 border-red-200'
                            : 'text-yellow-600 border-yellow-200'
                        }`}
                      >
                        {prediction.status}
                      </Badge>
                      <Badge variant="outline">
                        Confidence: {prediction.confidence}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
