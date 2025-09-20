'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Target,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/utils/calculations'
import { useCapital } from '@/hooks/useCapital'

// Mock data - in real app, this would come from API
const mockPositions = [
  {
    id: '1',
    symbol: 'RELIANCE',
    instrument: 'EQUITY',
    position: 'LONG',
    quantity: 100,
    avgEntryPrice: 2450.50,
    currentPrice: 2485.75,
    unrealizedPnl: 3525,
    unrealizedPnlPercent: 1.44,
    daysHeld: 3,
    stopLoss: 2400,
    target: 2550,
    riskAmount: 5050,
    isActive: true
  },
  {
    id: '2',
    symbol: 'NIFTY',
    instrument: 'FUTURES',
    position: 'SHORT',
    quantity: 50,
    avgEntryPrice: 19850,
    currentPrice: 19920,
    unrealizedPnl: -3500,
    unrealizedPnlPercent: -0.35,
    daysHeld: 1,
    stopLoss: 20000,
    target: 19600,
    riskAmount: 7500,
    isActive: true
  },
  {
    id: '3',
    symbol: 'TCS',
    instrument: 'EQUITY',
    position: 'LONG',
    quantity: 25,
    avgEntryPrice: 3850,
    currentPrice: 3820,
    unrealizedPnl: -750,
    unrealizedPnlPercent: -0.78,
    daysHeld: 5,
    stopLoss: 3750,
    target: 4000,
    riskAmount: 2500,
    isActive: true
  }
]

const mockSummary = {
  totalValue: 1250000,
  totalPnl: -725,
  totalPnlPercent: -0.06,
  totalInvested: 1250725,
  dayChange: 1250,
  dayChangePercent: 0.10,
  activePositions: 3,
  totalRisk: 15050
}

