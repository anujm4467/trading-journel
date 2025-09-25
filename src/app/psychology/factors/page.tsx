'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Activity, 
  Moon, 
  Zap, 
  AlertTriangle, 
  Target, 
  Coffee,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react'
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { usePsychology } from '@/hooks/usePsychology'

export default function PsychologicalFactorsPage() {
  const [filters] = useState({
    dateFrom: undefined as string | undefined,
    dateTo: undefined as string | undefined,
    strategy: undefined as string | undefined
  })

  const { data, loading, error, refetch } = usePsychology(filters)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading psychological factors...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Activity className="h-8 w-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No psychological data available</p>
        </div>
      </div>
    )
  }

  const chartColors = {
    primary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    purple: '#8B5CF6',
    orange: '#F97316'
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Psychological Factors Analysis
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Deep dive into your physical and mental state during trading
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="backdrop-blur-sm bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200/50 dark:border-indigo-700/50 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <Moon className="h-4 w-4" />
              Sleep Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {data.psychologicalFactors.sleepQuality.average.toFixed(1)}/10
            </div>
            <Progress value={data.psychologicalFactors.sleepQuality.average * 10} className="mt-2" />
            <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
              {data.psychologicalFactors.sleepQuality.average >= 8 ? 'Excellent' : 
               data.psychologicalFactors.sleepQuality.average >= 6 ? 'Good' : 
               data.psychologicalFactors.sleepQuality.average >= 4 ? 'Fair' : 'Poor'}
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200/50 dark:border-yellow-700/50 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Energy Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {data.psychologicalFactors.energyLevel.average.toFixed(1)}/10
            </div>
            <Progress value={data.psychologicalFactors.energyLevel.average * 10} className="mt-2" />
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              {data.psychologicalFactors.energyLevel.average >= 8 ? 'High' : 
               data.psychologicalFactors.energyLevel.average >= 6 ? 'Moderate' : 
               data.psychologicalFactors.energyLevel.average >= 4 ? 'Low' : 'Very Low'}
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200/50 dark:border-red-700/50 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Stress Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {data.psychologicalFactors.stressLevel.average.toFixed(1)}/10
            </div>
            <Progress value={data.psychologicalFactors.stressLevel.average * 10} className="mt-2" />
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {data.psychologicalFactors.stressLevel.average >= 8 ? 'Very High' : 
               data.psychologicalFactors.stressLevel.average >= 6 ? 'High' : 
               data.psychologicalFactors.stressLevel.average >= 4 ? 'Moderate' : 'Low'}
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200/50 dark:border-purple-700/50 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Focus Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {data.psychologicalFactors.focusLevel.average.toFixed(1)}/10
            </div>
            <Progress value={data.psychologicalFactors.focusLevel.average * 10} className="mt-2" />
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              {data.psychologicalFactors.focusLevel.average >= 8 ? 'Laser Focus' : 
               data.psychologicalFactors.focusLevel.average >= 6 ? 'Focused' : 
               data.psychologicalFactors.focusLevel.average >= 4 ? 'Distracted' : 'Very Distracted'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FOMO Level */}
      <Card className="backdrop-blur-sm bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200/50 dark:border-orange-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-orange-600" />
            FOMO (Fear of Missing Out) Level
          </CardTitle>
          <CardDescription>How much FOMO influenced your trading decisions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl font-bold text-orange-600">
              {data.psychologicalFactors.fomoLevel.average.toFixed(1)}/10
            </span>
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              {data.psychologicalFactors.fomoLevel.average >= 7 ? 'High FOMO' : 
               data.psychologicalFactors.fomoLevel.average >= 4 ? 'Moderate FOMO' : 'Low FOMO'}
            </Badge>
          </div>
          <Progress value={data.psychologicalFactors.fomoLevel.average * 10} className="h-3" />
        </CardContent>
      </Card>

      {/* Psychology Trends Chart */}
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Psychology Trends Over Time
          </CardTitle>
          <CardDescription>How your psychological state evolved during your trading journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={data.charts.psychologyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip 
                  formatter={(value, name) => [value, name]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="sleepQuality" 
                  stroke={chartColors.primary} 
                  strokeWidth={3} 
                  name="Sleep Quality"
                  dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="energyLevel" 
                  stroke={chartColors.success} 
                  strokeWidth={3} 
                  name="Energy Level"
                  dot={{ fill: chartColors.success, strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="stressLevel" 
                  stroke={chartColors.danger} 
                  strokeWidth={3} 
                  name="Stress Level"
                  dot={{ fill: chartColors.danger, strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="focusLevel" 
                  stroke={chartColors.purple} 
                  strokeWidth={3} 
                  name="Focus Level"
                  dot={{ fill: chartColors.purple, strokeWidth: 2, r: 4 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Correlation Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              P&L Correlation Analysis
            </CardTitle>
            <CardDescription>How psychological factors correlate with trading performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Sleep Quality</span>
                  <span className={`text-sm font-bold ${
                    data.correlations.sleepVsPnl > 0.3 ? 'text-green-600' : 
                    data.correlations.sleepVsPnl > 0.1 ? 'text-yellow-600' : 
                    data.correlations.sleepVsPnl > -0.1 ? 'text-gray-600' : 'text-red-600'
                  }`}>
                    {data.correlations.sleepVsPnl > 0 ? '+' : ''}{data.correlations.sleepVsPnl.toFixed(3)}
                  </span>
                </div>
                <Progress 
                  value={Math.abs(data.correlations.sleepVsPnl) * 100} 
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Energy Level</span>
                  <span className={`text-sm font-bold ${
                    data.correlations.energyVsPnl > 0.3 ? 'text-green-600' : 
                    data.correlations.energyVsPnl > 0.1 ? 'text-yellow-600' : 
                    data.correlations.energyVsPnl > -0.1 ? 'text-gray-600' : 'text-red-600'
                  }`}>
                    {data.correlations.energyVsPnl > 0 ? '+' : ''}{data.correlations.energyVsPnl.toFixed(3)}
                  </span>
                </div>
                <Progress 
                  value={Math.abs(data.correlations.energyVsPnl) * 100} 
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Focus Level</span>
                  <span className={`text-sm font-bold ${
                    data.correlations.focusVsPnl > 0.3 ? 'text-green-600' : 
                    data.correlations.focusVsPnl > 0.1 ? 'text-yellow-600' : 
                    data.correlations.focusVsPnl > -0.1 ? 'text-gray-600' : 'text-red-600'
                  }`}>
                    {data.correlations.focusVsPnl > 0 ? '+' : ''}{data.correlations.focusVsPnl.toFixed(3)}
                  </span>
                </div>
                <Progress 
                  value={Math.abs(data.correlations.focusVsPnl) * 100} 
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Stress Level</span>
                  <span className={`text-sm font-bold ${
                    data.correlations.stressVsPnl > 0.3 ? 'text-green-600' : 
                    data.correlations.stressVsPnl > 0.1 ? 'text-yellow-600' : 
                    data.correlations.stressVsPnl > -0.1 ? 'text-gray-600' : 'text-red-600'
                  }`}>
                    {data.correlations.stressVsPnl > 0 ? '+' : ''}{data.correlations.stressVsPnl.toFixed(3)}
                  </span>
                </div>
                <Progress 
                  value={Math.abs(data.correlations.stressVsPnl) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-blue-600" />
              Practice Impact Analysis
            </CardTitle>
            <CardDescription>How your daily practices affect trading performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Meditation Practice</span>
                  <span className={`text-sm font-bold ${
                    data.correlations.meditationVsPnl > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {data.correlations.meditationVsPnl > 0 ? '+' : ''}₹{data.correlations.meditationVsPnl.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Average P&L difference when meditating vs not meditating
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Internet Issues</span>
                  <span className={`text-sm font-bold ${
                    data.correlations.internetIssuesVsPnl > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {data.correlations.internetIssuesVsPnl > 0 ? '+' : ''}₹{data.correlations.internetIssuesVsPnl.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Average P&L difference when facing internet issues
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
