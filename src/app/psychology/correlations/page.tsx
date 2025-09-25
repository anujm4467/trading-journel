'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  BrainCircuit, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  ScatterChart,
  Activity,
  Moon,
  Zap,
  AlertTriangle,
  Target,
  Coffee,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { ScatterChart as RechartsScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, LineChart as RechartsLineChart, Line } from 'recharts'
import { usePsychology } from '@/hooks/usePsychology'

export default function PnLCorrelationsPage() {
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
          <p className="text-gray-600 dark:text-gray-400">Loading P&L correlations...</p>
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
          <BrainCircuit className="h-8 w-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No correlation data available</p>
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
    orange: '#F97316',
    indigo: '#6366F1',
    teal: '#14B8A6'
  }

  const getCorrelationStrength = (correlation: number) => {
    const abs = Math.abs(correlation)
    if (abs >= 0.7) return { strength: 'Strong', color: 'text-green-600' }
    if (abs >= 0.5) return { strength: 'Moderate', color: 'text-yellow-600' }
    if (abs >= 0.3) return { strength: 'Weak', color: 'text-orange-600' }
    return { strength: 'Very Weak', color: 'text-gray-600' }
  }

  const getCorrelationDirection = (correlation: number) => {
    return correlation > 0 ? 'Positive' : correlation < 0 ? 'Negative' : 'No Correlation'
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          P&L Correlations Analysis
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Understanding how psychological factors correlate with your trading performance
        </p>
      </div>

      {/* Correlation Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="backdrop-blur-sm bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200/50 dark:border-indigo-700/50 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <Moon className="h-4 w-4" />
              Sleep vs P&L
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {data.correlations.sleepVsPnl > 0 ? '+' : ''}{data.correlations.sleepVsPnl.toFixed(3)}
            </div>
            <Progress value={Math.abs(data.correlations.sleepVsPnl) * 100} className="mt-2" />
            <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
              {getCorrelationStrength(data.correlations.sleepVsPnl).strength} {getCorrelationDirection(data.correlations.sleepVsPnl)}
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200/50 dark:border-yellow-700/50 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Energy vs P&L
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {data.correlations.energyVsPnl > 0 ? '+' : ''}{data.correlations.energyVsPnl.toFixed(3)}
            </div>
            <Progress value={Math.abs(data.correlations.energyVsPnl) * 100} className="mt-2" />
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              {getCorrelationStrength(data.correlations.energyVsPnl).strength} {getCorrelationDirection(data.correlations.energyVsPnl)}
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200/50 dark:border-red-700/50 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Stress vs P&L
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {data.correlations.stressVsPnl > 0 ? '+' : ''}{data.correlations.stressVsPnl.toFixed(3)}
            </div>
            <Progress value={Math.abs(data.correlations.stressVsPnl) * 100} className="mt-2" />
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {getCorrelationStrength(data.correlations.stressVsPnl).strength} {getCorrelationDirection(data.correlations.stressVsPnl)}
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200/50 dark:border-purple-700/50 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Focus vs P&L
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {data.correlations.focusVsPnl > 0 ? '+' : ''}{data.correlations.focusVsPnl.toFixed(3)}
            </div>
            <Progress value={Math.abs(data.correlations.focusVsPnl) * 100} className="mt-2" />
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              {getCorrelationStrength(data.correlations.focusVsPnl).strength} {getCorrelationDirection(data.correlations.focusVsPnl)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Practice Impact Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="backdrop-blur-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200/50 dark:border-green-700/50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Meditation Practice Impact
            </CardTitle>
            <CardDescription>How meditation affects your trading performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                ₹{data.correlations.meditationVsPnl.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Average P&L difference when meditating vs not meditating
              </div>
              <div className={`text-lg font-bold ${
                data.correlations.meditationVsPnl > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.correlations.meditationVsPnl > 0 ? 'Positive Impact' : 'Negative Impact'}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {data.correlations.meditationVsPnl > 0 
                  ? 'Meditation practice shows positive correlation with trading performance'
                  : 'Consider the impact of meditation on your trading decisions'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200/50 dark:border-orange-700/50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coffee className="h-5 w-5 text-orange-600" />
              Internet Issues Impact
            </CardTitle>
            <CardDescription>How internet connectivity affects your trading performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                ₹{data.correlations.internetIssuesVsPnl.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Average P&L difference when facing internet issues
              </div>
              <div className={`text-lg font-bold ${
                data.correlations.internetIssuesVsPnl > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.correlations.internetIssuesVsPnl > 0 ? 'Positive Impact' : 'Negative Impact'}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {data.correlations.internetIssuesVsPnl < 0 
                  ? 'Internet issues negatively impact your trading performance'
                  : 'Internet issues may not significantly affect your trading'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Correlation Analysis */}
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Detailed Correlation Analysis
          </CardTitle>
          <CardDescription>Comprehensive view of all psychological factors and their P&L correlations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.charts.pnlCorrelations.map((correlation, index) => {
              const strength = getCorrelationStrength(correlation.correlation)
              const direction = getCorrelationDirection(correlation.correlation)
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{correlation.factor}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${strength.color}`}>
                        {correlation.correlation > 0 ? '+' : ''}{correlation.correlation.toFixed(3)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {strength.strength}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {direction}
                      </Badge>
                    </div>
                  </div>
                  <Progress 
                    value={Math.abs(correlation.correlation) * 100} 
                    className="h-2"
                  />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Scatter Plot Analysis */}
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScatterChart className="h-5 w-5 text-blue-600" />
            Sleep Quality vs P&L Scatter Plot
          </CardTitle>
          <CardDescription>Visual relationship between sleep quality and trading performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsScatterChart data={data.charts.psychologyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="sleepQuality" 
                  name="Sleep Quality" 
                  domain={[0, 10]}
                  label={{ value: 'Sleep Quality (1-10)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  dataKey="netPnl" 
                  name="Net P&L" 
                  label={{ value: 'Net P&L (₹)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name) => [
                    name === 'netPnl' ? `₹${value}` : value,
                    name === 'netPnl' ? 'Net P&L' : 'Sleep Quality'
                  ]}
                  labelFormatter={(label) => `Sleep Quality: ${label}`}
                />
                <Scatter 
                  dataKey="netPnl" 
                  fill={chartColors.primary}
                  r={6}
                />
              </RechartsScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Correlation Insights */}
      <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            Correlation Insights
          </CardTitle>
          <CardDescription>Key insights about psychological factors and trading performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Strongest Positive Correlation</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {(() => {
                  const correlations = data.charts.pnlCorrelations
                  const strongest = correlations.reduce((max, curr) => 
                    Math.abs(curr.correlation) > Math.abs(max.correlation) ? curr : max
                  )
                  return `${strongest.factor} (${strongest.correlation > 0 ? '+' : ''}${strongest.correlation.toFixed(3)})`
                })()}
              </div>
            </div>
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Most Impactful Factor</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {(() => {
                  const factors = [
                    { name: 'Sleep Quality', correlation: data.correlations.sleepVsPnl },
                    { name: 'Energy Level', correlation: data.correlations.energyVsPnl },
                    { name: 'Focus Level', correlation: data.correlations.focusVsPnl },
                    { name: 'Stress Level', correlation: data.correlations.stressVsPnl }
                  ]
                  const mostImpactful = factors.reduce((max, curr) => 
                    Math.abs(curr.correlation) > Math.abs(max.correlation) ? curr : max
                  )
                  return `${mostImpactful.name} (${mostImpactful.correlation > 0 ? '+' : ''}${mostImpactful.correlation.toFixed(3)})`
                })()}
              </div>
            </div>
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Practice Recommendations</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {data.correlations.meditationVsPnl > 0 
                  ? 'Continue your meditation practice as it shows positive correlation with performance.'
                  : 'Consider starting a meditation practice to potentially improve trading performance.'}
              </div>
            </div>
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Technical Considerations</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {data.correlations.internetIssuesVsPnl < 0 
                  ? 'Ensure stable internet connection as connectivity issues negatively impact performance.'
                  : 'Your trading performance appears resilient to internet connectivity issues.'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
