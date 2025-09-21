// Trade Details Interface for comprehensive trade data display

export interface TradeDetails {
  // Basic Trade Information
  id: string
  tradeType: 'INTRADAY' | 'POSITIONAL'
  symbol: string
  instrument: 'EQUITY' | 'FUTURES' | 'OPTIONS'
  position: 'BUY' | 'SELL'
  quantity: number
  
  // Price Information
  entryPrice: number
  exitPrice?: number
  ltpPrice?: number // Last Traded Price for equity positions
  entryValue: number
  exitValue?: number
  turnover: number
  
  // P&L Information
  grossPnl?: number
  netPnl?: number
  totalCharges?: number
  percentageReturn?: number
  investedCapital?: number // For equity positions
  
  // Date Information
  entryDate: string
  exitDate?: string
  holdingDuration?: number // in minutes
  createdAt: string
  updatedAt: string
  
  // Risk Management
  stopLoss?: number
  target?: number
  riskAmount?: number
  rewardAmount?: number
  riskRewardRatio?: number
  confidenceLevel?: number // 1-10 scale
  
  // Psychology & Strategy
  emotionalState?: string
  marketCondition?: string
  planning?: string
  notes?: string
  
  // Brokerage Information
  brokerName?: string
  customBrokerage: boolean
  brokerageType?: string
  brokerageValue?: number
  
  // Metadata
  isDraft: boolean
  
  // Options-specific data
  optionsTrade?: {
    id: string
    optionType: 'CALL' | 'PUT'
    strikePrice: number
    expiryDate: string
    lotSize: number
    underlying: string
  }
  
  // Hedge position data
  hedgePosition?: {
    id: string
    optionType: 'CALL' | 'PUT'
    entryDate: string
    exitDate?: string
    entryPrice: number
    exitPrice?: number
    quantity: number
    entryValue: number
    exitValue?: number
    grossPnl?: number
    netPnl?: number
    totalCharges?: number
    percentageReturn?: number
    notes?: string
  }
  
  // Charges breakdown (array from database)
  charges?: Array<{
    id: string
    tradeId: string
    chargeType: 'BROKERAGE' | 'STT' | 'EXCHANGE' | 'SEBI' | 'STAMP_DUTY' | 'GST'
    rate: number
    baseAmount: number
    amount: number
    description?: string
    createdAt: string
  }> | {
    // Fallback object format for calculations
    brokerage: number
    stt: number
    exchange: number
    sebi: number
    stampDuty: number
    gst: number
    total: number
  }
  
  // Tags
  strategyTags?: Array<{
    id: string
    name: string
    color: string
    description?: string
  }>
  
  emotionalTags?: Array<{
    id: string
    name: string
    color: string
    description?: string
  }>
  
  marketTags?: Array<{
    id: string
    name: string
    color: string
    description?: string
  }>
  
  // Attachments
  attachments?: Array<{
    id: string
    fileName: string
    filePath: string
    fileSize: number
    fileType: string
    createdAt: string
  }>
}

// Simplified trade interface for table display
export interface TradeSummary {
  id: string
  symbol: string
  instrument: 'EQUITY' | 'FUTURES' | 'OPTIONS'
  position: 'BUY' | 'SELL'
  quantity: number
  entryPrice: number
  exitPrice?: number
  entryDate: string
  exitDate?: string
  grossPnl?: number
  netPnl?: number
  percentageReturn?: number
  totalCharges?: number
  isOpen: boolean
  strategy?: string
  emotionalState?: string
  marketCondition?: string
  stopLoss?: number
  target?: number
  riskRewardRatio?: number
}

// Trade form data interface
export interface TradeFormData {
  // Basic Information
  tradeType: 'INTRADAY' | 'POSITIONAL'
  symbol: string
  instrument: 'EQUITY' | 'FUTURES' | 'OPTIONS'
  position: 'BUY' | 'SELL'
  quantity: number
  entryPrice: number
  exitPrice?: number
  ltpPrice?: number // Last Traded Price for equity positions
  entryDate: Date
  exitDate?: Date
  
  // Risk Management
  stopLoss?: number
  target?: number
  confidenceLevel?: number
  
  // Psychology & Strategy
  emotionalState?: string
  marketCondition?: string
  planning?: string
  notes?: string
  
