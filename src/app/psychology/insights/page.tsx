'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, 
  Lightbulb, 
  Star, 
  Flame, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Target,
  TrendingUp,
  Brain,
  Activity,
  HeartCrack
} from 'lucide-react'
import { usePsychology } from '@/hooks/usePsychology'

export default function InsightsRecommendationsPage() {
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
          <p className="text-gray-600 dark:text-gray-400">Loading insights and recommendations...</p>
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
          <Lightbulb className="h-8 w-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No insights data available</p>
        </div>
      </div>
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-300'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-300'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'suggestion': return <Lightbulb className="h-4 w-4 text-blue-600" />
      default: return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getRecommendationIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Flame className="h-4 w-4 text-red-600" />
      case 'medium': return <Star className="h-4 w-4 text-yellow-600" />
      case 'low': return <Lightbulb className="h-4 w-4 text-green-600" />
      default: return <Zap className="h-4 w-4 text-blue-600" />
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          AI Insights & Recommendations
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Personalized analysis and actionable suggestions to improve your trading psychology
        </p>
      </div>

      {/* Performance Overview */}
      <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Performance Overview
          </CardTitle>
          <CardDescription>Your current psychological trading performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {data.overview.disciplineScore}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Discipline Score</div>
            </div>
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {data.overview.riskManagementScore}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Risk Management</div>
            </div>
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {data.overview.emotionalControlScore}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Emotional Control</div>
            </div>
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {data.overview.patienceScore}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Patience Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

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
          <div className="space-y-4">
            {data.insights.map((insight, index) => (
              <div key={index} className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-blue-100 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-medium text-sm text-gray-900 dark:text-white">{insight.title}</h5>
                      <Badge variant="outline" className="text-xs">
                        {insight.type === 'positive' ? 'Positive' : 
                         insight.type === 'warning' ? 'Warning' : 'Suggestion'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{insight.description}</p>
                    {insight.impact && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          Impact: {insight.impact}
                        </Badge>
                      </div>
                    )}
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
          <div className="space-y-4">
            {data.recommendations.map((rec, index) => (
              <div key={index} className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-green-100 dark:border-green-800">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getRecommendationIcon(rec.priority)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-medium text-sm text-gray-900 dark:text-white">{rec.title}</h5>
                      <Badge className={`text-xs ${getPriorityColor(rec.priority)}`}>
                        {rec.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{rec.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {rec.category}
                      </Badge>
                      {rec.action && (
                        <Badge variant="secondary" className="text-xs">
                          Action: {rec.action}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Psychological Factor Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Psychological Factors
            </CardTitle>
            <CardDescription>Your psychological state analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Sleep Quality</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-indigo-600">
                    {data.psychologicalFactors.sleepQuality.average.toFixed(1)}/10
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {data.psychologicalFactors.sleepQuality.average >= 8 ? 'Excellent' : 
                     data.psychologicalFactors.sleepQuality.average >= 6 ? 'Good' : 
                     data.psychologicalFactors.sleepQuality.average >= 4 ? 'Fair' : 'Poor'}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Energy Level</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-yellow-600">
                    {data.psychologicalFactors.energyLevel.average.toFixed(1)}/10
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {data.psychologicalFactors.energyLevel.average >= 8 ? 'High' : 
                     data.psychologicalFactors.energyLevel.average >= 6 ? 'Moderate' : 
                     data.psychologicalFactors.energyLevel.average >= 4 ? 'Low' : 'Very Low'}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Stress Level</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-red-600">
                    {data.psychologicalFactors.stressLevel.average.toFixed(1)}/10
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {data.psychologicalFactors.stressLevel.average >= 8 ? 'Very High' : 
                     data.psychologicalFactors.stressLevel.average >= 6 ? 'High' : 
                     data.psychologicalFactors.stressLevel.average >= 4 ? 'Moderate' : 'Low'}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Focus Level</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-purple-600">
                    {data.psychologicalFactors.focusLevel.average.toFixed(1)}/10
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {data.psychologicalFactors.focusLevel.average >= 8 ? 'Laser Focus' : 
                     data.psychologicalFactors.focusLevel.average >= 6 ? 'Focused' : 
                     data.psychologicalFactors.focusLevel.average >= 4 ? 'Distracted' : 'Very Distracted'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Behavioral Patterns
            </CardTitle>
            <CardDescription>Your trading behavior analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Risk-Reward Adherence</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-green-600">
                    {((data.behaviorPatterns.riskRewardAdherence.followed / (data.behaviorPatterns.riskRewardAdherence.followed + data.behaviorPatterns.riskRewardAdherence.deviated)) * 100).toFixed(1)}%
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {((data.behaviorPatterns.riskRewardAdherence.followed / (data.behaviorPatterns.riskRewardAdherence.followed + data.behaviorPatterns.riskRewardAdherence.deviated)) * 100) >= 80 ? 'Excellent' : 
                     ((data.behaviorPatterns.riskRewardAdherence.followed / (data.behaviorPatterns.riskRewardAdherence.followed + data.behaviorPatterns.riskRewardAdherence.deviated)) * 100) >= 60 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Strategy Following</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-blue-600">
                    {((data.behaviorPatterns.intradayHunter.followed / (data.behaviorPatterns.intradayHunter.followed + data.behaviorPatterns.intradayHunter.deviated)) * 100).toFixed(1)}%
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {((data.behaviorPatterns.intradayHunter.followed / (data.behaviorPatterns.intradayHunter.followed + data.behaviorPatterns.intradayHunter.deviated)) * 100) >= 80 ? 'Excellent' : 
                     ((data.behaviorPatterns.intradayHunter.followed / (data.behaviorPatterns.intradayHunter.followed + data.behaviorPatterns.intradayHunter.deviated)) * 100) >= 60 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overtrading Control</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-purple-600">
                    {((data.behaviorPatterns.overtrading.controlled / (data.behaviorPatterns.overtrading.controlled + data.behaviorPatterns.overtrading.excessive)) * 100).toFixed(1)}%
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {((data.behaviorPatterns.overtrading.controlled / (data.behaviorPatterns.overtrading.controlled + data.behaviorPatterns.overtrading.excessive)) * 100) >= 80 ? 'Excellent' : 
                     ((data.behaviorPatterns.overtrading.controlled / (data.behaviorPatterns.overtrading.controlled + data.behaviorPatterns.overtrading.excessive)) * 100) >= 60 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Patience Score</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-orange-600">
                    {((data.behaviorPatterns.retracementPatience.waited / (data.behaviorPatterns.retracementPatience.waited + data.behaviorPatterns.retracementPatience.premature)) * 100).toFixed(1)}%
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {((data.behaviorPatterns.retracementPatience.waited / (data.behaviorPatterns.retracementPatience.waited + data.behaviorPatterns.retracementPatience.premature)) * 100) >= 80 ? 'Excellent' : 
                     ((data.behaviorPatterns.retracementPatience.waited / (data.behaviorPatterns.retracementPatience.waited + data.behaviorPatterns.retracementPatience.premature)) * 100) >= 60 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Plan */}
      <Card className="backdrop-blur-sm bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200/50 dark:border-orange-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-600" />
            Action Plan
          </CardTitle>
          <CardDescription>Prioritized action items based on your psychological analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recommendations
              .filter(rec => rec.priority === 'high')
              .map((rec, index) => (
                <div key={index} className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-orange-100 dark:border-orange-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="h-4 w-4 text-red-600" />
                    <h5 className="font-medium text-sm text-gray-900 dark:text-white">{rec.title}</h5>
                    <Badge className="text-xs bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                      HIGH PRIORITY
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{rec.description}</p>
                  {rec.action && (
                    <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                      Action: {rec.action}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
