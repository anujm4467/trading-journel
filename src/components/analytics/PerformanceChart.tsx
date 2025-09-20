'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '@/utils/calculations'

interface PerformanceChartProps {
  data: Array<{
    month: string
    pnl: number
    trades: number
  }>
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--profit))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--profit))" stopOpacity={0.1}/>
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
                return (
                  <div className="rounded-lg border bg-background p-3 shadow-lg">
                    <p className="font-medium">{label}</p>
                    <p className="text-sm">
                      <span className="text-profit">P&L: </span>
                      <span className="font-medium">
                        {formatCurrency(payload[0].value as number)}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Trades: </span>
                      <span className="font-medium">
                        {payload[0].payload.trades}
                      </span>
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="pnl"
            stroke="hsl(var(--profit))"
            fill="url(#colorPnl)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
