'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/utils/calculations'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { TrendingDown, Shield, AlertTriangle, Target, DollarSign, BarChart3 } from 'lucide-react'
import { mockTradingData } from '@/lib/mockData'

interface RiskMetricsProps {
  maxDrawdown: number
  sharpeRatio: number
  avgRiskReward: number
  totalCharges: number
}

// Rich mock data for risk analysis
const mockRiskData = {
  drawdownHistory: [
    { month: 'Jan', drawdown: 0, portfolio: 100000 },
    { month: 'Feb', drawdown: -2500, portfolio: 97500 },
    { month: 'Mar', drawdown: -1200, portfolio: 98800 },
    { month: 'Apr', drawdown: -4500, portfolio: 95500 },
    { month: 'May', drawdown: -18750, portfolio: 81250 },
    { month: 'Jun', drawdown: -8900, portfolio: 91100 },
    { month: 'Jul', drawdown: -3200, portfolio: 96800 },
    { month: 'Aug', drawdown: -1200, portfolio: 98800 },
    { month: 'Sep', drawdown: 0, portfolio: 100000 },
    { month: 'Oct', drawdown: -2100, portfolio: 97900 },
    { month: 'Nov', drawdown: -800, portfolio: 99200 },
    { month: 'Dec', drawdown: 0, portfolio: 100000 }
  ],
  riskDistribution: [
    { name: 'Low Risk', value: 45, trades: 562, color: '#10b981' },
    { name: 'Medium Risk', value: 35, trades: 437, color: '#f59e0b' },
    { name: 'High Risk', value: 20, trades: 248, color: '#ef4444' }
  ],
  volatilityData: [
    { month: 'Jan', volatility: 12.5, returns: 8.2 },
    { month: 'Feb', volatility: 15.3, returns: -2.5 },
    { month: 'Mar', volatility: 11.8, returns: 1.3 },
    { month: 'Apr', volatility: 18.7, returns: -4.5 },
    { month: 'May', volatility: 22.1, returns: -18.8 },
    { month: 'Jun', volatility: 16.4, returns: 12.1 },
    { month: 'Jul', volatility: 13.2, returns: 6.2 },
    { month: 'Aug', volatility: 10.9, returns: 2.1 },
    { month: 'Sep', volatility: 9.8, returns: 1.2 },
    { month: 'Oct', volatility: 14.6, returns: -2.1 },
    { month: 'Nov', volatility: 11.3, returns: 1.3 },
    { month: 'Dec', volatility: 8.7, returns: 0.8 }
  ],
  consecutiveLosses: [
    { period: 'Week 1', losses: 3, amount: -4500 },
    { period: 'Week 2', losses: 2, amount: -2100 },
    { period: 'Week 3', losses: 5, amount: -8900 },
    { period: 'Week 4', losses: 1, amount: -1200 },
    { period: 'Week 5', losses: 2, amount: -1800 },
    { period: 'Week 6', losses: 4, amount: -3200 }
  ]
}

