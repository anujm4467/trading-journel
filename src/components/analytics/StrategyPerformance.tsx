'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { formatCurrency, formatPercentage } from '@/utils/calculations'

interface StrategyPerformanceProps {
  data: Array<{
    strategy: string
    trades: number
    winRate: number
    pnl: number
    avgPnl: number
  }>
}

export function StrategyPerformance({ data }: StrategyPerformanceProps) {
  const totalTrades = data.reduce((sum, strategy) => sum + strategy.trades, 0)

  return (
    <div className="space-y-6">
      {/* Strategy Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((strategy) => (
          <Card 
            key={strategy.strategy} 
            className={`backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${
              strategy.pnl >= 0 
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50' 
                : 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200/50 dark:border-red-700/50'
            }`}
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
                    <span className="text-green-500 text-lg">📈</span>
                  ) : (
                    <span className="text-red-500 text-lg">📉</span>
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
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Win Rate</span>
                  <span className={`font-bold ${
                    strategy.winRate >= 60 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {strategy.winRate}%
                  </span>
                </div>
                <Progress 
                  value={strategy.winRate} 
                  className={`h-3 ${
                    strategy.winRate >= 60 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Performance</span>
                  <span className={
                    strategy.winRate >= 70 ? 'text-green-600 font-medium' : 
                    strategy.winRate >= 60 ? 'text-yellow-600 font-medium' : 
                    'text-red-600 font-medium'
                  }>
                    {strategy.winRate >= 70 ? 'Excellent' : 
                     strategy.winRate >= 60 ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Strategy Performance Chart */}
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Strategy Performance Comparison
          </CardTitle>
          <CardDescription>
            P&L comparison across different trading strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                  content={({ active, payload, label }: { active?: boolean; payload?: Array<{ payload: { pnl: number; avgPnl: number; winRate: number; trades: number } }>; label?: string | number }) => {
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
                                {data.winRate}%
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
                <Bar 
                  dataKey="pnl" 
                  radius={[6, 6, 0, 0]}
                >
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

      {/* Strategy Statistics Table */}
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Strategy Statistics
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
                    className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      index % 2 === 0 ? 'bg-white/50 dark:bg-gray-800/50' : 'bg-gray-50/50 dark:bg-gray-700/30'
                    }`}
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${
                          strategy.pnl >= 0 ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
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
                          <span className="text-green-500 text-lg">📈</span>
                        ) : (
                          <span className="text-red-500 text-lg">📉</span>
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
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(strategy.trades / totalTrades) * 100}%` }}
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
    </div>
  )
}
