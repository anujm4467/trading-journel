'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  Target, 
  Loader2,
  AlertCircle
} from 'lucide-react'
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
          <p className="text-gray-600 dark:text-gray-400">Loading psychology analysis...</p>
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
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Trading Psychology Analysis
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Understand your trading behavior patterns and improve your psychological edge
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Discipline Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.overview.disciplineScore}%
            </div>
            <Progress value={data.overview.disciplineScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Risk Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {data.overview.riskManagementScore}%
            </div>
            <Progress value={data.overview.riskManagementScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Emotional Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {data.overview.emotionalControlScore}%
            </div>
            <Progress value={data.overview.emotionalControlScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Patience Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {data.overview.patienceScore}%
            </div>
            <Progress value={data.overview.patienceScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Behavior Patterns */}
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Behavior Patterns
          </CardTitle>
          <CardDescription>
            Analysis of your trading behavior and adherence to strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  Avg: {data.behaviorPatterns.overtrading.averageTradesPerDay} trades/day
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

      {/* AI Insights */}
      <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Insights & Recommendations
          </CardTitle>
          <CardDescription>
            Personalized analysis and suggestions to improve your trading psychology
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Key Insights</h4>
              <div className="space-y-3">
                {data.aiInsights.insights.map((insight, index) => (
                  <div key={index} className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-blue-100 dark:border-blue-800">
                    <div className="flex items-start gap-2">
                      <div className="text-blue-600 text-lg">
                        {insight.type === 'positive' ? '✅' : insight.type === 'warning' ? '⚠️' : '💡'}
                      </div>
                      <div>
                        <h5 className="font-medium text-sm">{insight.title}</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Recommendations</h4>
              <div className="space-y-3">
                {data.aiInsights.recommendations.map((rec, index) => (
                  <div key={index} className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-green-100 dark:border-green-800">
                    <div className="flex items-start gap-2">
                      <div className="text-green-600 text-lg">
                        {rec.priority === 'high' ? '🔥' : rec.priority === 'medium' ? '⭐' : '💡'}
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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}