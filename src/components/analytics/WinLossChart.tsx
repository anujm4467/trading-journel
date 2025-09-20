'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface WinLossChartProps {
  winningTrades: number
  losingTrades: number
}

export function WinLossChart({ winningTrades, losingTrades }: WinLossChartProps) {
  const totalTrades = winningTrades + losingTrades
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0
  const lossRate = totalTrades > 0 ? (losingTrades / totalTrades) * 100 : 0

  const data = [
    { name: 'Winning Trades', value: winRate, count: winningTrades, color: 'hsl(var(--profit))' },
    { name: 'Losing Trades', value: lossRate, count: losingTrades, color: 'hsl(var(--loss))' }
  ]
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-background p-3 shadow-lg">
                    <p className="font-medium">{data.name}</p>
                    <p className="text-sm">
                      <span className="font-medium">{data.value}%</span>
                      <span className="text-muted-foreground ml-1">({data.count} trades)</span>
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => {
              const data = entry.payload as { count?: number }
              return (
                <span style={{ color: entry.color }}>
                  {value} ({data?.count || 0} trades)
                </span>
              )
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
