import { InstrumentType, PositionType } from '@prisma/client'
import { ChargeCalculation, ChargeRates } from '@/types/trade'

// Default charge rates (as per current Indian regulations)
export const DEFAULT_CHARGE_RATES: ChargeRates = {
  brokerage: {
    type: 'flat',
    value: 20 // ₹20 per side
  },
  stt: {
    equity: 0.001, // 0.1% on sell value
    futures: 0.0001, // 0.01% on sell value
    options: 0.0005 // 0.05% on premium on sell
  },
  exchange: 0.0000173, // 0.00173% on turnover
  sebi: 0.000001, // 0.0001% on turnover
  stampDuty: 0.00003 // 0.003% on turnover
}

/**
 * Calculate all charges for a trade
 */
export function calculateCharges(
  entryValue: number,
  exitValue: number,
  instrument: InstrumentType,
  position: PositionType,
  customRates?: Partial<ChargeRates>
): ChargeCalculation {
  // For equity positions, no charges are applied as per current regulations
  if (instrument === 'EQUITY') {
    return {
      brokerage: 0,
      stt: 0,
      exchange: 0,
      sebi: 0,
      stampDuty: 0,
      total: 0
    }
  }

  const rates = { ...DEFAULT_CHARGE_RATES, ...customRates }
  const turnover = entryValue + exitValue
  const sellValue = position === 'SELL' ? exitValue : entryValue

  // Brokerage (flat per side)
  const brokerage = rates.brokerage.type === 'flat' 
    ? rates.brokerage.value * 2 // Both sides
    : (turnover * rates.brokerage.value) / 100

  // STT (Securities Transaction Tax)
  let stt = 0
  if (position === 'SELL') {
    switch (instrument) {
      case 'FUTURES':
        stt = sellValue * rates.stt.futures
        break
      case 'OPTIONS':
        stt = sellValue * rates.stt.options
        break
    }
  }

  // Exchange Transaction Charges
  const exchange = turnover * rates.exchange

  // SEBI Turnover Fee
  const sebi = turnover * rates.sebi

  // Stamp Duty
  const stampDuty = turnover * rates.stampDuty

  const total = brokerage + stt + exchange + sebi + stampDuty

  return {
    brokerage: Math.round(brokerage * 100) / 100,
    stt: Math.round(stt * 100) / 100,
    exchange: Math.round(exchange * 100) / 100,
    sebi: Math.round(sebi * 100) / 100,
    stampDuty: Math.round(stampDuty * 100) / 100,
    total: Math.round(total * 100) / 100
  }
}

/**
 * Calculate P&L for a trade
 */
export function calculatePnL(
  entryValue: number,
  exitValue: number,
  charges: ChargeCalculation,
  position: PositionType
): {
  grossPnl: number
  netPnl: number
  percentageReturn: number
} {
  // Gross P&L calculation based on position
  let grossPnl: number
  if (position === 'BUY') {
    grossPnl = exitValue - entryValue
  } else {
    grossPnl = entryValue - exitValue
  }

  const netPnl = grossPnl - charges.total
  const percentageReturn = (netPnl / entryValue) * 100

  return {
    grossPnl: Math.round(grossPnl * 100) / 100,
    netPnl: Math.round(netPnl * 100) / 100,
    percentageReturn: Math.round(percentageReturn * 100) / 100
  }
}

/**
 * Calculate P&L for equity positions with LTP support
 */
export function calculateEquityPnL(
  entryPrice: number,
  quantity: number,
  ltpPrice: number,
  exitPrice?: number,
  position: PositionType = 'BUY'
): {
  entryValue: number
  currentValue: number
  exitValue: number
  grossPnl: number
  netPnl: number
  percentageReturn: number
  isRealized: boolean
} {
  const entryValue = entryPrice * quantity
  const currentValue = ltpPrice * quantity
  const exitValue = exitPrice ? exitPrice * quantity : 0
  
  // Use exit price if available (realized), otherwise use LTP (unrealized)
  const valueForCalculation = exitPrice || ltpPrice
  const calculationValue = valueForCalculation * quantity
  const isRealized = !!exitPrice

  // Gross P&L calculation based on position
  let grossPnl: number
  if (position === 'BUY') {
    grossPnl = calculationValue - entryValue
  } else {
    grossPnl = entryValue - calculationValue
  }

  // For equity, no charges are applied
  const netPnl = grossPnl
  const percentageReturn = (netPnl / entryValue) * 100

  return {
    entryValue: Math.round(entryValue * 100) / 100,
    currentValue: Math.round(currentValue * 100) / 100,
    exitValue: Math.round(exitValue * 100) / 100,
    grossPnl: Math.round(grossPnl * 100) / 100,
    netPnl: Math.round(netPnl * 100) / 100,
    percentageReturn: Math.round(percentageReturn * 100) / 100,
    isRealized
  }
}

