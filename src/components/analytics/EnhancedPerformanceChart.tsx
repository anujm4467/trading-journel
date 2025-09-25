'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, ComposedChart, Line, Bar, ReferenceLine } from 'recharts'
import { formatCurrency } from '@/utils/calculations'

interface EnhancedPerformanceChartProps {
  data: Array<{
    month: string
    pnl: number
    trades: number
  }>
}

export function EnhancedPerformanceChart({ data }: EnhancedPerformanceChartProps) {
  // Process data to add color information and cumulative calculations
  let cumulativePnl = 0
  const processedData = data.map(item => {
    cumulativePnl += item.pnl
    return {
      ...item,
      isProfit: item.pnl >= 0,
      cumulativePnl,
      profitColor: item.pnl >= 0 ? '#10b981' : '#ef4444', // green-500 : red-500
      cumulativeColor: cumulativePnl >= 0 ? '#10b981' : '#ef4444'
    }
  })

  // Find the maximum and minimum values for better scaling
  const maxPnl = Math.max(...processedData.map(d => d.pnl))
  const minPnl = Math.min(...processedData.map(d => d.pnl))
  const maxCumulative = Math.max(...processedData.map(d => d.cumulativePnl))
  const minCumulative = Math.min(...processedData.map(d => d.cumulativePnl))

  return (
    <div className="space-y-6">
      {/* Monthly P&L with Profit/Loss Bars */}
      <div className="h-[250px]">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          Monthly P&L Performance
        </h4>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              className="text-xs text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              className="text-xs text-gray-600 dark:text-gray-400"
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              tick={{ fontSize: 12 }}
            />
            <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="2 2" strokeOpacity={0.5} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="rounded-xl border bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-4 shadow-2xl">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{label}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${data.isProfit ? 'bg-green-500' : 'bg-red-500'}`} />
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly P&L</p>
                            <p className={`text-lg font-bold ${data.isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {formatCurrency(data.pnl)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-blue-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cumulative P&L</p>
                            <p className={`text-lg font-bold ${data.cumulativePnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {formatCurrency(data.cumulativePnl)}
                            </p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Trades: <span className="font-medium text-gray-900 dark:text-gray-100">{data.trades}</span>
                          </p>
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
              fill={(entry) => entry.isProfit ? "url(#profitGradient)" : "url(#lossGradient)"}
              radius={[6, 6, 0, 0]}
              stroke={(entry) => entry.isProfit ? "#10b981" : "#ef4444"}
              strokeWidth={1}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Cumulative P&L Trend */}
      <div className="h-[250px]">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          Cumulative P&L Trend
        </h4>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              className="text-xs text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              className="text-xs text-gray-600 dark:text-gray-400"
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              tick={{ fontSize: 12 }}
            />
            <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="2 2" strokeOpacity={0.5} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="rounded-xl border bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-4 shadow-2xl">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{label}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-purple-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cumulative P&L</p>
                            <p className={`text-lg font-bold ${data.cumulativePnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {formatCurrency(data.cumulativePnl)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${data.isProfit ? 'bg-green-500' : 'bg-red-500'}`} />
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly P&L</p>
                            <p className={`text-lg font-bold ${data.isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {formatCurrency(data.pnl)}
                            </p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Trades: <span className="font-medium text-gray-900 dark:text-gray-100">{data.trades}</span>
                          </p>
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
              stroke="#8b5cf6"
              fill="url(#cumulativeGradient)"
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: '#8b5cf6', strokeWidth: 2, fill: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <h5 className="text-sm font-medium text-green-700 dark:text-green-300">Best Month</h5>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(Math.max(...processedData.map(d => d.pnl)))}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            {processedData.find(d => d.pnl === Math.max(...processedData.map(d => d.pnl)))?.month}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200/50 dark:border-red-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <h5 className="text-sm font-medium text-red-700 dark:text-red-300">Worst Month</h5>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(Math.min(...processedData.map(d => d.pnl)))}
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            {processedData.find(d => d.pnl === Math.min(...processedData.map(d => d.pnl)))?.month}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <h5 className="text-sm font-medium text-blue-700 dark:text-blue-300">Total P&L</h5>
          </div>
          <p className={`text-2xl font-bold ${processedData[processedData.length - 1]?.cumulativePnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatCurrency(processedData[processedData.length - 1]?.cumulativePnl || 0)}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            {processedData.length} months
          </p>
        </div>
      </div>
    </div>
  )
}