export function RiskMetrics({ 
  maxDrawdown, 
  sharpeRatio, 
  avgRiskReward, 
  totalCharges 
}: RiskMetricsProps) {
  const riskScore = Math.min(100, Math.max(0, 100 - (Math.abs(maxDrawdown) / 1000) + (sharpeRatio * 20)))
  
  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Shield className="h-5 w-5" />
              Risk Score
            </CardTitle>
            <CardDescription>Overall risk assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-blue-600">
                  {Math.round(riskScore)}/100
                </span>
                <Badge 
                  variant={riskScore >= 80 ? 'default' : riskScore >= 60 ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {riskScore >= 80 ? 'Excellent' : riskScore >= 60 ? 'Good' : 'Needs Improvement'}
                </Badge>
              </div>
              <Progress value={riskScore} className="h-3 bg-blue-100 dark:bg-blue-900/30" />
              <p className="text-xs text-blue-600 font-medium">
                {riskScore >= 80 ? 'Low Risk Profile' : riskScore >= 60 ? 'Moderate Risk' : 'High Risk Alert'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200/50 dark:border-red-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-red-700 dark:text-red-300">
              <TrendingDown className="h-5 w-5" />
              Max Drawdown
            </CardTitle>
            <CardDescription>Largest peak-to-trough decline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 mb-2">
              ₹{Math.abs(maxDrawdown).toLocaleString()}
            </div>
            <p className="text-sm text-red-600 font-medium">
              {((Math.abs(maxDrawdown) / 100000) * 100).toFixed(1)}% of capital
            </p>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Recovery time: 3 months
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-300">
              <Target className="h-5 w-5" />
              Sharpe Ratio
            </CardTitle>
            <CardDescription>Risk-adjusted returns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {sharpeRatio.toFixed(2)}
            </div>
            <p className="text-sm text-green-600 font-medium">
              {sharpeRatio >= 1 ? 'Excellent' : sharpeRatio >= 0.5 ? 'Good' : 'Needs Improvement'}
            </p>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Above market average (0.85)
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 dark:border-purple-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <BarChart3 className="h-5 w-5" />
              Avg Risk:Reward
            </CardTitle>
            <CardDescription>Average risk-reward ratio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              1:{avgRiskReward.toFixed(1)}
            </div>
            <p className="text-sm text-purple-600 font-medium">
              {avgRiskReward >= 2 ? 'Excellent' : avgRiskReward >= 1.5 ? 'Good' : 'Needs Improvement'}
            </p>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Target: 1:2 or better
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Analysis Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Drawdown Analysis
            </CardTitle>
            <CardDescription>
              Historical drawdown periods and recovery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTradingData.riskData.drawdownHistory}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'drawdown' ? `₹${Math.abs(Number(value)).toLocaleString()}` : `₹${Number(value).toLocaleString()}`,
                      name === 'drawdown' ? 'Drawdown' : 'Portfolio Value'
                    ]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="drawdown" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Risk Distribution
            </CardTitle>
            <CardDescription>
              Distribution of trade risks and outcomes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockTradingData.riskData.riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockRiskData.riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value}% (${props.payload.trades} trades)`,
                      props.payload.name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-4">
                    {mockTradingData.riskData.riskDistribution.map((item, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Risk Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Volatility Analysis
            </CardTitle>
            <CardDescription>
              Monthly volatility vs returns correlation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTradingData.riskData.volatilityData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value}%`,
                      name === 'volatility' ? 'Volatility' : 'Returns'
                    ]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="volatility" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="returns" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Consecutive Losses
            </CardTitle>
            <CardDescription>
              Weekly consecutive loss patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockTradingData.riskData.consecutiveLosses}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'losses' ? `${value} trades` : `₹${Math.abs(Number(value)).toLocaleString()}`,
                      name === 'losses' ? 'Consecutive Losses' : 'Loss Amount'
                    ]}
                    labelFormatter={(label) => `Period: ${label}`}
                  />
                  <Bar dataKey="losses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Analysis */}
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Cost Analysis
          </CardTitle>
          <CardDescription>
            Breakdown of trading costs and their impact on performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-lg font-medium text-green-700 dark:text-green-300">Total Charges Paid</span>
              <span className="text-2xl font-bold text-green-600">{formatCurrency(totalCharges)}</span>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Charge Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <span className="text-sm font-medium">Brokerage</span>
                    <span className="font-bold text-blue-600">{formatCurrency(totalCharges * 0.4)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <span className="text-sm font-medium">STT</span>
                    <span className="font-bold text-purple-600">{formatCurrency(totalCharges * 0.3)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                    <span className="text-sm font-medium">Exchange Charges</span>
                    <span className="font-bold text-orange-600">{formatCurrency(totalCharges * 0.2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900/20 rounded">
                    <span className="text-sm font-medium">Other Charges</span>
                    <span className="font-bold text-gray-600">{formatCurrency(totalCharges * 0.1)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Impact Analysis</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <span className="text-sm font-medium">Charges as % of P&L</span>
                    <span className="font-bold text-red-600">
                      {((totalCharges / 125670) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <span className="text-sm font-medium">Cost per Trade</span>
                    <span className="font-bold text-yellow-600">
                      ₹{Math.round(totalCharges / 1247).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <span className="text-sm font-medium">Net P&L After Costs</span>
                    <span className="font-bold text-green-600">
                      ₹{(125670).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Recommendations */}
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Risk Management Recommendations
          </CardTitle>
          <CardDescription>
            AI-powered suggestions to improve your risk management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskScore < 60 && (
              <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200/50 dark:border-orange-700/50">
                <div className="text-orange-600 text-2xl">⚠️</div>
                <div className="flex-1">
                  <p className="font-semibold text-orange-700 dark:text-orange-300 text-lg">High Drawdown Risk</p>
                  <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                    Your maximum drawdown of ₹{Math.abs(maxDrawdown).toLocaleString()} represents a significant risk. Consider reducing position sizes and implementing stricter stop losses.
                  </p>
                  <div className="mt-2 text-xs text-orange-500">
                    💡 Try reducing position size by 25% and setting stop losses at 1% of capital
                  </div>
                </div>
              </div>
            )}
            
            {avgRiskReward < 1.5 && (
              <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/50">
                <div className="text-blue-600 text-2xl">💡</div>
                <div className="flex-1">
                  <p className="font-semibold text-blue-700 dark:text-blue-300 text-lg">Improve Risk:Reward</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    Your current risk-reward ratio of 1:{avgRiskReward.toFixed(1)} could be improved. Focus on trades with better risk-reward ratios.
                  </p>
                  <div className="mt-2 text-xs text-blue-500">
                    🎯 Target: 1:2 or better for consistent profitability
                  </div>
                </div>
              </div>
            )}

            {sharpeRatio < 1 && (
              <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50">
                <div className="text-green-600 text-2xl">📈</div>
                <div className="flex-1">
                  <p className="font-semibold text-green-700 dark:text-green-300 text-lg">Enhance Risk-Adjusted Returns</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Your Sharpe ratio of {sharpeRatio.toFixed(2)} indicates room for improvement in risk-adjusted returns.
                  </p>
                  <div className="mt-2 text-xs text-green-500">
                    🔧 Focus on consistency and reducing volatility in your trading approach
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-700/50">
                <div className="text-purple-600 text-2xl">🎯</div>
                <div className="flex-1">
                  <p className="font-semibold text-purple-700 dark:text-purple-300 text-lg">Position Sizing Rules</p>
                  <div className="text-sm text-purple-600 dark:text-purple-400 mt-1 space-y-1">
                    <p>• Never risk more than 2% of capital per trade</p>
                    <p>• Use position sizing based on stop loss distance</p>
                    <p>• Maintain maximum 6% total portfolio risk</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200/50 dark:border-cyan-700/50">
                <div className="text-cyan-600 text-2xl">📊</div>
                <div className="flex-1">
                  <p className="font-semibold text-cyan-700 dark:text-cyan-300 text-lg">Monitoring & Analysis</p>
                  <div className="text-sm text-cyan-600 dark:text-cyan-400 mt-1 space-y-1">
                    <p>• Review risk metrics weekly</p>
                    <p>• Track drawdown recovery time</p>
                    <p>• Adjust strategy based on performance</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 border border-gray-200/50 dark:border-gray-700/50">
              <div className="text-gray-600 text-2xl">🚀</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-700 dark:text-gray-300 text-lg">Advanced Risk Management</p>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                  <p>• Implement correlation analysis between positions</p>
                  <p>• Use portfolio heat maps to identify concentration risk</p>
                  <p>• Consider hedging strategies for large positions</p>
                  <p>• Regular stress testing of your portfolio</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