/**
 * Calculate P&L for hedge position
 */
export function calculateHedgePnL(
  entryValue: number,
  exitValue: number,
  charges: ChargeCalculation,
  position: PositionType
): {
  grossPnl: number
  netPnl: number
  percentageReturn: number
} {
  // Hedge position P&L calculation (opposite to main position)
  let grossPnl: number
  if (position === 'BUY') {
    grossPnl = exitValue - entryValue
  } else {
    grossPnl = entryValue - exitValue
  }

  const netPnl = grossPnl - charges.total
  const percentageReturn = (netPnl / entryValue) * 100

  return {
    grossPnl: Math.round(grossPnl * 100) / 100,
    netPnl: Math.round(netPnl * 100) / 100,
    percentageReturn: Math.round(percentageReturn * 100) / 100
  }
}

/**
 * Calculate combined P&L for main trade and hedge position
 */
export function calculateCombinedPnL(
  mainTrade: {
    entryValue: number
    exitValue: number
    charges: ChargeCalculation
    position: PositionType
  },
  hedgeTrade?: {
    entryValue: number
    exitValue: number
    charges: ChargeCalculation
    position: PositionType
  }
): {
  mainTrade: {
    grossPnl: number
    netPnl: number
    percentageReturn: number
  }
  hedgeTrade?: {
    grossPnl: number
    netPnl: number
    percentageReturn: number
  }
  combined: {
    grossPnl: number
    netPnl: number
    totalCharges: number
    percentageReturn: number
  }
} {
  const mainPnL = calculatePnL(
    mainTrade.entryValue,
    mainTrade.exitValue,
    mainTrade.charges,
    mainTrade.position
  )

  let hedgePnL: {
    grossPnl: number
    netPnl: number
    percentageReturn: number
  } | undefined = undefined
  let combined = {
    grossPnl: mainPnL.grossPnl,
    netPnl: mainPnL.netPnl,
    totalCharges: mainTrade.charges.total,
    percentageReturn: mainPnL.percentageReturn
  }

  if (hedgeTrade) {
    hedgePnL = calculateHedgePnL(
      hedgeTrade.entryValue,
      hedgeTrade.exitValue,
      hedgeTrade.charges,
      hedgeTrade.position
    )

    combined = {
      grossPnl: mainPnL.grossPnl + hedgePnL.grossPnl,
      netPnl: mainPnL.netPnl + hedgePnL.netPnl,
      totalCharges: mainTrade.charges.total + hedgeTrade.charges.total,
      percentageReturn: ((mainPnL.netPnl + hedgePnL.netPnl) / mainTrade.entryValue) * 100
    }
  }

  return {
    mainTrade: mainPnL,
    hedgeTrade: hedgePnL,
    combined: {
      grossPnl: Math.round(combined.grossPnl * 100) / 100,
      netPnl: Math.round(combined.netPnl * 100) / 100,
      totalCharges: Math.round(combined.totalCharges * 100) / 100,
      percentageReturn: Math.round(combined.percentageReturn * 100) / 100
    }
  }
}

/**
 * Calculate risk/reward ratio
 */
export function calculateRiskReward(
  entryPrice: number,
  stopLoss: number | null,
  target: number | null
): number | null {
  if (!stopLoss || !target) return null

  const risk = Math.abs(entryPrice - stopLoss)
  const reward = Math.abs(target - entryPrice)

  if (risk === 0) return null

  return Math.round((reward / risk) * 100) / 100
}

/**
 * Calculate holding duration in minutes
 */
export function calculateHoldingDuration(
  entryDate: Date,
  exitDate: Date | null
): number | null {
  if (!exitDate) return null

  const diffMs = exitDate.getTime() - entryDate.getTime()
  return Math.round(diffMs / (1000 * 60)) // Convert to minutes
}

