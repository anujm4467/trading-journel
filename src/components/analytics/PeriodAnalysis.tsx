'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  Clock,
  Target,
  Award,
  AlertTriangle
} from 'lucide-react'

interface PeriodData {
  period: string
  pnl: number
  trades: number
  winRate: number
  date: string
}

interface PeriodAnalysisProps {
  timeframe: string
  data: {
    mostProfitable: PeriodData | null
    mostLosing: PeriodData | null
    totalTrades: number
    totalPnl: number
  }
}

export function PeriodAnalysis({ timeframe, data }: PeriodAnalysisProps) {
  const formatCurrency = (value: number) => {
    return `₹${Math.round(value).toLocaleString()}`
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case 'week':
        return 'Day'
      case 'month':
        return 'Week'
      case 'quarter':
      case 'year':
        return 'Month'
      default:
        return 'Period'
    }
  }

  const getTimeframeIcon = () => {
    switch (timeframe) {
      case 'week':
        return Calendar
      case 'month':
        return Clock
      case 'quarter':
      case 'year':
        return Target
      default:
        return Award
    }
  }

  const TimeframeIcon = getTimeframeIcon()

  if (!data.mostProfitable && !data.mostLosing) {
    return (
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TimeframeIcon className="h-5 w-5 text-blue-600" />
            {getTimeframeLabel()} Analysis
          </CardTitle>
          <CardDescription>
            No data available for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No trading data found for this timeframe</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TimeframeIcon className="h-5 w-5 text-blue-600" />
          {getTimeframeLabel()} Analysis
        </CardTitle>
        <CardDescription>
          Best and worst performing {getTimeframeLabel().toLowerCase()}s in the selected period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Most Profitable Period */}
          {data.mostProfitable && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">
                  Most Profitable {getTimeframeLabel()}
                </h3>
              </div>
              
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-green-800 dark:text-green-200">
                        {data.mostProfitable.period}
                      </span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        {data.mostProfitable.trades} trades
                      </Badge>
                    </div>
                    
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      +{formatCurrency(data.mostProfitable.pnl)}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-700 dark:text-green-300">
                        Win Rate: {formatPercentage(data.mostProfitable.winRate)}
                      </span>
                      <span className="text-green-600 dark:text-green-400">
                        {data.mostProfitable.date}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Most Losing Period */}
          {data.mostLosing && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">
                  Most Losing {getTimeframeLabel()}
                </h3>
              </div>
              
              <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200/50 dark:border-red-700/50">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-red-800 dark:text-red-200">
                        {data.mostLosing.period}
                      </span>
                      <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                        {data.mostLosing.trades} trades
                      </Badge>
                    </div>
                    
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(data.mostLosing.pnl)}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-red-700 dark:text-red-300">
                        Win Rate: {formatPercentage(data.mostLosing.winRate)}
                      </span>
                      <span className="text-red-600 dark:text-red-400">
                        {data.mostLosing.date}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {data.totalTrades}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Trades
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                data.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.totalPnl >= 0 ? '+' : ''}{formatCurrency(data.totalPnl)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total P&L
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
