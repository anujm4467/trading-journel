'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { formatCurrency } from '@/utils/calculations'

interface TimeAnalysisProps {
  data: {
    dayOfWeek: Record<string, number>
    timeOfDay: Record<string, number>
  }
}

export function TimeAnalysis({ data }: TimeAnalysisProps) {
  const dayData = Object.entries(data.dayOfWeek).map(([day, pnl]) => ({
    day,
    pnl,
    trades: Math.floor(Math.random() * 20) + 10 // Mock trade count for now
  }))

  const timeData = Object.entries(data.timeOfDay).map(([time, pnl]) => ({
    time,
    pnl,
    trades: Math.floor(Math.random() * 15) + 5 // Mock trade count for now
  }))

  return (
    <div className="space-y-6">
      {/* Day of Week Analysis */}
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📅</span>
            Performance by Day of Week
          </CardTitle>
          <CardDescription>
            Your trading performance across different days of the week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="day" 
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
                              <span className="font-medium">P&L:</span>
                              <div className="flex items-center gap-2">
                                <span className={`font-bold text-lg ${
                                  data.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {data.pnl >= 0 ? '+' : ''}{formatCurrency(data.pnl)}
                                </span>
                                {data.pnl >= 0 ? (
                                  <span className="text-green-500 text-lg">📈</span>
                                ) : (
                                  <span className="text-red-500 text-lg">📉</span>
                                )}
                              </div>
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
                  {dayData.map((entry, index) => (
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

      {/* Time of Day Analysis */}
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">⏰</span>
            Performance by Time of Day
          </CardTitle>
          <CardDescription>
            Your trading performance across different time slots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="time" 
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
                              <span className="font-medium">P&L:</span>
                              <div className="flex items-center gap-2">
                                <span className={`font-bold text-lg ${
                                  data.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {data.pnl >= 0 ? '+' : ''}{formatCurrency(data.pnl)}
                                </span>
                                {data.pnl >= 0 ? (
                                  <span className="text-green-500 text-lg">📈</span>
                                ) : (
                                  <span className="text-red-500 text-lg">📉</span>
                                )}
                              </div>
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
                  {timeData.map((entry, index) => (
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

      {/* Time Analysis Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="backdrop-blur-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-300">
              <span className="text-2xl">🏆</span>
              Best Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {Object.entries(data.dayOfWeek).reduce((a, b) => data.dayOfWeek[a[0]] > data.dayOfWeek[b[0]] ? a : b)[0]}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-green-600">
                {formatCurrency(Math.max(...Object.values(data.dayOfWeek)))}
              </span>
              <span className="text-green-500 text-lg">📈</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              Highest P&L day of the week
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <span className="text-2xl">⏰</span>
              Best Time Slot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {Object.entries(data.timeOfDay).reduce((a, b) => data.timeOfDay[a[0]] > data.timeOfDay[b[0]] ? a : b)[0]}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-blue-600">
                {formatCurrency(Math.max(...Object.values(data.timeOfDay)))}
              </span>
              <span className="text-blue-500 text-lg">📈</span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
              Most profitable trading time
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
