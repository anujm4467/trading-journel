// Shared mock data for the trading journal application
export const mockTradingData = {
  overview: {
    totalTrades: 1247,
    winningTrades: 854,
    losingTrades: 393,
    winRate: 68.5,
    totalGrossPnl: 189500,
    totalCharges: 63830,
    totalNetPnl: 125670,
    averageWin: 2218,
    averageLoss: -1625,
    profitFactor: 2.34
  },
  strategyPerformance: [
    { strategy: 'Breakout', trades: 67, winRate: 72, pnl: 89200, avgPnl: 1331 },
    { strategy: 'Momentum', trades: 56, winRate: 75, pnl: 76800, avgPnl: 1371 },
    { strategy: 'Swing', trades: 45, winRate: 64, pnl: 34600, avgPnl: 769 },
    { strategy: 'Scalping', trades: 89, winRate: 68, pnl: 45200, avgPnl: 508 },
    { strategy: 'Mean Reversion', trades: 34, winRate: 59, pnl: -8900, avgPnl: -262 }
  ],
  instrumentPerformance: [
    { instrument: 'Equity', trades: 125, pnl: 89400, winRate: 69 },
    { instrument: 'Futures', trades: 67, pnl: 67800, winRate: 65 },
    { instrument: 'Options', trades: 89, pnl: 58470, winRate: 71 }
  ],
  dailyPnlData: [
    { date: '2024-01-01', pnl: 12000 },
    { date: '2024-01-02', pnl: 18500 },
    { date: '2024-01-03', pnl: 22100 },
    { date: '2024-01-04', pnl: 18900 },
    { date: '2024-01-05', pnl: 25600 },
    { date: '2024-01-06', pnl: 31200 },
    { date: '2024-01-07', pnl: 28900 },
    { date: '2024-01-08', pnl: 35100 },
    { date: '2024-01-09', pnl: 42800 },
    { date: '2024-01-10', pnl: 38900 },
    { date: '2024-01-11', pnl: 45600 },
    { date: '2024-01-12', pnl: 125670 }
  ],
  monthlyPerformanceData: [
    { month: 'Jan', pnl: 12000, trades: 45 },
    { month: 'Feb', pnl: 18500, trades: 52 },
    { month: 'Mar', pnl: 22100, trades: 48 },
    { month: 'Apr', pnl: 18900, trades: 41 },
    { month: 'May', pnl: 25600, trades: 58 },
    { month: 'Jun', pnl: 31200, trades: 62 },
    { month: 'Jul', pnl: 28900, trades: 55 },
    { month: 'Aug', pnl: 35100, trades: 68 },
    { month: 'Sep', pnl: 42800, trades: 72 },
    { month: 'Oct', pnl: 38900, trades: 65 },
    { month: 'Nov', pnl: 45600, trades: 78 },
    { month: 'Dec', pnl: 125670, trades: 1247 }
  ],
  weeklyPerformanceData: [
    { day: 'Mon', pnl: 5200, trades: 12 },
    { day: 'Tue', pnl: 6800, trades: 15 },
    { day: 'Wed', pnl: -2100, trades: 8 },
    { day: 'Thu', pnl: 8900, trades: 18 },
    { day: 'Fri', pnl: 4200, trades: 11 },
    { day: 'Sat', pnl: 0, trades: 0 },
    { day: 'Sun', pnl: 0, trades: 0 }
  ],
  strategyDistribution: [
    { name: 'Breakout', value: 35, pnl: 45600, color: '#10b981' },
    { name: 'Momentum', value: 28, pnl: 38900, color: '#3b82f6' },
    { name: 'Swing', value: 20, pnl: 22100, color: '#8b5cf6' },
    { name: 'Scalping', value: 17, pnl: 19070, color: '#f59e0b' }
  ],
  recentTrades: [
    { symbol: 'RELIANCE', pnl: 3525, type: 'profit', time: '2h ago' },
    { symbol: 'NIFTY', pnl: -1200, type: 'loss', time: '4h ago' },
    { symbol: 'TCS', pnl: 2100, type: 'profit', time: '6h ago' },
    { symbol: 'HDFC', pnl: 1800, type: 'profit', time: '8h ago' },
    { symbol: 'INFY', pnl: -800, type: 'loss', time: '1d ago' }
  ],
  timeAnalysis: {
    dayOfWeek: {
      'Monday': 5200,
      'Tuesday': 6800,
      'Wednesday': -2100,
      'Thursday': 8900,
      'Friday': 4200
    },
    timeOfDay: {
      'Pre-Market': 1200,
      'Market Open': 8900,
      'Mid-Day': 2100,
      'Market Close': 5600,
      'After Hours': 800
    }
  },
  riskData: {
    maxDrawdown: -12.5,
    sharpeRatio: 1.85,
    avgRiskReward: 1.42,
    drawdownHistory: [
      { date: '2024-01-01', drawdown: 0, portfolioValue: 100000 },
      { date: '2024-01-02', drawdown: -2.1, portfolioValue: 97900 },
      { date: '2024-01-03', drawdown: -1.8, portfolioValue: 98200 },
      { date: '2024-01-04', drawdown: -3.2, portfolioValue: 96800 },
      { date: '2024-01-05', drawdown: -1.5, portfolioValue: 98500 },
      { date: '2024-01-06', drawdown: 0.8, portfolioValue: 100800 },
      { date: '2024-01-07', drawdown: 2.1, portfolioValue: 102100 },
      { date: '2024-01-08', drawdown: 1.9, portfolioValue: 101900 },
      { date: '2024-01-09', drawdown: 3.5, portfolioValue: 103500 },
      { date: '2024-01-10', drawdown: 2.8, portfolioValue: 102800 },
      { date: '2024-01-11', drawdown: 4.2, portfolioValue: 104200 },
      { date: '2024-01-12', drawdown: 5.6, portfolioValue: 105600 }
    ],
    riskDistribution: [
      { name: 'Low Risk', value: 45, color: '#10b981' },
      { name: 'Medium Risk', value: 35, color: '#f59e0b' },
      { name: 'High Risk', value: 20, color: '#ef4444' }
    ],
    volatilityData: [
      { month: 'Jan', volatility: 2.1, returns: 1.2 },
      { month: 'Feb', volatility: 2.8, returns: 1.8 },
      { month: 'Mar', volatility: 3.2, returns: 2.2 },
      { month: 'Apr', volatility: 2.5, returns: 1.9 },
      { month: 'May', volatility: 3.1, returns: 2.6 },
      { month: 'Jun', volatility: 2.9, returns: 3.1 },
      { month: 'Jul', volatility: 3.5, returns: 2.9 },
      { month: 'Aug', volatility: 3.8, returns: 3.5 },
      { month: 'Sep', volatility: 4.2, returns: 4.3 },
      { month: 'Oct', volatility: 3.9, returns: 3.9 },
      { month: 'Nov', volatility: 4.1, returns: 4.6 },
      { month: 'Dec', volatility: 3.7, returns: 5.6 }
    ],
    consecutiveLosses: [
      { week: 'Week 1', losses: 2 },
      { week: 'Week 2', losses: 1 },
      { week: 'Week 3', losses: 3 },
      { week: 'Week 4', losses: 1 },
      { week: 'Week 5', losses: 2 },
      { week: 'Week 6', losses: 4 },
      { week: 'Week 7', losses: 1 },
      { week: 'Week 8', losses: 2 }
    ]
  }
}
