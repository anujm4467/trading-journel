'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  Cell
} from 'recharts'
import { TrendingUp, TrendingDown, Calendar, BarChart3, Activity } from 'lucide-react'

interface WeeklyGrowthData {
  week: string
  pnl: number
  trades: number
  winRate: number
  cumulativePnl: number
  growth: number
}

interface WeeklyGrowthChartProps {
  data: WeeklyGrowthData[]
  selectedStrategies?: string[]
  timeRange: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all'
}

export function WeeklyGrowthChart({ data, selectedStrategies, timeRange }: WeeklyGrowthChartProps) {
  const currentWeek = new Date().toISOString().slice(0, 4) + '-W' + getWeekNumber(new Date())
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  const currentQuarter = `Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${new Date().getFullYear()}`
  const currentYear = new Date().getFullYear().toString()

  // Calculate growth metrics
  const totalGrowth = data.length > 0 ? data[data.length - 1].cumulativePnl : 0
  const weeklyGrowth = data.length > 1 ? data[data.length - 1].pnl - data[data.length - 2].pnl : 0
  const avgWeeklyGrowth = data.length > 0 ? totalGrowth / data.length : 0
  const bestWeek = data.reduce((max, week) => week.pnl > max.pnl ? week : max, data[0] || { pnl: 0, week: '' })
  const worstWeek = data.reduce((min, week) => week.pnl < min.pnl ? week : min, data[0] || { pnl: 0, week: '' })

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'today': return 'Today'
      case 'week': return `Week ${currentWeek}`
      case 'month': return currentMonth
      case 'quarter': return currentQuarter
      case 'year': return currentYear
      default: return 'All Time'
    }
  }

  const formatCurrency = (value: number) => {
    return `₹${Math.round(value).toLocaleString()}`
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      {/* Growth Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="backdrop-blur-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold mb-1 ${totalGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalGrowth >= 0 ? '+' : ''}{formatCurrency(totalGrowth)}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {getTimeRangeLabel()}
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Weekly Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold mb-1 ${weeklyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {weeklyGrowth >= 0 ? '+' : ''}{formatCurrency(weeklyGrowth)}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              This week vs last
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 dark:border-purple-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Avg Weekly
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold mb-1 ${avgWeeklyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {avgWeeklyGrowth >= 0 ? '+' : ''}{formatCurrency(avgWeeklyGrowth)}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Per week average
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200/50 dark:border-orange-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Best Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold mb-1 ${bestWeek.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {bestWeek.pnl >= 0 ? '+' : ''}{formatCurrency(bestWeek.pnl)}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {bestWeek.week || 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Growth Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cumulative P&L Growth */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Cumulative P&L Growth
            </CardTitle>
            <CardDescription>
              Your trading performance over time - {getTimeRangeLabel()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="week" 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs font-medium"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="rounded-xl border bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-4 shadow-2xl">
                            <p className="font-bold text-lg mb-3">{label}</p>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <span className="font-medium">Cumulative P&L:</span>
                                <span className={`font-bold text-lg ${
                                  data.cumulativePnl >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {data.cumulativePnl >= 0 ? '+' : ''}{formatCurrency(data.cumulativePnl)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <span className="font-medium">Week P&L:</span>
                                <span className={`font-semibold ${
                                  data.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {data.pnl >= 0 ? '+' : ''}{formatCurrency(data.pnl)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <span className="font-medium">Trades:</span>
                                <span className="font-semibold text-blue-600">{data.trades}</span>
                              </div>
                              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <span className="font-medium">Win Rate:</span>
                                <span className={`font-semibold ${
                                  data.winRate >= 60 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {formatPercentage(data.winRate)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulativePnl"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#colorPnl)"
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly P&L Distribution */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Weekly P&L Distribution
            </CardTitle>
            <CardDescription>
              Individual week performance breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="week" 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs font-medium"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="rounded-xl border bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-4 shadow-2xl">
                            <p className="font-bold text-lg mb-3">{label}</p>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <span className="font-medium">Week P&L:</span>
                                <span className={`font-bold text-lg ${
                                  data.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {data.pnl >= 0 ? '+' : ''}{formatCurrency(data.pnl)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <span className="font-medium">Growth:</span>
                                <span className={`font-semibold ${
                                  data.growth >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {data.growth >= 0 ? '+' : ''}{formatPercentage(data.growth)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card className="backdrop-blur-sm bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 border-slate-200/50 dark:border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-slate-600" />
            Performance Summary - {getTimeRangeLabel()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {data.filter(week => week.pnl > 0).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Profitable Weeks</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {data.filter(week => week.pnl < 0).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Losing Weeks</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {data.length > 0 ? (data.filter(week => week.pnl > 0).length / data.length * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Win Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function to get week number
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}
