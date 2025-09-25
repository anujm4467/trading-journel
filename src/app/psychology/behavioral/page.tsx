'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Clock, 
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts'
import { usePsychology } from '@/hooks/usePsychology'

export default function BehavioralPatternsPage() {
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
          <p className="text-gray-600 dark:text-gray-400">Loading behavioral patterns...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <XCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
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
          <Target className="h-8 w-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No behavioral data available</p>
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
    indigo: '#6366F1',
    teal: '#14B8A6'
  }

  const pieColors = [chartColors.primary, chartColors.success, chartColors.warning, chartColors.danger, chartColors.purple, chartColors.pink]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Behavioral Patterns Analysis
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Understanding your trading behavior and adherence to strategies
        </p>
      </div>

      {/* Key Behavior Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="backdrop-blur-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200/50 dark:border-green-700/50 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Risk-Reward Adherence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {data.behaviorPatterns.riskRewardAdherence.followed}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              / {data.behaviorPatterns.riskRewardAdherence.followed + data.behaviorPatterns.riskRewardAdherence.deviated} trades
            </div>
            <Progress 
              value={(data.behaviorPatterns.riskRewardAdherence.followed / (data.behaviorPatterns.riskRewardAdherence.followed + data.behaviorPatterns.riskRewardAdherence.deviated)) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200/50 dark:border-blue-700/50 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Strategy Following
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.behaviorPatterns.intradayHunter.followed}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              / {data.behaviorPatterns.intradayHunter.followed + data.behaviorPatterns.intradayHunter.deviated} trades
            </div>
            <Progress 
              value={(data.behaviorPatterns.intradayHunter.followed / (data.behaviorPatterns.intradayHunter.followed + data.behaviorPatterns.intradayHunter.deviated)) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200/50 dark:border-purple-700/50 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Overtrading Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {data.behaviorPatterns.overtrading.controlled}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              / {data.behaviorPatterns.overtrading.controlled + data.behaviorPatterns.overtrading.excessive} days
            </div>
            <Progress 
              value={(data.behaviorPatterns.overtrading.controlled / (data.behaviorPatterns.overtrading.controlled + data.behaviorPatterns.overtrading.excessive)) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200/50 dark:border-orange-700/50 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-400 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Patience Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {data.behaviorPatterns.retracementPatience.waited}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              / {data.behaviorPatterns.retracementPatience.waited + data.behaviorPatterns.retracementPatience.premature} trades
            </div>
            <Progress 
              value={(data.behaviorPatterns.retracementPatience.waited / (data.behaviorPatterns.retracementPatience.waited + data.behaviorPatterns.retracementPatience.premature)) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Behavior Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk-Reward Adherence */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Risk-Reward Adherence
            </CardTitle>
            <CardDescription>How consistently you follow your risk-reward ratios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Followed</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                  {data.behaviorPatterns.riskRewardAdherence.followed}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Deviated</span>
                </div>
                <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                  {data.behaviorPatterns.riskRewardAdherence.deviated}
                </Badge>
              </div>
              <Progress 
                value={(data.behaviorPatterns.riskRewardAdherence.followed / (data.behaviorPatterns.riskRewardAdherence.followed + data.behaviorPatterns.riskRewardAdherence.deviated)) * 100} 
                className="h-3"
              />
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {((data.behaviorPatterns.riskRewardAdherence.followed / (data.behaviorPatterns.riskRewardAdherence.followed + data.behaviorPatterns.riskRewardAdherence.deviated)) * 100).toFixed(1)}% adherence rate
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strategy Following */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Intraday Hunter Strategy
            </CardTitle>
            <CardDescription>Adherence to your intraday hunter strategy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Followed</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                  {data.behaviorPatterns.intradayHunter.followed}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Deviated</span>
                </div>
                <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                  {data.behaviorPatterns.intradayHunter.deviated}
                </Badge>
              </div>
              <Progress 
                value={(data.behaviorPatterns.intradayHunter.followed / (data.behaviorPatterns.intradayHunter.followed + data.behaviorPatterns.intradayHunter.deviated)) * 100} 
                className="h-3"
              />
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {((data.behaviorPatterns.intradayHunter.followed / (data.behaviorPatterns.intradayHunter.followed + data.behaviorPatterns.intradayHunter.deviated)) * 100).toFixed(1)}% adherence rate
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overtrading Analysis */}
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-600" />
            Overtrading Analysis
          </CardTitle>
          <CardDescription>Your trading frequency and overtrading patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {data.behaviorPatterns.overtrading.controlled}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Controlled Days</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {data.behaviorPatterns.overtrading.excessive}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Excessive Days</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {data.behaviorPatterns.overtrading.averageTradesPerDay.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Trades/Day</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Behavior Patterns Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Behavior Distribution Chart */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Behavior Patterns Distribution
            </CardTitle>
            <CardDescription>Visual breakdown of your trading behaviors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={data.charts.behaviorPatterns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="pattern" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill={chartColors.primary} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Patience Analysis */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Patience Analysis
            </CardTitle>
            <CardDescription>Your patience in waiting for retracements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Waited for Retracement</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                  {data.behaviorPatterns.retracementPatience.waited}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Premature Exit</span>
                </div>
                <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                  {data.behaviorPatterns.retracementPatience.premature}
                </Badge>
              </div>
              <Progress 
                value={(data.behaviorPatterns.retracementPatience.waited / (data.behaviorPatterns.retracementPatience.waited + data.behaviorPatterns.retracementPatience.premature)) * 100} 
                className="h-3"
              />
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {((data.behaviorPatterns.retracementPatience.waited / (data.behaviorPatterns.retracementPatience.waited + data.behaviorPatterns.retracementPatience.premature)) * 100).toFixed(1)}% patience rate
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Impact */}
      <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Behavior Performance Impact
          </CardTitle>
          <CardDescription>How your behavioral patterns affect trading performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {data.overview.disciplineScore}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Discipline Score</div>
            </div>
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {data.overview.riskManagementScore}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Risk Management</div>
            </div>
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {data.overview.emotionalControlScore}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Emotional Control</div>
            </div>
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {data.overview.patienceScore}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Patience Score</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
