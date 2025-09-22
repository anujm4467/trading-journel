'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  BarChart3, 
  PieChart as PieChartIcon,
  DollarSign,
  Percent
} from 'lucide-react'

interface StrategyData {
  strategy: string
  trades: number
  winRate: number
  pnl: number
  avgPnl: number
  weeklyData?: Array<{
    week: string
    pnl: number
    trades: number
  }>
}

interface GraphicalStrategyPerformanceProps {
  data: StrategyData[]
  selectedStrategies: string[]
  onStrategySelect: (strategy: string) => void
}

export function GraphicalStrategyPerformance({ 
  data, 
  selectedStrategies, 
  onStrategySelect
}: GraphicalStrategyPerformanceProps) {
  const totalTrades = data.reduce((sum, strategy) => sum + strategy.trades, 0)
  const totalPnl = data.reduce((sum, strategy) => sum + strategy.pnl, 0)
  const avgWinRate = data.length > 0 ? data.reduce((sum, strategy) => sum + strategy.winRate, 0) / data.length : 0

  // Prepare data for different chart types
  const pieData = data.map((strategy, index) => ({
    name: strategy.strategy,
    value: strategy.trades,
    pnl: strategy.pnl,
    winRate: strategy.winRate,
    color: getStrategyColor(index)
  }))

  const barData = data.map(strategy => ({
    strategy: strategy.strategy,
    pnl: strategy.pnl,
    trades: strategy.trades,
    winRate: strategy.winRate,
    avgPnl: strategy.avgPnl
  }))

  const COLORS = [
    'var(--profit-hex)', // Green for profit
    '#3b82f6', // Blue
    '#8b5cf6', // Purple
    '#f59e0b', // Amber
    'var(--loss-hex)', // Red for loss
    '#06b6d4', // Cyan
    '#84cc16', // Lime
    '#f97316'  // Orange
  ]

  function getStrategyColor(index: number): string {
    return COLORS[index % COLORS.length]
  }

  const formatCurrency = (value: number) => {
    return `₹${Math.round(value).toLocaleString()}`
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  // Removed cards view - showing charts by default
  if (false) {
    return (
      <div className="space-y-6">
        {/* Strategy Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((strategy) => (
            <Card 
              key={strategy.strategy}
              className={`backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer ${
                selectedStrategies.includes(strategy.strategy) 
                  ? 'ring-2 ring-blue-500 ring-opacity-50' 
                  : ''
              } ${
                strategy.pnl >= 0 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50' 
                  : 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200/50 dark:border-red-700/50'
              }`}
              onClick={() => onStrategySelect(strategy.strategy)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-lg ${
                    strategy.pnl >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                  }`}>
                    {strategy.strategy}
                  </CardTitle>
                  <Badge 
                    variant={strategy.pnl >= 0 ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {strategy.trades} trades
                  </Badge>
                </div>
                <CardDescription className={
                  strategy.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }>
                  {formatPercentage(strategy.winRate)} win rate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total P&L</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${
                      strategy.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {strategy.pnl >= 0 ? '+' : ''}{formatCurrency(strategy.pnl)}
                    </span>
                    {strategy.pnl >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg P&L</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-semibold ${
                      strategy.avgPnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {strategy.avgPnl >= 0 ? '+' : ''}{formatCurrency(strategy.avgPnl)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      strategy.avgPnl >= 0 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      per trade
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Removed table view - showing charts by default
  if (false) {
    return (
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Strategy Performance Table
          </CardTitle>
          <CardDescription>
            Detailed breakdown of each strategy&apos;s performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Strategy</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Trades</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Win Rate</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Total P&L</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Avg P&L</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {data.map((strategy, index) => (
                  <tr 
                    key={strategy.strategy} 
                    className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                      selectedStrategies.includes(strategy.strategy) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    } ${
                      index % 2 === 0 ? 'bg-white/50 dark:bg-gray-800/50' : 'bg-gray-50/50 dark:bg-gray-700/30'
                    }`}
                    onClick={() => onStrategySelect(strategy.strategy)}
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getStrategyColor(index) }}
                        ></div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {strategy.strategy}
                        </span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-2">
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {strategy.trades}
                      </span>
                    </td>
                    <td className="text-right py-3 px-2">
                      <div className="flex items-center justify-end gap-2">
                        <span className={`font-bold text-lg ${
                          strategy.winRate >= 60 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {strategy.winRate}%
                        </span>
                        {strategy.winRate >= 70 ? (
                          <span className="text-green-500">⭐</span>
                        ) : strategy.winRate >= 60 ? (
                          <span className="text-yellow-500">👍</span>
                        ) : (
                          <span className="text-red-500">⚠️</span>
                        )}
                      </div>
                    </td>
                    <td className="text-right py-3 px-2">
                      <div className="flex items-center justify-end gap-2">
                        <span className={`font-bold text-lg ${
                          strategy.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {strategy.pnl >= 0 ? '+' : ''}{formatCurrency(strategy.pnl)}
                        </span>
                        {strategy.pnl >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="text-right py-3 px-2">
                      <span className={`font-semibold ${
                        strategy.avgPnl >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {strategy.avgPnl >= 0 ? '+' : ''}{formatCurrency(strategy.avgPnl)}
                      </span>
                    </td>
                    <td className="text-right py-3 px-2">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-medium text-gray-600 dark:text-gray-400">
                          {((strategy.trades / totalTrades) * 100).toFixed(1)}%
                        </span>
                        <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${(strategy.trades / totalTrades) * 100}%`,
                              backgroundColor: getStrategyColor(index)
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Strategies</p>
                <p className="text-3xl font-bold text-blue-600">{data.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Total P&L</p>
                <p className={`text-3xl font-bold ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalPnl >= 0 ? '+' : ''}{formatCurrency(totalPnl)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 dark:border-purple-700/50 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Avg Win Rate</p>
                <p className="text-3xl font-bold text-purple-600">{formatPercentage(avgWinRate)}</p>
              </div>
              <Percent className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Strategy Distribution Pie Chart */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-green-600" />
              Strategy Distribution
            </CardTitle>
            <CardDescription>
              Trade distribution across strategies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`} // eslint-disable-line @typescript-eslint/no-explicit-any
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="rounded-xl border bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-4 shadow-2xl">
                            <p className="font-bold text-lg mb-3">{data.name}</p>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <span className="font-medium">Trades:</span>
                                <span className="font-bold text-blue-600">{data.value}</span>
                              </div>
                              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <span className="font-medium">P&L:</span>
                                <span className={`font-bold ${
                                  data.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {data.pnl >= 0 ? '+' : ''}{formatCurrency(data.pnl)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <span className="font-medium">Win Rate:</span>
                                <span className={`font-bold ${
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
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Strategy Performance Bar Chart */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Strategy Performance
            </CardTitle>
            <CardDescription>
              P&L comparison across strategies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="strategy" 
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
                                <span className="font-medium">Total P&L:</span>
                                <span className={`font-bold text-lg ${
                                  data.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {data.pnl >= 0 ? '+' : ''}{formatCurrency(data.pnl)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <span className="font-medium">Avg P&L:</span>
                                <span className={`font-semibold ${
                                  data.avgPnl >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {data.avgPnl >= 0 ? '+' : ''}{formatCurrency(data.avgPnl)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <span className="font-medium">Win Rate:</span>
                                <span className={`font-semibold ${
                                  data.winRate >= 60 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {formatPercentage(data.winRate)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <span className="font-medium">Trades:</span>
                                <span className="font-semibold text-blue-600">{data.trades}</span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="pnl" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, index) => (
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

      {/* Win Rate Comparison */}
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Win Rate Comparison
          </CardTitle>
          <CardDescription>
            Strategy performance by win rate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="strategy" 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs font-medium"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
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
                              <span className="font-medium">Win Rate:</span>
                              <span className={`font-bold text-lg ${
                                data.winRate >= 60 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {formatPercentage(data.winRate)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                              <span className="font-medium">Trades:</span>
                              <span className="font-semibold text-blue-600">{data.trades}</span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="winRate" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.winRate >= 60 ? 'var(--profit-hex)' : entry.winRate >= 40 ? '#f59e0b' : 'var(--loss-hex)'} 
                      className="drop-shadow-sm"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
