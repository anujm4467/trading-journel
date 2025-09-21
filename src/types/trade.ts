import { TradeType, PositionType, InstrumentType, OptionType, ChargeType, PoolType, TransactionType } from '@prisma/client'

// Core Trade Types
export interface Trade {
  id: string
  tradeType?: TradeType
  entryDate: Date | string
  entryPrice: number
  quantity: number
  position?: PositionType
  symbol: string
  instrument?: InstrumentType
  instrumentType?: 'EQUITY' | 'FUTURES' | 'OPTIONS'
  side?: 'BUY' | 'SELL'
  exitDate?: Date | string | null
  exitPrice?: number | null
  holdingDuration?: number | null
  entryValue?: number
  exitValue?: number | null
  turnover?: number
  grossPnl?: number | null
  netPnl?: number | null
  totalCharges?: number | null
  percentageReturn?: number | null
  stopLoss?: number | null
  target?: number | null
  riskAmount?: number | null
  rewardAmount?: number | null
  riskRewardRatio?: number | null
  confidenceLevel?: number | null
  confidence?: number
  emotionalState?: string | null
  marketCondition?: string | null
  planning?: string | null // Pre-trade planning notes
  
  // Psychology & Behavioral Analysis (Optional)
  followedRiskReward?: boolean | null
  followedIntradayHunter?: boolean | null
  overtrading?: boolean | null
  waitedForRetracement?: boolean | null
  hadPatienceWhileExiting?: boolean | null
  showedGreed?: boolean | null
  showedFear?: boolean | null
  tradedAgainstTrend?: boolean | null
  psychologyNotes?: string | null
  brokerName?: string | null
  customBrokerage?: boolean
  brokerageType?: string | null
  brokerageValue?: number | null
  notes?: string | null
  isDraft?: boolean
  strategy?: string
  createdAt: Date | string
  updatedAt: Date | string
  charges?: TradeCharge[] | {
    brokerage: number
    stt: number
    exchange: number
    sebi: number
    stampDuty: number
    gst: number
    total: number
  }
  strategyTags?: TradeStrategyTag[]
  emotionalTags?: TradeEmotionalTag[]
  marketTags?: TradeMarketTag[]
  attachments?: TradeAttachment[]
  optionsTrade?: OptionsTrade | null
  hedgePosition?: HedgePosition | null
  tags?: Array<{ id: string; name: string }>
}

export interface OptionsTrade {
  id: string
  tradeId: string
  optionType: OptionType
  strikePrice: number
  expiryDate: Date
  lotSize: number
  underlying: string
}

export interface HedgePosition {
  id: string
  tradeId: string
  position: PositionType
  entryDate: Date | string
  entryPrice: number
  quantity: number
  exitDate?: Date | string | null
  exitPrice?: number | null
  entryValue: number
  exitValue?: number | null
  grossPnl?: number | null
  netPnl?: number | null
  totalCharges?: number | null
  percentageReturn?: number | null
  notes?: string | null
  createdAt: Date | string
  updatedAt: Date | string
  charges?: HedgeCharge[]
}

export interface HedgeCharge {
  id: string
  hedgeId: string
  chargeType: ChargeType
  rate: number
  baseAmount: number
  amount: number
  description?: string | null
  createdAt: Date | string
}

export interface TradeCharge {
  id: string
  tradeId: string
  chargeType: ChargeType
  rate: number
  baseAmount: number
  amount: number
  description?: string | null
  createdAt: Date
}

export interface TradeStrategyTag {
  tradeId: string
  strategyTagId: string
  strategyTag: StrategyTag
}

export interface TradeEmotionalTag {
  tradeId: string
  emotionalTagId: string
  emotionalTag: EmotionalTag
}

export interface TradeMarketTag {
  tradeId: string
  marketTagId: string
  marketTag: MarketTag
}

export interface TradeAttachment {
  id: string
  tradeId: string
  fileName: string
  filePath: string
  fileSize: number
  fileType: string
  createdAt: Date
}

