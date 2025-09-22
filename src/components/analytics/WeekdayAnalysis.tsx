'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Calendar, TrendingUp, TrendingDown, Target } from 'lucide-react'

interface WeekdayData {
  day: string
  trades: number
  wins: number
  losses: number
  totalPnl: number
  avgPnl: number
  winRate: number
}

interface WeekdayAnalysisProps {
  data: WeekdayData[]
}

export function WeekdayAnalysis({ data }: WeekdayAnalysisProps) {
  // Filter out days with no trades for better visualization
  const filteredData = data.filter(day => day.trades > 0)
  
  // Find best and worst performing days
  const bestDay = filteredData.reduce((best, current) => 
    current.winRate > best.winRate ? current : best, 
    { winRate: 0, trades: 0, day: '', totalPnl: 0 }
  )
  
  const worstDay = filteredData.reduce((worst, current) => 
    current.winRate < worst.winRate ? current : worst, 
    { winRate: 100, trades: 0, day: '', totalPnl: 0 }
  )

  // Calculate total trades across all days
  const totalTrades = data.reduce((sum, day) => sum + day.trades, 0)
  const totalWins = data.reduce((sum, day) => sum + day.wins, 0)
  const totalLosses = data.reduce((sum, day) => sum + day.losses, 0)

  // Custom colors for bars based on performance
  const getBarColor = (winRate: number, trades: number) => {
    if (trades === 0) return '#e5e7eb' // Gray for no trades
    if (winRate >= 80) return '#10b981' // Green for excellent
    if (winRate >= 60) return '#3b82f6' // Blue for good
    if (winRate >= 40) return '#f59e0b' // Yellow for average
    return '#ef4444' // Red for poor
  }

  const chartData = data.map(day => ({
    ...day,
    dayShort: day.day.substring(0, 3), // Mon, Tue, etc.
    color: getBarColor(day.winRate, day.trades)
  }))

  return (
    <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
          <Calendar className="h-5 w-5 text-blue-600" />
          Weekday Analysis
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Trading performance by day of the week
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {filteredData.length > 0 ? (
          <div className="space-y-6">
            {/* Chart */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="dayShort" 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    label={{ value: 'Win Rate (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{data.day}</p>
                            <div className="space-y-1 text-sm">
                              <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Trades:</span> {data.trades}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Wins:</span> {data.wins} | <span className="font-medium">Losses:</span> {data.losses}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Win Rate:</span> {data.winRate.toFixed(1)}%
                              </p>
                              <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Total P&L:</span> ₹{data.totalPnl.toLocaleString()}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Avg P&L:</span> ₹{data.avgPnl.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar 
                    dataKey="winRate" 
                    radius={[4, 4, 0, 0]}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Best Day */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Best Day</span>
                </div>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">{bestDay.day}</p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {bestDay.winRate.toFixed(1)}% win rate ({bestDay.wins}/{bestDay.trades} trades)
                </p>
                <p className="text-xs text-green-500 dark:text-green-500">
                  ₹{bestDay.totalPnl.toLocaleString()} total P&L
                </p>
              </div>

              {/* Worst Day */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-700">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">Worst Day</span>
                </div>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">{worstDay.day}</p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  {worstDay.winRate.toFixed(1)}% win rate ({worstDay.wins}/{worstDay.trades} trades)
                </p>
                <p className="text-xs text-red-500 dark:text-red-500">
                  ₹{worstDay.totalPnl.toLocaleString()} total P&L
                </p>
              </div>

              {/* Overall Stats */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Overall</span>
                </div>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {totalTrades > 0 ? ((totalWins / totalTrades) * 100).toFixed(1) : '0'}% win rate
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {totalWins} wins / {totalLosses} losses
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-500">
                  {totalTrades} total trades
                </p>
              </div>
            </div>

            {/* Detailed Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="text-left py-2 font-medium text-gray-600 dark:text-gray-400">Day</th>
                    <th className="text-center py-2 font-medium text-gray-600 dark:text-gray-400">Trades</th>
                    <th className="text-center py-2 font-medium text-gray-600 dark:text-gray-400">Wins</th>
                    <th className="text-center py-2 font-medium text-gray-600 dark:text-gray-400">Losses</th>
                    <th className="text-center py-2 font-medium text-gray-600 dark:text-gray-400">Win Rate</th>
                    <th className="text-right py-2 font-medium text-gray-600 dark:text-gray-400">Total P&L</th>
                    <th className="text-right py-2 font-medium text-gray-600 dark:text-gray-400">Avg P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((day, index) => (
                    <tr 
                      key={index} 
                      className={`border-b border-gray-100 dark:border-gray-700 ${
                        day.trades === 0 ? 'opacity-50' : ''
                      }`}
                    >
                      <td className="py-2 font-medium text-gray-900 dark:text-gray-100">{day.day}</td>
                      <td className="py-2 text-center text-gray-600 dark:text-gray-400">{day.trades}</td>
                      <td className="py-2 text-center text-green-600 dark:text-green-400 font-medium">{day.wins}</td>
                      <td className="py-2 text-center text-red-600 dark:text-red-400 font-medium">{day.losses}</td>
                      <td className="py-2 text-center">
                        <span className={`font-medium ${
                          day.winRate >= 70 ? 'text-green-600 dark:text-green-400' :
                          day.winRate >= 50 ? 'text-blue-600 dark:text-blue-400' :
                          day.winRate >= 30 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {day.winRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2 text-right">
                        <span className={`font-medium ${
                          day.totalPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {day.totalPnl >= 0 ? '+' : ''}₹{day.totalPnl.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-2 text-right">
                        <span className={`font-medium ${
                          day.avgPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {day.avgPnl >= 0 ? '+' : ''}₹{day.avgPnl.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No trading data available for the selected period</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