/**
 * Format currency for display
 */
export function formatCurrency(
  amount: number,
  currency: string = '₹',
  decimals: number = 2
): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return formatter.format(amount).replace('₹', currency)
}

/**
 * Format percentage for display
 */
export function formatPercentage(
  value: number,
  decimals: number = 2
): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
}

/**
 * Format number with Indian number system
 */
export function formatNumber(
  value: number,
  decimals: number = 2
): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}


/**
 * Calculate time-based performance
 */
export function calculateTimeBasedPerformance(trades: Array<{
  entryDate: Date
  exitDate?: Date | null
  netPnl?: number | null
}>): {
  dayOfWeek: Record<string, number>
  timeOfDay: Record<string, number>
  monthly: Record<string, number>
} {
  const dayOfWeek: Record<string, number> = {}
  const timeOfDay: Record<string, number> = {}
  const monthly: Record<string, number> = {}

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const timeSlots = ['Pre-Market', 'Opening', 'Morning', 'Afternoon', 'Closing']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // Initialize with zeros
  days.forEach(day => dayOfWeek[day] = 0)
  timeSlots.forEach(slot => timeOfDay[slot] = 0)
  months.forEach(month => monthly[month] = 0)

  trades.forEach(trade => {
    if (!trade.exitDate || trade.netPnl === null) return

    const entryDate = new Date(trade.entryDate)
    const day = days[entryDate.getDay()]
    const hour = entryDate.getHours()
    const month = months[entryDate.getMonth()]

    // Categorize by time of day
    let timeSlot = 'Morning'
    if (hour >= 9 && hour < 9.25) timeSlot = 'Pre-Market'
    else if (hour >= 9.25 && hour < 10) timeSlot = 'Opening'
    else if (hour >= 10 && hour < 12) timeSlot = 'Morning'
    else if (hour >= 12 && hour < 15) timeSlot = 'Afternoon'
    else if (hour >= 15 && hour < 15.5) timeSlot = 'Closing'

    dayOfWeek[day] += trade.netPnl || 0
    timeOfDay[timeSlot] += trade.netPnl || 0
    monthly[month] += trade.netPnl || 0
  })

  return { dayOfWeek, timeOfDay, monthly }
}

/**
 * Calculate strategy performance
 */
export function calculateStrategyPerformance(trades: Array<{
  exitDate?: Date | null
  netPnl?: number | null
  strategyTags?: Array<{
    strategyTag: {
      name: string
    }
  }>
}>): Array<{
  strategy: string
  trades: number
  winRate: number
  totalPnl: number
  avgPnl: number
  bestTrade: number
  worstTrade: number
}> {
  const strategyMap = new Map<string, Array<{
    exitDate?: Date | null
    netPnl?: number | null
    strategyTags?: Array<{
      strategyTag: {
        name: string
      }
    }>
  }>>()

  trades.forEach(trade => {
    if (!trade.exitDate || trade.netPnl === null) return

    trade.strategyTags?.forEach((tag) => {
      const strategy = tag.strategyTag.name
      if (!strategyMap.has(strategy)) {
        strategyMap.set(strategy, [])
      }
      strategyMap.get(strategy)!.push(trade)
    })
  })

  return Array.from(strategyMap.entries()).map(([strategy, strategyTrades]) => {
    const winningTrades = strategyTrades.filter(t => t.netPnl && t.netPnl > 0)
    const winRate = (winningTrades.length / strategyTrades.length) * 100
    const totalPnl = strategyTrades.reduce((sum, t) => sum + (t.netPnl || 0), 0)
    const avgPnl = totalPnl / strategyTrades.length
    const bestTrade = Math.max(...strategyTrades.map(t => t.netPnl || 0))
    const worstTrade = Math.min(...strategyTrades.map(t => t.netPnl || 0))

    return {
      strategy,
      trades: strategyTrades.length,
      winRate: Math.round(winRate * 100) / 100,
      totalPnl: Math.round(totalPnl * 100) / 100,
      avgPnl: Math.round(avgPnl * 100) / 100,
      bestTrade: Math.round(bestTrade * 100) / 100,
      worstTrade: Math.round(worstTrade * 100) / 100
    }
  }).sort((a, b) => b.totalPnl - a.totalPnl)
}
