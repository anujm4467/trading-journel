'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  Target, 
  Loader2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  Moon,
  Zap,
  AlertTriangle,
  Coffee,
  HeartCrack,
  BarChart3,
  PieChart,
  LineChart,
  BrainCircuit,
  Target as TargetIcon,
  Clock,
  Smile,
  Frown,
  CheckCircle,
  XCircle,
  Info,
  Lightbulb,
  Flame,
  Star
} from 'lucide-react'
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, ScatterChart, Scatter } from 'recharts'
import { usePsychology } from '@/hooks/usePsychology'

export function PsychologyAnalysis() {
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
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading comprehensive psychology analysis...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Brain className="h-8 w-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No psychology data available</p>
          <p className="text-sm text-gray-500 mt-2">Start recording your trades with psychology data to see insights</p>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Comprehensive Trading Psychology Analysis
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Deep insights into your psychological patterns and their impact on trading performance
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200/50 dark:border-blue-700/50 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Discipline Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.overview.disciplineScore}%
            </div>
            <Progress value={data.overview.disciplineScore} className="mt-2" />
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {data.overview.disciplineScore >= 80 ? 'Excellent' : data.overview.disciplineScore >= 60 ? 'Good' : 'Needs Improvement'}
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200/50 dark:border-green-700/50 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-2">
              <TargetIcon className="h-4 w-4" />
              Risk Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {data.overview.riskManagementScore}%
            </div>
            <Progress value={data.overview.riskManagementScore} className="mt-2" />
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              {data.overview.riskManagementScore >= 80 ? 'Excellent' : data.overview.riskManagementScore >= 60 ? 'Good' : 'Needs Improvement'}
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200/50 dark:border-purple-700/50 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Emotional Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {data.overview.emotionalControlScore}%
            </div>
            <Progress value={data.overview.emotionalControlScore} className="mt-2" />
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              {data.overview.emotionalControlScore >= 80 ? 'Excellent' : data.overview.emotionalControlScore >= 60 ? 'Good' : 'Needs Improvement'}
            </p>
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
              {data.overview.patienceScore}%
            </div>
            <Progress value={data.overview.patienceScore} className="mt-2" />
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              {data.overview.patienceScore >= 80 ? 'Excellent' : data.overview.patienceScore >= 60 ? 'Good' : 'Needs Improvement'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {data.overview.winRate.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Success rate</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Average P&L
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data.overview.averagePnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              ₹{data.overview.averagePnl.toFixed(2)}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Per trade</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Total Trades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.overview.totalTrades}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Analyzed</p>
          </CardContent>
        </Card>
      </div>

      {/* Comprehensive Analysis Tabs */}
      <Tabs defaultValue="psychological" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="psychological">Psychological Factors</TabsTrigger>
          <TabsTrigger value="behavioral">Behavioral Patterns</TabsTrigger>
          <TabsTrigger value="emotional">Emotional Analysis</TabsTrigger>
          <TabsTrigger value="correlations">P&L Correlations</TabsTrigger>
          <TabsTrigger value="insights">Insights & Recommendations</TabsTrigger>
        </TabsList>

        {/* Psychological Factors Tab */}
        <TabsContent value="psychological" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Physical & Mental State */}
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Physical & Mental State
                </CardTitle>
                <CardDescription>Your physical and mental condition during trades</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4 text-indigo-600" />
                      <span className="text-sm font-medium">Sleep Quality</span>
                    </div>
                    <span className="text-lg font-bold text-indigo-600">
                      {data.psychologicalFactors.sleepQuality.average.toFixed(1)}/10
                    </span>
                  </div>
                  <Progress value={data.psychologicalFactors.sleepQuality.average * 10} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">Energy Level</span>
                    </div>
                    <span className="text-lg font-bold text-yellow-600">
                      {data.psychologicalFactors.energyLevel.average.toFixed(1)}/10
                    </span>
                  </div>
                  <Progress value={data.psychologicalFactors.energyLevel.average * 10} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">Stress Level</span>
                    </div>
                    <span className="text-lg font-bold text-red-600">
                      {data.psychologicalFactors.stressLevel.average.toFixed(1)}/10
                    </span>
                  </div>
                  <Progress value={data.psychologicalFactors.stressLevel.average * 10} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Focus Level</span>
                    </div>
                    <span className="text-lg font-bold text-purple-600">
                      {data.psychologicalFactors.focusLevel.average.toFixed(1)}/10
                    </span>
                  </div>
                  <Progress value={data.psychologicalFactors.focusLevel.average * 10} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coffee className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium">FOMO Level</span>
                    </div>
                    <span className="text-lg font-bold text-orange-600">
                      {data.psychologicalFactors.fomoLevel.average.toFixed(1)}/10
                    </span>
                  </div>
                  <Progress value={data.psychologicalFactors.fomoLevel.average * 10} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Psychology Trends Chart */}
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-blue-600" />
                  Psychology Trends Over Time
                </CardTitle>
                <CardDescription>How your psychological state evolved</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={data.charts.psychologyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="sleepQuality" stroke={chartColors.primary} strokeWidth={2} name="Sleep Quality" />
                      <Line type="monotone" dataKey="energyLevel" stroke={chartColors.success} strokeWidth={2} name="Energy Level" />
                      <Line type="monotone" dataKey="stressLevel" stroke={chartColors.danger} strokeWidth={2} name="Stress Level" />
                      <Line type="monotone" dataKey="focusLevel" stroke={chartColors.purple} strokeWidth={2} name="Focus Level" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Behavioral Patterns Tab */}
        <TabsContent value="behavioral" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Behavior Patterns */}
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Behavior Patterns
                </CardTitle>
                <CardDescription>Analysis of your trading behavior and adherence to strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Risk-Reward Adherence</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Followed</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                          {data.behaviorPatterns.riskRewardAdherence.followed}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Deviated</span>
                        <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                          {data.behaviorPatterns.riskRewardAdherence.deviated}
                        </Badge>
                      </div>
                      <Progress 
                        value={(data.behaviorPatterns.riskRewardAdherence.followed / (data.behaviorPatterns.riskRewardAdherence.followed + data.behaviorPatterns.riskRewardAdherence.deviated)) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Intraday Hunter Strategy</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Followed</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                          {data.behaviorPatterns.intradayHunter.followed}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Deviated</span>
                        <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                          {data.behaviorPatterns.intradayHunter.deviated}
                        </Badge>
                      </div>
                      <Progress 
                        value={(data.behaviorPatterns.intradayHunter.followed / (data.behaviorPatterns.intradayHunter.followed + data.behaviorPatterns.intradayHunter.deviated)) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Overtrading Control</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Controlled</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                          {data.behaviorPatterns.overtrading.controlled}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Excessive</span>
                        <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                          {data.behaviorPatterns.overtrading.excessive}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Avg: {data.behaviorPatterns.overtrading.averageTradesPerDay.toFixed(1)} trades/day
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Retracement Patience</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Waited</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                          {data.behaviorPatterns.retracementPatience.waited}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Premature</span>
                        <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                          {data.behaviorPatterns.retracementPatience.premature}
                        </Badge>
                      </div>
                      <Progress 
                        value={(data.behaviorPatterns.retracementPatience.waited / (data.behaviorPatterns.retracementPatience.waited + data.behaviorPatterns.retracementPatience.premature)) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Behavior Patterns Chart */}
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-600" />
                  Behavior Patterns Distribution
                </CardTitle>
                <CardDescription>Visual breakdown of your trading behaviors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <RechartsPieChart
                        data={data.charts.behaviorPatterns}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {data.charts.behaviorPatterns.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </RechartsPieChart>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Emotional Analysis Tab */}
        <TabsContent value="emotional" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Emotional Metrics */}
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeartCrack className="h-5 w-5 text-red-600" />
                  Emotional Analysis
                </CardTitle>
                <CardDescription>Your emotional state and its impact on trading</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Greed Score</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {data.emotionalAnalysis.greedScore.average.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={data.emotionalAnalysis.greedScore.average} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">Fear Score</span>
                    </div>
                    <span className="text-lg font-bold text-red-600">
                      {data.emotionalAnalysis.fearScore.average.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={data.emotionalAnalysis.fearScore.average} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium">Revenge Trading</span>
                    </div>
                    <span className="text-lg font-bold text-orange-600">
                      {data.emotionalAnalysis.revengeTrading.frequency.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={data.emotionalAnalysis.revengeTrading.frequency} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">Impulsive Trading</span>
                    </div>
                    <span className="text-lg font-bold text-yellow-600">
                      {data.emotionalAnalysis.impulsiveTrading.frequency.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={data.emotionalAnalysis.impulsiveTrading.frequency} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Emotional States Chart */}
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Emotional States Distribution
                </CardTitle>
                <CardDescription>Frequency of different emotional states</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.charts.emotionalStates}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="emotion" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill={chartColors.purple} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* P&L Correlations Tab */}
        <TabsContent value="correlations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Correlation Matrix */}
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  P&L Correlations
                </CardTitle>
                <CardDescription>How psychological factors correlate with trading performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.charts.pnlCorrelations.map((correlation, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{correlation.factor}</span>
                        <span className={`text-sm font-bold ${
                          correlation.correlation > 0.3 ? 'text-green-600' : 
                          correlation.correlation > 0.1 ? 'text-yellow-600' : 
                          correlation.correlation > -0.1 ? 'text-gray-600' : 'text-red-600'
                        }`}>
                          {correlation.correlation > 0 ? '+' : ''}{correlation.correlation.toFixed(3)}
                        </span>
                      </div>
                      <Progress 
                        value={Math.abs(correlation.correlation) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Correlation Scatter Plot */}
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ScatterChart className="h-5 w-5 text-blue-600" />
                  Sleep Quality vs P&L
                </CardTitle>
                <CardDescription>Relationship between sleep quality and trading performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={data.charts.psychologyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="sleepQuality" name="Sleep Quality" />
                      <YAxis dataKey="netPnl" name="Net P&L" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter dataKey="netPnl" fill={chartColors.primary} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights & Recommendations Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Insights */}
            <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                  Key Insights
                </CardTitle>
                <CardDescription>Critical observations about your trading psychology</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.insights.map((insight, index) => (
                    <div key={index} className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-blue-100 dark:border-blue-800">
                      <div className="flex items-start gap-2">
                        <div className="text-blue-600 text-lg">
                          {insight.type === 'positive' ? <CheckCircle className="h-4 w-4" /> : 
                           insight.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> : 
                           <Info className="h-4 w-4" />}
                        </div>
                        <div>
                          <h5 className="font-medium text-sm">{insight.title}</h5>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{insight.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="backdrop-blur-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-green-600" />
                  Recommendations
                </CardTitle>
                <CardDescription>Actionable suggestions to improve your trading psychology</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.recommendations.map((rec, index) => (
                    <div key={index} className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-green-100 dark:border-green-800">
                      <div className="flex items-start gap-2">
                        <div className="text-green-600 text-lg">
                          {rec.priority === 'high' ? <Flame className="h-4 w-4" /> : 
                           rec.priority === 'medium' ? <Star className="h-4 w-4" /> : 
                           <Lightbulb className="h-4 w-4" />}
                        </div>
                        <div>
                          <h5 className="font-medium text-sm">{rec.title}</h5>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{rec.description}</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {rec.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}