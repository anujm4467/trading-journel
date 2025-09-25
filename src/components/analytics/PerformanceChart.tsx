'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, ComposedChart, Line, Bar } from 'recharts'
import { formatCurrency } from '@/utils/calculations'

interface PerformanceChartProps {
  data: Array<{
    month: string
    pnl: number
    trades: number
  }>
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  // Process data to add color information
  const processedData = data.map(item => ({
    ...item,
    isProfit: item.pnl >= 0,
    color: item.pnl >= 0 ? '#10b981' : '#ef4444', // green-500 : red-500
    fillColor: item.pnl >= 0 ? '#10b981' : '#ef4444'
  }))

  // Calculate cumulative P&L for better visualization
  let cumulativePnl = 0
  const cumulativeData = processedData.map(item => {
    cumulativePnl += item.pnl
    return {
      ...item,
      cumulativePnl,
      cumulativeColor: cumulativePnl >= 0 ? '#10b981' : '#ef4444'
    }
  })

  return (
    <div className="h-[400px] space-y-4">
      {/* Monthly P&L Bar Chart */}
      <div className="h-[200px]">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monthly P&L</h4>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              className="text-xs"
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
                    <div className="rounded-lg border bg-white dark:bg-gray-800 p-3 shadow-lg">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${data.isProfit ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="text-sm font-medium">
                            P&L: <span className={data.isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                              {formatCurrency(data.pnl)}
                            </span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Trades: <span className="font-medium">{data.trades}</span>
                        </p>
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
              radius={[4, 4, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Cumulative P&L Line Chart */}
      <div className="h-[200px]">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cumulative P&L</h4>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={cumulativeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              className="text-xs"
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
                    <div className="rounded-lg border bg-white dark:bg-gray-800 p-3 shadow-lg">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                          <span className="text-sm font-medium">
                            Cumulative P&L: <span className={data.cumulativePnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                              {formatCurrency(data.cumulativePnl)}
                            </span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Monthly P&L: <span className={data.isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {formatCurrency(data.pnl)}
                          </span>
                        </p>
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
              stroke="#3b82f6"
              fill="url(#cumulativeGradient)"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
