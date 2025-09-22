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
    { name: 'Winning Trades', value: winRate, count: winningTrades, color: 'var(--profit-hex)' },
    { name: 'Losing Trades', value: lossRate, count: losingTrades, color: 'var(--loss-hex)' }
  ]
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                stroke={entry.color}
                strokeWidth={2}
                className="drop-shadow-lg"
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-xl border bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-4 shadow-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: data.color }}
                      />
                      <p className="font-bold text-lg">{data.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-bold text-xl" style={{ color: data.color }}>
                          {data.value.toFixed(1)}%
                        </span>
                        <span className="text-muted-foreground ml-2">
                          ({data.count} trades)
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {data.count === 1 ? 'trade' : 'trades'}
                      </p>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={50}
            iconType="circle"
            formatter={(value, entry) => {
              const data = entry.payload as { count?: number }
              return (
                <div className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full shadow-sm" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {value}
                  </span>
                  <span className="text-muted-foreground">
                    ({data?.count || 0} trades)
                  </span>
                </div>
              )
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