// Tag Types
export interface StrategyTag {
  id: string
  name: string
  color: string
  description?: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface EmotionalTag {
  id: string
  name: string
  color: string
  description?: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface MarketTag {
  id: string
  name: string
  color: string
  description?: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Position Types
export interface Position {
  id: string
  symbol: string
  instrument: InstrumentType
  position: PositionType
  quantity: number
  avgEntryPrice: number
  currentPrice?: number | null
  unrealizedPnl?: number | null
  unrealizedPnlPercent?: number | null
  daysHeld?: number | null
  stopLoss?: number | null
  target?: number | null
  riskAmount?: number | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Settings Types
export interface AppSettings {
  id: string
  defaultInstrument: InstrumentType
  defaultPosition: PositionType
  defaultLotSize?: number | null
  autoCalculateCharges: boolean
  requireStrategyTag: boolean
  currencySymbol: string
  decimalPlaces: number
  thousandsSeparator: string
  dateFormat: string
  timeFormat: string
  theme: string
  defaultPageSize: number
  denseMode: boolean
  zebraStriping: boolean
  stickyHeaders: boolean
  autoRefresh: boolean
  defaultExportFormat: string
  includeFilters: boolean
  includeCharts: boolean
  fileNamingTemplate: string
  keepTradeHistory: string
  autoBackupFrequency: string
  createdAt: Date
  updatedAt: Date
}

// Form Types
export interface TradeFormData {
  tradeType: 'INTRADAY' | 'POSITIONAL'
  entryDate: Date
  entryPrice: number
  quantity: number
  position: PositionType
  symbol: string
  instrument: InstrumentType
  exitDate?: Date
  exitPrice?: number
  stopLoss?: number
  target?: number
  confidenceLevel?: number
  emotionalState?: string
  marketCondition?: string
  planning?: string // Pre-trade planning notes
  brokerName?: string
  customBrokerage: boolean
  brokerageType?: string
  brokerageValue?: number
  notes?: string
  strategyTagIds: string[]
  emotionalTagIds: string[]
  marketTagIds: string[]
  // Options specific
  optionType?: OptionType
  strikePrice?: number
  expiryDate?: Date
  lotSize?: number
  underlying?: string
  
  // Hedge Position
  hasHedgePosition?: boolean
  hedgePosition?: PositionType
  hedgeEntryDate?: Date
  hedgeEntryPrice?: number
  hedgeQuantity?: number
  hedgeExitDate?: Date
  hedgeExitPrice?: number
  hedgeNotes?: string
  
  // Psychology & Behavioral Analysis (Optional)
  followedRiskReward?: boolean
  followedIntradayHunter?: boolean
  overtrading?: boolean
  waitedForRetracement?: boolean
  hadPatienceWhileExiting?: boolean
  showedGreed?: boolean
  showedFear?: boolean
  tradedAgainstTrend?: boolean
  psychologyNotes?: string
}

// Filter Types
export interface TradeFilters {
  dateRange?: {
    from?: Date
    to?: Date
  }
  timeOfDay?: string[]
  dayOfWeek?: string[]
  instruments?: InstrumentType[]
  symbols?: string[]
  positions?: PositionType[]
  strategies?: string[]
  emotionalStates?: string[]
  marketConditions?: string[]
  pnlRange?: {
    min?: number
    max?: number
  }
  winLoss?: string[]
  holdingDuration?: string[]
  isDraft?: boolean
  search?: string
}

// Analytics Types
export interface PerformanceMetrics {
  totalTrades: number
  totalPnl: number
  winRate: number
  profitFactor: number
  avgWin: number
  avgLoss: number
  bestTrade: number
  worstTrade: number
  maxDrawdown: number
  sharpeRatio: number
  avgRiskReward: number
}

export interface TimeBasedPerformance {
  dayOfWeek: Record<string, number>
  timeOfDay: Record<string, number>
  monthly: Record<string, number>
}

export interface StrategyPerformance {
  strategy: string
  trades: number
  winRate: number
  totalPnl: number
  avgPnl: number
  bestTrade: number
  worstTrade: number
}

// Chart Data Types
export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface PieChartData {
  name: string
  value: number
  color?: string
}

export interface HeatmapData {
  day: string
  time: string
  value: number
  trades: number
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Utility Types
export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  key: string
  direction: SortDirection
}

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

// Charge Calculation Types
export interface ChargeCalculation {
  brokerage: number
  stt: number
  exchange: number
  sebi: number
  stampDuty: number
  total: number
}

export interface ChargeRates {
  brokerage: {
    type: 'flat' | 'percentage'
    value: number
  }
  stt: {
    equity: number
    futures: number
    options: number
  }
  exchange: number
  sebi: number
  stampDuty: number
}

// Capital Management Types
export interface CapitalPool {
  id: string
  name: string
  poolType: PoolType
  initialAmount: number
  currentAmount: number
  totalInvested: number
  totalWithdrawn: number
  totalPnl: number
  isActive: boolean
  description?: string | null
  createdAt: Date | string
  updatedAt: Date | string
  transactions?: CapitalTransaction[]
}

export interface CapitalTransaction {
  id: string
  poolId: string
  transactionType: TransactionType
  amount: number
  description?: string | null
  referenceId?: string | null
  referenceType?: string | null
  balanceAfter: number
  createdAt: Date | string
  pool?: CapitalPool
}

export interface CapitalAllocation {
  totalCapital: number
  equityCapital: number
  fnoCapital: number
  availableEquity: number
  availableFno: number
  totalPnl: number
  equityPnl: number
  fnoPnl: number
  totalReturn: number
  equityReturn: number
  fnoReturn: number
}

export interface CapitalSetupData {
  totalAmount: number
  equityAmount: number
  fnoAmount: number
  description?: string
}