  // Brokerage
  brokerName?: string
  customBrokerage: boolean
  brokerageType?: string
  brokerageValue?: number
  
  // Calculated charges
  charges?: {
    brokerage: number
    stt: number
    exchange: number
    sebi: number
    stampDuty: number
    gst: number
    total: number
  }
  
  // Tags
  strategyTagIds: string[]
  emotionalTagIds: string[]
  marketTagIds: string[]
  
  // Options specific
  optionType?: 'CALL' | 'PUT'
  strikePrice?: number
  expiryDate?: Date
  lotSize?: number
  underlying?: string
  
  // Hedge position
  hasHedgePosition?: boolean
  hedgeOptionType?: 'CALL' | 'PUT'
  hedgeEntryDate?: Date
  hedgeExitDate?: Date
  hedgeEntryPrice?: number
  hedgeExitPrice?: number
  hedgeQuantity?: number
  
  // Additional fields for compatibility
  side?: 'BUY' | 'SELL'
  instrumentType?: 'EQUITY' | 'FUTURES' | 'OPTIONS'
  isDraft?: boolean
}

// Trade calculation results interface
export interface TradeCalculations {
  entryValue: number
  exitValue: number
  turnover: number
  grossPnl: number
  netPnl: number
  totalCharges: number
  percentageReturn: number
  investedCapital: number // For equity positions
  charges: {
    brokerage: number
    stt: number
    exchange: number
    sebi: number
    stampDuty: number
    gst: number
    total: number
  }
}

// Trade statistics interface
export interface TradeStatistics {
  totalTrades: number
  closedTrades: number
  openTrades: number
  totalNetPnl: number
  totalGrossPnl: number
  totalCharges: number
  winningTrades: number
  losingTrades: number
  winRate: number
  averageTrade: number
  bestTrade: number
  worstTrade: number
  averageWin: number
  averageLoss: number
  profitFactor: number
  sharpeRatio?: number
  maxDrawdown?: number
  currentDrawdown?: number
  recoveryFactor?: number
}

// Trade filter interface
export interface TradeFilters {
  page?: number
  limit?: number
  search?: string
  instrumentType?: 'EQUITY' | 'FUTURES' | 'OPTIONS'
  position?: 'BUY' | 'SELL'
  strategy?: string
  emotionalState?: string
  marketCondition?: string
  dateFrom?: string
  dateTo?: string
  minPnl?: number
  maxPnl?: number
  isOpen?: boolean
  isDraft?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Trade export interface
export interface TradeExportOptions {
  format: 'csv' | 'excel' | 'pdf'
  dateFrom?: string
  dateTo?: string
  includeCharges?: boolean
  includeTags?: boolean
  includeNotes?: boolean
  groupBy?: 'date' | 'symbol' | 'strategy' | 'none'
}

// Trade analytics interface
export interface TradeAnalytics {
  performance: {
    totalReturn: number
    annualizedReturn: number
    volatility: number
    sharpeRatio: number
    maxDrawdown: number
    calmarRatio: number
  }
  distribution: {
    monthlyReturns: Array<{ month: string; return: number }>
    dailyReturns: Array<{ date: string; return: number }>
    pnlDistribution: Array<{ range: string; count: number }>
  }
  patterns: {
    bestPerformingSymbols: Array<{ symbol: string; pnl: number; trades: number }>
    worstPerformingSymbols: Array<{ symbol: string; pnl: number; trades: number }>
    bestStrategies: Array<{ strategy: string; pnl: number; trades: number }>
    worstStrategies: Array<{ strategy: string; pnl: number; trades: number }>
    emotionalStatePerformance: Array<{ state: string; pnl: number; trades: number }>
    marketConditionPerformance: Array<{ condition: string; pnl: number; trades: number }>
  }
  risk: {
    valueAtRisk: number
    expectedShortfall: number
    beta: number
    correlation: number
  }
  time: {
    bestMonths: Array<{ month: string; return: number }>
    worstMonths: Array<{ month: string; return: number }>
    bestDays: Array<{ day: string; return: number }>
    worstDays: Array<{ day: string; return: number }>
    averageHoldingPeriod: number
    mostActiveHours: Array<{ hour: number; trades: number }>
  }
}