export function PortfolioOverview() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { allocation } = useCapital()

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate API call
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 border border-white/20 shadow-xl">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Portfolio Overview
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Track your current positions and portfolio performance
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Value Card */}
        <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Value</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800/50">
              <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {formatCurrency(mockSummary.totalValue)}
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Portfolio value
            </p>
          </CardContent>
        </Card>

        {/* Unrealized P&L Card */}
        <Card className={`backdrop-blur-sm border shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${
          mockSummary.totalPnl >= 0 
            ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50'
            : 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200/50 dark:border-red-700/50'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${
              mockSummary.totalPnl >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
            }`}>
              Unrealized P&L
            </CardTitle>
            <div className={`p-2 rounded-lg ${
              mockSummary.totalPnl >= 0 ? 'bg-green-100 dark:bg-green-800/50' : 'bg-red-100 dark:bg-red-800/50'
            }`}>
              {mockSummary.totalPnl >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold mb-2 ${
              mockSummary.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {mockSummary.totalPnl >= 0 ? '+' : ''}{formatCurrency(mockSummary.totalPnl)}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold ${
                mockSummary.totalPnlPercent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercentage(mockSummary.totalPnlPercent)}
              </span>
              {mockSummary.totalPnl >= 0 ? (
                <span className="text-green-500 text-lg">📈</span>
              ) : (
                <span className="text-red-500 text-lg">📉</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Day Change Card */}
        <Card className={`backdrop-blur-sm border shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${
          mockSummary.dayChange >= 0 
            ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50'
            : 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200/50 dark:border-red-700/50'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${
              mockSummary.dayChange >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
            }`}>
              Day Change
            </CardTitle>
            <div className={`p-2 rounded-lg ${
              mockSummary.dayChange >= 0 ? 'bg-green-100 dark:bg-green-800/50' : 'bg-red-100 dark:bg-red-800/50'
            }`}>
              {mockSummary.dayChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold mb-2 ${
              mockSummary.dayChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {mockSummary.dayChange >= 0 ? '+' : ''}{formatCurrency(mockSummary.dayChange)}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold ${
                mockSummary.dayChangePercent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercentage(mockSummary.dayChangePercent)}
              </span>
              {mockSummary.dayChange >= 0 ? (
                <span className="text-green-500 text-lg">📈</span>
              ) : (
                <span className="text-red-500 text-lg">📉</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Positions Card */}
        <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200/50 dark:border-purple-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Active Positions</CardTitle>
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-800/50">
              <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-2">{mockSummary.activePositions}</div>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              Open positions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Capital Allocation Section */}
      {allocation && (
        <Card className="backdrop-blur-sm bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-200/50 dark:border-indigo-700/50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-indigo-700 dark:text-indigo-300">
              <span>💰</span>
              Capital Allocation
            </CardTitle>
            <CardDescription className="text-lg text-indigo-600 dark:text-indigo-400">
              Your trading capital distribution and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Total Capital */}
              <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-indigo-200/50 dark:border-indigo-700/50">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {formatCurrency(allocation.totalCapital)}
                </div>
                <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-2">Total Capital</div>
                <div className={`text-lg font-bold ${allocation.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {allocation.totalPnl >= 0 ? '+' : ''}{formatCurrency(allocation.totalPnl)} ({formatPercentage(allocation.totalReturn)})
                </div>
              </div>

              {/* Equity Capital */}
              <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatCurrency(allocation.equityCapital)}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">Equity Capital</div>
                <div className={`text-lg font-bold ${allocation.equityPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {allocation.equityPnl >= 0 ? '+' : ''}{formatCurrency(allocation.equityPnl)} ({formatPercentage(allocation.equityReturn)})
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Available: {formatCurrency(allocation.availableEquity)}
                </div>
              </div>

              {/* F&O Capital */}
              <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {formatCurrency(allocation.fnoCapital)}
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-2">F&O Capital</div>
                <div className={`text-lg font-bold ${allocation.fnoPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {allocation.fnoPnl >= 0 ? '+' : ''}{formatCurrency(allocation.fnoPnl)} ({formatPercentage(allocation.fnoReturn)})
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Available: {formatCurrency(allocation.availableFno)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Alert */}
      {mockSummary.totalRisk > 10000 && (
        <Card className="backdrop-blur-sm bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200/50 dark:border-amber-700/50 shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-800/50">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg text-amber-700 dark:text-amber-300 mb-2">
                  ⚠️ High Risk Alert
                </p>
                <p className="text-amber-700 dark:text-amber-300">
                  Your total risk exposure is <span className="font-bold">{formatCurrency(mockSummary.totalRisk)}</span>. 
                  Consider reducing position sizes or tightening stop losses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Positions Table */}
      <Tabs defaultValue="positions" className="space-y-6">
        <TabsList className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-lg">
          <TabsTrigger value="positions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
            📊 Current Positions
          </TabsTrigger>
          <TabsTrigger value="allocation" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
            🥧 Allocation
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-500 data-[state=active]:text-white">
            📈 Position History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-4">
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <span>📊</span>
                Current Positions
              </CardTitle>
              <CardDescription className="text-lg">
                Your active trading positions and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                      <TableHead className="font-bold text-gray-700 dark:text-gray-300">Symbol</TableHead>
                      <TableHead className="font-bold text-gray-700 dark:text-gray-300">Type</TableHead>
                      <TableHead className="font-bold text-gray-700 dark:text-gray-300">Position</TableHead>
                      <TableHead className="text-right font-bold text-gray-700 dark:text-gray-300">Qty</TableHead>
                      <TableHead className="text-right font-bold text-gray-700 dark:text-gray-300">Avg Entry</TableHead>
                      <TableHead className="text-right font-bold text-gray-700 dark:text-gray-300">Current</TableHead>
                      <TableHead className="text-right font-bold text-gray-700 dark:text-gray-300">P&L</TableHead>
                      <TableHead className="text-right font-bold text-gray-700 dark:text-gray-300">%</TableHead>
                      <TableHead className="font-bold text-gray-700 dark:text-gray-300">Days</TableHead>
                      <TableHead className="text-right font-bold text-gray-700 dark:text-gray-300">Risk</TableHead>
                      <TableHead className="font-bold text-gray-700 dark:text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPositions.map((position, index) => (
                      <TableRow 
                        key={position.id} 
                        className={`hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors ${
                          index % 2 === 0 ? 'bg-white/50 dark:bg-gray-800/50' : 'bg-gray-50/30 dark:bg-gray-700/30'
                        }`}
                      >
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-lg">{position.symbol}</span>
                            <Badge 
                              variant="outline"
                              className={`font-semibold ${
                                position.instrument === 'EQUITY' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700' :
                                position.instrument === 'FUTURES' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700' :
                                'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700'
                              }`}
                            >
                              {position.instrument === 'EQUITY' ? 'EQ' :
                               position.instrument === 'FUTURES' ? 'FUT' : 'OPT'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-bold text-lg ${
                            position.position === 'LONG' || position.position === 'BUY' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {position.position}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            {position.quantity} shares
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            {formatCurrency(position.avgEntryPrice)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            {formatCurrency(position.currentPrice)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className={`font-bold text-lg ${
                            position.unrealizedPnl >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {position.unrealizedPnl >= 0 ? '+' : ''}{formatCurrency(position.unrealizedPnl)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <span className={`text-sm font-bold ${
                              position.unrealizedPnlPercent >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatPercentage(position.unrealizedPnlPercent)}
                            </span>
                            {position.unrealizedPnlPercent >= 0 ? (
                              <span className="text-green-500">📈</span>
                            ) : (
                              <span className="text-red-500">📉</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            {position.daysHeld} days
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            {formatCurrency(position.riskAmount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              Close
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>🥧</span>
                  Asset Allocation
                </CardTitle>
                <CardDescription className="text-lg">
                  Distribution of your portfolio by asset type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-700/50">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-green-600 dark:text-green-400 font-semibold text-lg">Allocation chart coming soon</p>
                    <p className="text-green-500 dark:text-green-500 text-sm mt-2">Interactive pie chart with portfolio breakdown</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>⚖️</span>
                  Position Sizes
                </CardTitle>
                <CardDescription className="text-lg">
                  Risk distribution across your positions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockPositions.map((position, index) => (
                    <div key={position.id} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{position.symbol}</span>
                          <Badge 
                            variant="outline"
                            className={`${
                              position.instrument === 'EQUITY' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                              position.instrument === 'FUTURES' ? 'bg-green-100 text-green-700 border-green-200' :
                              'bg-purple-100 text-purple-700 border-purple-200'
                            }`}
                          >
                            {position.instrument === 'EQUITY' ? 'EQ' :
                             position.instrument === 'FUTURES' ? 'FUT' : 'OPT'}
                          </Badge>
                        </div>
                        <span className="font-bold text-lg text-gray-700 dark:text-gray-300">
                          {formatCurrency(position.riskAmount)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            index === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                            index === 1 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                            'bg-gradient-to-r from-purple-500 to-purple-600'
                          }`}
                          style={{ 
                            width: `${(position.riskAmount / mockSummary.totalRisk) * 100}%` 
                          }}
                        />
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {((position.riskAmount / mockSummary.totalRisk) * 100).toFixed(1)}% of total risk
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <span>📈</span>
                Position History
              </CardTitle>
              <CardDescription className="text-lg">
                Historical record of all your positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[450px] flex items-center justify-center bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                <div className="text-center">
                  <div className="text-6xl mb-4">📈</div>
                  <p className="text-purple-600 dark:text-purple-400 font-semibold text-lg">Position history coming soon</p>
                  <p className="text-purple-500 dark:text-purple-500 text-sm mt-2">Complete trading history with performance analytics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
