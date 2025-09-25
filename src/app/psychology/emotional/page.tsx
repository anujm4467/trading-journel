'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  HeartCrack, 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  Zap, 
  BarChart3,
  Brain,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as RechartsLineChart, Line } from 'recharts'
import { usePsychology } from '@/hooks/usePsychology'

export default function EmotionalAnalysisPage() {
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
          <p className="text-gray-600 dark:text-gray-400">Loading emotional analysis...</p>
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
          <HeartCrack className="h-8 w-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No emotional data available</p>
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
    pink: '#EC4899',
    orange: '#F97316'
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Emotional Analysis
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Understanding your emotional state and its impact on trading performance
        </p>
      </div>

      {/* Emotional Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="backdrop-blur-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200/50 dark:border-green-700/50 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Greed Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {data.emotionalAnalysis.greedScore.average.toFixed(1)}%
            </div>
            <Progress value={data.emotionalAnalysis.greedScore.average} className="mt-2" />
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              {data.emotionalAnalysis.greedScore.average >= 70 ? 'High Greed' : 
               data.emotionalAnalysis.greedScore.average >= 40 ? 'Moderate Greed' : 'Low Greed'}
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200/50 dark:border-red-700/50 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Fear Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {data.emotionalAnalysis.fearScore.average.toFixed(1)}%
            </div>
            <Progress value={data.emotionalAnalysis.fearScore.average} className="mt-2" />
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {data.emotionalAnalysis.fearScore.average >= 70 ? 'High Fear' : 
               data.emotionalAnalysis.fearScore.average >= 40 ? 'Moderate Fear' : 'Low Fear'}
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200/50 dark:border-orange-700/50 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-400 flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Revenge Trading
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {data.emotionalAnalysis.revengeTrading.frequency.toFixed(1)}%
            </div>
            <Progress value={data.emotionalAnalysis.revengeTrading.frequency} className="mt-2" />
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              {data.emotionalAnalysis.revengeTrading.frequency >= 30 ? 'High Frequency' : 
               data.emotionalAnalysis.revengeTrading.frequency >= 15 ? 'Moderate Frequency' : 'Low Frequency'}
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200/50 dark:border-yellow-700/50 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Impulsive Trading
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {data.emotionalAnalysis.impulsiveTrading.frequency.toFixed(1)}%
            </div>
            <Progress value={data.emotionalAnalysis.impulsiveTrading.frequency} className="mt-2" />
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              {data.emotionalAnalysis.impulsiveTrading.frequency >= 30 ? 'High Frequency' : 
               data.emotionalAnalysis.impulsiveTrading.frequency >= 15 ? 'Moderate Frequency' : 'Low Frequency'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Emotional Impact Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Greed & Fear Analysis */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Greed & Fear Analysis
            </CardTitle>
            <CardDescription>Your emotional balance in trading decisions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Greed Level</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {data.emotionalAnalysis.greedScore.average.toFixed(1)}%
                  </span>
                </div>
                <Progress value={data.emotionalAnalysis.greedScore.average} className="h-3" />
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Correlation with P&L: {data.emotionalAnalysis.greedScore.correlation > 0 ? '+' : ''}{data.emotionalAnalysis.greedScore.correlation.toFixed(3)}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">Fear Level</span>
                  </div>
                  <span className="text-lg font-bold text-red-600">
                    {data.emotionalAnalysis.fearScore.average.toFixed(1)}%
                  </span>
                </div>
                <Progress value={data.emotionalAnalysis.fearScore.average} className="h-3" />
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Correlation with P&L: {data.emotionalAnalysis.fearScore.correlation > 0 ? '+' : ''}{data.emotionalAnalysis.fearScore.correlation.toFixed(3)}
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Emotional Balance</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {Math.abs(data.emotionalAnalysis.greedScore.average - data.emotionalAnalysis.fearScore.average) < 20 
                    ? 'You maintain a good emotional balance between greed and fear.' 
                    : data.emotionalAnalysis.greedScore.average > data.emotionalAnalysis.fearScore.average 
                      ? 'You tend to be more driven by greed than fear.' 
                      : 'You tend to be more driven by fear than greed.'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trading Patterns */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-600" />
              Trading Patterns
            </CardTitle>
            <CardDescription>Emotional trading patterns and their impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">Revenge Trading</span>
                  </div>
                  <span className="text-lg font-bold text-orange-600">
                    {data.emotionalAnalysis.revengeTrading.frequency.toFixed(1)}%
                  </span>
                </div>
                <Progress value={data.emotionalAnalysis.revengeTrading.frequency} className="h-3" />
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Impact on P&L: ₹{data.emotionalAnalysis.revengeTrading.impact.toFixed(2)}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Impulsive Trading</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">
                    {data.emotionalAnalysis.impulsiveTrading.frequency.toFixed(1)}%
                  </span>
                </div>
                <Progress value={data.emotionalAnalysis.impulsiveTrading.frequency} className="h-3" />
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Impact on P&L: ₹{data.emotionalAnalysis.impulsiveTrading.impact.toFixed(2)}
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg">
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Pattern Analysis</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {data.emotionalAnalysis.revengeTrading.frequency > 20 || data.emotionalAnalysis.impulsiveTrading.frequency > 20
                    ? 'You show signs of emotional trading patterns that may be impacting your performance.'
                    : 'You maintain good emotional control in your trading decisions.'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emotional States Chart */}
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Emotional States Distribution
          </CardTitle>
          <CardDescription>Frequency of different emotional states in your trading</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={data.charts.emotionalStates}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="emotion" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [value, 'Frequency']}
                  labelFormatter={(label) => `Emotion: ${label}`}
                />
                <Bar dataKey="count" fill={chartColors.purple} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Emotional Control Score */}
      <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200/50 dark:border-purple-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartCrack className="h-5 w-5 text-purple-600" />
            Emotional Control Score
          </CardTitle>
          <CardDescription>Your overall emotional control in trading</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                {data.overview.emotionalControlScore}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Overall Score</div>
              <Progress value={data.overview.emotionalControlScore} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {100 - data.emotionalAnalysis.greedScore.average}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Greed Control</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {100 - data.emotionalAnalysis.fearScore.average}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Fear Control</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emotional Insights */}
      <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            Emotional Insights
          </CardTitle>
          <CardDescription>Key insights about your emotional trading patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Greed Analysis</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {data.emotionalAnalysis.greedScore.average >= 70 
                  ? 'High greed levels may be causing you to take excessive risks or hold positions too long.'
                  : data.emotionalAnalysis.greedScore.average >= 40 
                    ? 'Moderate greed levels - good balance between ambition and caution.'
                    : 'Low greed levels - you may be too conservative in your trading approach.'}
              </div>
            </div>
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Fear Analysis</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {data.emotionalAnalysis.fearScore.average >= 70 
                  ? 'High fear levels may be causing you to exit positions too early or avoid good opportunities.'
                  : data.emotionalAnalysis.fearScore.average >= 40 
                    ? 'Moderate fear levels - good balance between caution and opportunity.'
                    : 'Low fear levels - you may be taking excessive risks without proper risk management.'}
              </div>
            </div>
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Revenge Trading</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {data.emotionalAnalysis.revengeTrading.frequency >= 30 
                  ? 'High revenge trading frequency - focus on emotional control and risk management.'
                  : data.emotionalAnalysis.revengeTrading.frequency >= 15 
                    ? 'Moderate revenge trading - continue working on emotional discipline.'
                    : 'Low revenge trading - good emotional control in your trading decisions.'}
              </div>
            </div>
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Impulsive Trading</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {data.emotionalAnalysis.impulsiveTrading.frequency >= 30 
                  ? 'High impulsive trading frequency - develop a systematic approach to trading decisions.'
                  : data.emotionalAnalysis.impulsiveTrading.frequency >= 15 
                    ? 'Moderate impulsive trading - continue working on systematic decision-making.'
                    : 'Low impulsive trading - good systematic approach to trading decisions.'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
