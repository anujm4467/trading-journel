'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  FileText, 
  Calculator,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  CheckCircle,
  Clock,
  Shield,
  Brain,
  Activity,
  Target,
  HeartCrack
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { SymbolSearchInput } from '@/components/forms/SymbolSearchInput'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { TradeFormData, CapitalPool } from '@/types/trade'
import { TradeDetails } from '@/types/tradeDetails'
import { calculateCharges, calculateEquityPnL } from '@/utils/calculations'
import { useCapital } from '@/hooks/useCapital'
import tradeData from '@/data/tradeData.json'

// Form validation schema
const tradeFormSchema = z.object({
  tradeType: z.enum(['INTRADAY', 'POSITIONAL']),
  entryDate: z.date(),
  entryPrice: z.number().positive('Entry price must be positive'),
  quantity: z.number().positive('Quantity must be positive'),
  position: z.enum(['BUY', 'SELL']),
  symbol: z.string().min(1, 'Symbol is required'),
  instrument: z.enum(['EQUITY', 'FUTURES', 'OPTIONS']),
  capitalPoolId: z.string().optional(),
  exitDate: z.date().optional(),
  exitPrice: z.number().min(0).optional(),
  ltpPrice: z.number().min(0).optional(), // LTP for equity positions
  stopLoss: z.number().min(0).optional(),
  target: z.number().min(0).optional(),
  confidenceLevel: z.number().min(1).max(10).optional(),
  emotionalState: z.string().optional(),
  marketCondition: z.string().optional(),
  brokerName: z.string().optional(),
  customBrokerage: z.boolean(),
  brokerageType: z.string().optional(),
  brokerageValue: z.number().min(0).optional(),
  notes: z.string().optional(),
  planning: z.string().optional(),
  strategyTagIds: z.array(z.string()),
  emotionalTagIds: z.array(z.string()),
  marketTagIds: z.array(z.string()),
  // Options specific
  optionType: z.enum(['CALL', 'PUT']).optional(),
  strikePrice: z.number().min(0).optional(),
  expiryDate: z.date().optional(),
  lotSize: z.number().min(0).optional(),
  underlying: z.string().optional(),
  
  // Hedge Position
  hasHedgePosition: z.boolean().optional(),
  hedgeOptionType: z.enum(['CALL', 'PUT']).optional(),
  hedgeEntryDate: z.date().optional(),
  hedgeEntryPrice: z.union([z.number().min(0), z.undefined()]).optional(),
  hedgeQuantity: z.union([z.number().min(0), z.undefined()]).optional(),
  hedgeExitDate: z.date().optional(),
  hedgeExitPrice: z.union([z.number().min(0), z.undefined()]).optional(),
  hedgeNotes: z.string().optional(),
  
  // Psychology & Behavioral Analysis (Optional)
  followedRiskReward: z.boolean().optional(),
  followedIntradayHunter: z.boolean().optional(),
  overtrading: z.boolean().optional(),
  waitedForRetracement: z.boolean().optional(),
  hadPatienceWhileExiting: z.boolean().optional(),
  showedGreed: z.boolean().optional(),
  showedFear: z.boolean().optional(),
  tradedAgainstTrend: z.boolean().optional(),
  psychologyNotes: z.string().optional(),
  // Enhanced Psychology Fields
  sleepQuality: z.number().min(1).max(10).optional(),
  meditationPractice: z.boolean().optional(),
  internetIssues: z.boolean().optional(),
  stressLevel: z.number().min(1).max(10).optional(),
  energyLevel: z.number().min(1).max(10).optional(),
  focusLevel: z.number().min(1).max(10).optional(),
  marketSentiment: z.string().optional(),
  newsImpact: z.string().optional(),
  socialMediaInfluence: z.boolean().optional(),
  fomoLevel: z.number().min(1).max(10).optional(),
  revengeTrading: z.boolean().optional(),
  impulsiveTrading: z.boolean().optional(),
  overconfidence: z.boolean().optional(),
  analysisTime: z.number().min(1).optional(),
  decisionTime: z.number().min(1).optional(),
  preTradeMood: z.string().optional(),
  postTradeMood: z.string().optional(),
  learningFromMistakes: z.boolean().optional(),
  strategyDeviation: z.string().optional(),
  emotionalTriggers: z.string().optional(),
  copingMechanisms: z.string().optional(),
})

type TradeFormSchema = z.infer<typeof tradeFormSchema>

interface TradeFormPageProps {
  onSave: (data: TradeFormData) => Promise<void>
  onSaveDraft: (data: TradeFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
  initialData?: TradeDetails
  isEdit?: boolean
}

const steps = [
  {
    id: 1,
    title: 'Basic Info',
    subtitle: 'Trade details and instrument',
    icon: FileText,
  },
  {
    id: 2,
    title: 'Risk Management',
    subtitle: 'Stop loss and targets',
    icon: Shield,
  },
  {
    id: 3,
    title: 'Strategy & Psychology',
    subtitle: 'Tags and emotional state',
    icon: Brain,
  },
  {
    id: 4,
    title: 'Behavioral Analysis',
    subtitle: 'Trading behavior and psychology',
    icon: BarChart3,
  },
  {
    id: 5,
    title: 'Review & Save',
    subtitle: 'Final review and calculations',
    icon: CheckCircle,
  },
]

// Helper functions for date handling
const getDefaultDate = () => {
  const now = new Date()
  // Set to 9:15 AM
  now.setHours(9, 15, 0, 0)
  return now
}

const getDefaultExitDate = () => {
  const now = new Date()
  // Set to 3:30 PM (market close time)
  now.setHours(15, 30, 0, 0)
  return now
}


export function TradeFormPage({ onSave, onSaveDraft, onCancel, isSubmitting = false, initialData, isEdit = false }: TradeFormPageProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [calculations, setCalculations] = useState<{
    entryValue: number
    exitValue: number
    turnover: number
    grossPnl: number
    netPnl: number
    totalCharges: number
    percentageReturn: number
    investedCapital: number
    charges: {
      brokerage: number
      stt: number
      exchange: number
      sebi: number
      stampDuty: number
      gst: number
      total: number
    }
  }>({
    entryValue: 0,
    exitValue: 0,
    turnover: 0,
    grossPnl: 0,
    netPnl: 0,
    totalCharges: 0,
    percentageReturn: 0,
    investedCapital: 0, // For equity positions
    charges: {
      brokerage: 0,
      stt: 0,
      exchange: 0,
      sebi: 0,
      stampDuty: 0,
      gst: 0,
      total: 0,
    }
  })

  const { pools } = useCapital()

  // Default values for new trades
  const defaultValues: Partial<TradeFormSchema> = {
    tradeType: 'INTRADAY',
    entryDate: getDefaultDate(),
    exitDate: getDefaultExitDate(),
    position: 'SELL',
    instrument: 'OPTIONS',
    capitalPoolId: '', // Will be auto-selected based on instrument
    customBrokerage: false,
    brokerageValue: undefined, // Will be set based on customBrokerage
    strategyTagIds: [],
    emotionalTagIds: [],
    marketTagIds: [],
    stopLoss: 4000,
    target: 4000,
    confidenceLevel: 7,
    marketCondition: 'Bullish',
    emotionalState: 'Confident',
    planning: '',
    lotSize: 75,
    ltpPrice: 0, // Default LTP price
    // Psychology fields - auto-selected with sensible defaults (good behaviors = true, bad behaviors = false)
    followedRiskReward: true, // "Followed planned risk-reward ratio" - good behavior
    followedIntradayHunter: true, // "Followed intraday hunter strategy" - good behavior
    overtrading: true, // "Avoided overtrading" - good behavior (true = avoided)
    waitedForRetracement: true, // "Waited for proper retracement" - good behavior
    hadPatienceWhileExiting: true, // "Had patience while exiting trade" - good behavior
    showedGreed: false, // "Showed greed in this trade" - bad behavior (false = didn't show)
    showedFear: false, // "Showed fear in this trade" - bad behavior (false = didn't show)
    tradedAgainstTrend: false, // "Traded against market trend" - bad behavior (false = didn't trade against)
    psychologyNotes: '',
    // Enhanced Psychology Fields - Default values
    sleepQuality: 7, // Default to good sleep quality
    meditationPractice: false, // Default to no meditation
    internetIssues: false, // Default to no internet issues
    stressLevel: 5, // Default to moderate stress
    energyLevel: 7, // Default to good energy
    focusLevel: 7, // Default to good focus
    marketSentiment: 'Neutral', // Default to neutral sentiment
    newsImpact: 'Neutral', // Default to neutral news impact
    socialMediaInfluence: false, // Default to no social media influence
    fomoLevel: 3, // Default to low FOMO
    revengeTrading: false, // Default to no revenge trading
    impulsiveTrading: false, // Default to no impulsive trading
    overconfidence: false, // Default to no overconfidence
    analysisTime: 30, // Default to 30 minutes analysis time
    decisionTime: 5, // Default to 5 minutes decision time
    preTradeMood: 'Calm', // Default to calm mood
    postTradeMood: 'Neutral', // Default to neutral mood
    learningFromMistakes: false, // Default to not learning from mistakes
    strategyDeviation: '', // Default to no strategy deviation
    emotionalTriggers: '', // Default to no emotional triggers
    copingMechanisms: '', // Default to no coping mechanisms
  }

  const form = useForm<TradeFormSchema>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: defaultValues as Partial<TradeFormSchema>,
  })

  // Auto-select capital pool based on instrument type
  const getPoolForInstrument = useCallback((instrument: string) => {
    if (!pools || pools.length === 0) return ''
    
    switch (instrument) {
      case 'EQUITY':
        const equityPool = pools.find(pool => pool.poolType === 'EQUITY')
        return equityPool?.id || pools[0]?.id || ''
      case 'OPTIONS':
      case 'FUTURES':
        const fnoPool = pools.find(pool => pool.poolType === 'FNO')
        return fnoPool?.id || pools[0]?.id || ''
      default:
        const totalPool = pools.find(pool => pool.poolType === 'TOTAL')
        return totalPool?.id || pools[0]?.id || ''
    }
  }, [pools])

  // Watch instrument changes and auto-select pool
  const currentInstrument = form.watch('instrument')
  useEffect(() => {
    if (currentInstrument && pools.length > 0) {
      const selectedPoolId = getPoolForInstrument(currentInstrument)
      if (selectedPoolId) {
        form.setValue('capitalPoolId', selectedPoolId)
        console.log(`Auto-selected pool for ${currentInstrument}:`, selectedPoolId)
      }
    }
  }, [currentInstrument, pools, form, getPoolForInstrument])

  // Set initial pool when pools are loaded and form is initialized
  useEffect(() => {
    if (pools.length > 0 && !isEdit) {
      const currentInstrumentValue = form.getValues('instrument')
      const selectedPoolId = getPoolForInstrument(currentInstrumentValue)
      if (selectedPoolId) {
        form.setValue('capitalPoolId', selectedPoolId)
        console.log(`Initial pool selected for ${currentInstrumentValue}:`, selectedPoolId)
      }
    }
  }, [pools, isEdit, form, getPoolForInstrument])

  // Debug logging for edit mode and populate form with initial data
  useEffect(() => {
    if (initialData && isEdit) {
      console.log('Edit mode - Initial data:', initialData)
      
      // Populate form with initial data
      const formData = {
        tradeType: initialData.tradeType as 'INTRADAY' | 'POSITIONAL',
        entryDate: new Date(initialData.entryDate),
        entryPrice: initialData.entryPrice,
        quantity: initialData.quantity,
        position: initialData.position as 'BUY' | 'SELL',
        symbol: initialData.symbol,
        instrument: initialData.instrument as 'EQUITY' | 'FUTURES' | 'OPTIONS',
        capitalPoolId: getPoolForInstrument(initialData.instrument), // Auto-select based on instrument
        exitDate: initialData.exitDate ? new Date(initialData.exitDate) : undefined,
        exitPrice: initialData.exitPrice || undefined,
        ltpPrice: initialData.ltpPrice || 0,
        stopLoss: initialData.stopLoss || undefined,
        target: initialData.target || undefined,
        confidenceLevel: initialData.confidenceLevel || 7,
        marketCondition: initialData.marketCondition || 'Bullish',
        emotionalState: initialData.emotionalState || 'Confident',
        planning: initialData.planning || '',
        notes: initialData.notes || '',
        customBrokerage: initialData.customBrokerage || false,
        brokerageType: initialData.brokerageType || 'PERCENTAGE',
        brokerageValue: initialData.brokerageValue || (initialData.customBrokerage ? 0 : undefined),
        brokerName: initialData.brokerName || '',
        lotSize: initialData.optionsTrade?.lotSize || 75,
        optionType: initialData.optionsTrade?.optionType || 'CALL',
        strikePrice: initialData.optionsTrade?.strikePrice || 0,
        expiryDate: initialData.optionsTrade?.expiryDate ? new Date(initialData.optionsTrade.expiryDate) : undefined,
        strategyTagIds: initialData.strategyTags?.map(tag => tag.id) || [],
        emotionalTagIds: initialData.emotionalTags?.map(tag => tag.id) || [],
        marketTagIds: initialData.marketTags?.map(tag => tag.id) || [],
        hasHedgePosition: !!initialData.hedgePosition,
        hedgeOptionType: initialData.hedgePosition?.optionType || 'CALL',
        hedgeQuantity: initialData.hedgePosition?.quantity || 0,
        hedgeEntryPrice: initialData.hedgePosition?.entryPrice || 0,
        hedgeExitPrice: initialData.hedgePosition?.exitPrice || undefined,
        hedgeEntryDate: initialData.hedgePosition?.entryDate ? new Date(initialData.hedgePosition.entryDate) : undefined,
        hedgeExitDate: initialData.hedgePosition?.exitDate ? new Date(initialData.hedgePosition.exitDate) : undefined,
        hedgeNotes: initialData.hedgePosition?.notes || '',
      }
      
      form.reset(formData)
      console.log('Form populated with initial data:', formData)
    }
  }, [initialData, isEdit, form, pools, getPoolForInstrument])

  // Watch specific form fields for calculations
  const entryPrice = form.watch('entryPrice')
  const quantity = form.watch('quantity')
  const exitPrice = form.watch('exitPrice')
  const ltpPrice = form.watch('ltpPrice')
  const position = form.watch('position')
  const instrument = form.watch('instrument')
  const tradeType = form.watch('tradeType')

  // Auto-set trade type to POSITIONAL for equity (running trades)
  useEffect(() => {
    if (instrument === 'EQUITY' && tradeType !== 'POSITIONAL') {
      form.setValue('tradeType', 'POSITIONAL')
      // Clear exit fields for equity running trades
      form.setValue('exitDate', undefined)
      form.setValue('exitPrice', undefined)
    }
  }, [instrument, tradeType, form])
  
  // Watch hedge position fields
  const hasHedgePosition = form.watch('hasHedgePosition')
  const hedgeEntryPrice = form.watch('hedgeEntryPrice')
  const hedgeExitPrice = form.watch('hedgeExitPrice')
  const hedgeQuantity = form.watch('hedgeQuantity')
  const hedgeOptionType = form.watch('hedgeOptionType')

  // Set initial default values on component mount
  useEffect(() => {
    if (!isEdit) {
      const today = new Date()
      
      // Set initial options defaults since OPTIONS is the default instrument
      form.setValue('symbol', 'NIFTY50')
      form.setValue('quantity', 225)
      form.setValue('entryPrice', 220) // Set default entry price
      form.setValue('exitPrice', 210) // Set default exit price
      form.setValue('tradeType', 'INTRADAY')
      form.setValue('entryDate', today)
      form.setValue('exitDate', today)
      form.setValue('strikePrice', 25000)
      form.setValue('lotSize', 75)
      form.setValue('optionType', 'CALL')
      
      // Set expiry date to next Thursday (typical options expiry)
      const nextThursday = new Date()
      const daysUntilThursday = (4 - nextThursday.getDay() + 7) % 7
      nextThursday.setDate(nextThursday.getDate() + (daysUntilThursday === 0 ? 7 : daysUntilThursday))
      form.setValue('expiryDate', nextThursday)
      
      // Default values set
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array since this should only run once on mount

  // Smart defaults based on instrument selection (only when instrument changes)
  useEffect(() => {
    if (isEdit) return
    
    if (currentInstrument === 'OPTIONS') {
      // Set smart defaults for options
      form.setValue('symbol', 'NIFTY50')
      form.setValue('quantity', 225)
      form.setValue('entryPrice', 220) // Set default entry price
      form.setValue('exitPrice', 210) // Set default exit price
      form.setValue('tradeType', 'INTRADAY') // Options are always intraday
      
      // Set today's date for both entry and exit
      const today = new Date()
      form.setValue('entryDate', today)
      form.setValue('exitDate', today)
      
      // Set default options values
      form.setValue('strikePrice', 25000)
      form.setValue('lotSize', 75)
      
      // Set expiry date to next Thursday (typical options expiry)
      const nextThursday = new Date()
      const daysUntilThursday = (4 - nextThursday.getDay() + 7) % 7
      nextThursday.setDate(nextThursday.getDate() + (daysUntilThursday === 0 ? 7 : daysUntilThursday))
      form.setValue('expiryDate', nextThursday)
    } else if (currentInstrument === 'FUTURES') {
      // Set defaults for futures
      form.setValue('symbol', 'NIFTY50')
      form.setValue('quantity', 50)
      form.setValue('entryPrice', 25000) // Set default entry price
      form.setValue('exitPrice', 25100) // Set default exit price
      form.setValue('tradeType', 'INTRADAY') // Default to intraday for futures
      
      // Set today's date for both entry and exit
      const today = new Date()
      form.setValue('entryDate', today)
      form.setValue('exitDate', today)
    } else if (currentInstrument === 'EQUITY') {
      // Set defaults for equity
      form.setValue('symbol', 'HUL')
      form.setValue('quantity', 98)
      form.setValue('entryPrice', 2450) // Set default entry price
      form.setValue('ltpPrice', 2400) // Set default LTP price
      form.setValue('tradeType', 'POSITIONAL') // Always positional for equity (running trades)
      
      // Clear exit fields for equity (running trades)
      form.setValue('exitDate', undefined)
      form.setValue('exitPrice', undefined)
      
      // Set today's date for entry only
      const today = new Date()
      form.setValue('entryDate', today)
    }
  }, [currentInstrument, isEdit, form]) // Only run when instrument changes

  // Calculate real-time values
  useEffect(() => {
    if (entryPrice && quantity && entryPrice > 0 && quantity > 0) {
      // For equity positions, use special calculation with LTP support
      if (instrument === 'EQUITY' && ltpPrice && ltpPrice > 0) {
        const equityCalc = calculateEquityPnL(
          entryPrice,
          quantity,
          ltpPrice,
          exitPrice,
          position as 'BUY' | 'SELL'
        )
        
        // Calculate invested capital (entry value for equity)
        const investedCapital = equityCalc.entryValue
        
        setCalculations({
          entryValue: equityCalc.entryValue,
          exitValue: equityCalc.exitValue,
          turnover: equityCalc.entryValue + equityCalc.exitValue,
          grossPnl: equityCalc.grossPnl,
          netPnl: equityCalc.netPnl,
          totalCharges: 0, // No charges for equity
          percentageReturn: equityCalc.percentageReturn,
          investedCapital: investedCapital,
          charges: {
            brokerage: 0,
            stt: 0,
            exchange: 0,
            sebi: 0,
            stampDuty: 0,
            gst: 0,
            total: 0,
          },
        })
        return
      }

      // For non-equity positions, use standard calculation
      const entryValue = entryPrice * quantity
      const exitValue = exitPrice ? exitPrice * quantity : 0
      const turnover = entryValue + exitValue
      
      // Calculate gross P&L based on position
      let grossPnl = 0
      if (exitValue > 0) {
        if (position === 'BUY') {
          grossPnl = exitValue - entryValue
        } else {
          grossPnl = entryValue - exitValue
        }
      }
      
      // Calculate charges for main trade
      const charges = calculateCharges(
        entryValue,
        exitValue,
        instrument || 'EQUITY',
        position || 'BUY'
      )
      
      let finalGrossPnl = grossPnl
      let finalNetPnl = grossPnl - charges.total
      let finalTotalCharges = charges.total
      let finalTurnover = turnover
      let finalEntryValue = entryValue
      let finalExitValue = exitValue
      let finalCharges = { ...charges }

      // Calculate hedge position if enabled
      if (hasHedgePosition && hedgeEntryPrice && hedgeQuantity) {
        const hedgeEntryValue = hedgeEntryPrice * hedgeQuantity
        const hedgeExitValue = hedgeExitPrice ? hedgeExitPrice * hedgeQuantity : 0
        const hedgeTurnover = hedgeEntryValue + hedgeExitValue
        
        // Calculate hedge P&L (opposite position to main trade)
        const hedgePosition = position === 'BUY' ? 'SELL' : 'BUY'
        let hedgeGrossPnl = 0
        if (hedgeExitValue > 0) {
          if (hedgePosition === 'BUY') {
            hedgeGrossPnl = hedgeExitValue - hedgeEntryValue
          } else {
            hedgeGrossPnl = hedgeEntryValue - hedgeExitValue
          }
        }
        
        // Calculate hedge charges
        const hedgeCharges = calculateCharges(
          hedgeEntryValue,
          hedgeExitValue,
          instrument || 'EQUITY',
          hedgePosition as 'BUY' | 'SELL'
        )
        
        // Combine main trade and hedge
        finalGrossPnl = grossPnl + hedgeGrossPnl
        finalNetPnl = finalGrossPnl - (charges.total + hedgeCharges.total)
        finalTotalCharges = charges.total + hedgeCharges.total
        finalTurnover = turnover + hedgeTurnover
        finalEntryValue = entryValue + hedgeEntryValue
        finalExitValue = exitValue + hedgeExitValue
        
        // Combine charges breakdown
        finalCharges = {
          brokerage: charges.brokerage + hedgeCharges.brokerage,
          stt: charges.stt + hedgeCharges.stt,
          exchange: charges.exchange + hedgeCharges.exchange,
          sebi: charges.sebi + hedgeCharges.sebi,
          stampDuty: charges.stampDuty + hedgeCharges.stampDuty,
          total: charges.total + hedgeCharges.total
        }
      }
      
      const percentageReturn = finalEntryValue > 0 ? (finalNetPnl / finalEntryValue) * 100 : 0

      setCalculations({
        entryValue: finalEntryValue,
        exitValue: finalExitValue,
        turnover: finalTurnover,
        grossPnl: finalGrossPnl,
        netPnl: finalNetPnl,
        totalCharges: finalTotalCharges,
        percentageReturn,
        investedCapital: finalEntryValue, // Invested capital is the entry value
        charges: {
          ...finalCharges,
          gst: 0, // GST is typically included in brokerage
        },
      })
    } else {
      // Reset calculations when required fields are missing
      setCalculations({
        entryValue: 0,
        exitValue: 0,
        turnover: 0,
        grossPnl: 0,
        netPnl: 0,
        totalCharges: 0,
        percentageReturn: 0,
        investedCapital: 0,
        charges: {
          brokerage: 0,
          stt: 0,
          exchange: 0,
          sebi: 0,
          stampDuty: 0,
          gst: 0,
          total: 0,
        }
      })
    }
  }, [entryPrice, quantity, exitPrice, ltpPrice, position, instrument, hasHedgePosition, hedgeEntryPrice, hedgeExitPrice, hedgeQuantity, hedgeOptionType])

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = async () => {
    try {
      console.log('Save button clicked, isEdit:', isEdit)
      
      // Clean up form data before validation
      const formData = form.getValues()
      console.log('Raw form data before cleaning:', formData)
      
      const cleanedFormData = {
        ...formData,
        // Set brokerageValue to undefined if customBrokerage is false
        brokerageValue: formData.customBrokerage ? formData.brokerageValue : undefined,
        // Clean hedge fields - convert null to undefined
        hedgeEntryPrice: formData.hedgeEntryPrice === null ? undefined : formData.hedgeEntryPrice,
        hedgeQuantity: formData.hedgeQuantity === null ? undefined : formData.hedgeQuantity,
        hedgeExitPrice: formData.hedgeExitPrice === null ? undefined : formData.hedgeExitPrice,
      }
      
      console.log('Cleaned form data:', cleanedFormData)
      
      // Update form with cleaned data
      form.setValue('brokerageValue', cleanedFormData.brokerageValue)
      form.setValue('hedgeEntryPrice', cleanedFormData.hedgeEntryPrice)
      form.setValue('hedgeQuantity', cleanedFormData.hedgeQuantity)
      form.setValue('hedgeExitPrice', cleanedFormData.hedgeExitPrice)
      
      console.log('About to trigger validation...')
      const validData = await form.trigger()
      console.log('Form validation result:', validData)
      
      if (validData) {
        console.log('Form data:', cleanedFormData)
        
        // Include the calculated charges in the form data
        const formDataWithCharges = {
          ...cleanedFormData,
          charges: calculations.charges
        }
        console.log('Form data with charges:', formDataWithCharges)
        console.log('Calling onSave with data...')
        await onSave(formDataWithCharges as TradeFormData)
        console.log('onSave completed successfully')
      } else {
        console.log('Form validation failed, not calling onSave')
        const errors = form.formState.errors
        console.log('Form errors:', errors)
        console.log('Form values:', form.getValues())
        console.log('Form dirty fields:', form.formState.dirtyFields)
        console.log('Form touched fields:', form.formState.touchedFields)
        
        // Log each field validation individually
        const fields = Object.keys(form.getValues())
        for (const field of fields) {
          const fieldError = form.formState.errors[field as keyof typeof form.formState.errors]
          if (fieldError) {
            console.log(`Field ${field} error:`, fieldError)
          }
        }
      }
    } catch (error) {
      console.error('Form validation failed:', error)
    }
  }

  const handleSaveDraft = async () => {
    const formData = form.getValues()
    // Include the calculated charges in the form data
    const formDataWithCharges = {
      ...formData,
      charges: calculations.charges
    }
    await onSaveDraft(formDataWithCharges as TradeFormData)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep form={form} pools={pools} />
      case 2:
        return <RiskManagementStep form={form} />
      case 3:
        return <StrategyPsychologyStep form={form} />
      case 4:
        return <BehavioralAnalysisStep form={form} />
      case 5:
        return <ReviewStep form={form} calculations={calculations} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-[140rem] mx-auto px-6">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-6 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Add New Trade
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Record your trading activity and track performance
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                      ${isActive 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/25' 
                        : isCompleted 
                        ? 'bg-green-600 border-green-600 text-white' 
                        : 'bg-white border-slate-300 text-slate-400'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-slate-400'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {step.subtitle}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${isCompleted ? 'bg-green-600' : 'bg-slate-300'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl border border-white/20">
            <div className="p-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </Card>
        </div>

        {/* Real-time Calculations Sidebar */}
        <div className="lg:col-span-1">
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl border border-white/20 sticky top-8">
            <div className="p-12">
              <div className="flex items-center gap-2 mb-8">
                <Calculator className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Real-time Calculations
                  {hasHedgePosition && (
                    <span className="ml-2 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">
                      + Hedge
                    </span>
                  )}
                </h3>
              </div>

              <div className="space-y-6">
                {/* Values */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Values</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Entry Value:</span>
                      <span className="font-medium">₹{(calculations.entryValue || 0).toLocaleString()}</span>
                    </div>
                    {instrument === 'EQUITY' && (
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Invested Capital:</span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">₹{(calculations.investedCapital || 0).toLocaleString()}</span>
                      </div>
                    )}
                    {instrument === 'EQUITY' && ltpPrice && (
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Current Value:</span>
                        <span className="font-medium">₹{((ltpPrice || 0) * (quantity || 0)).toLocaleString()}</span>
                      </div>
                    )}
                    {calculations.exitValue > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Exit Value:</span>
                        <span className="font-medium">₹{(calculations.exitValue || 0).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Turnover:</span>
                      <span className="font-medium">₹{(calculations.turnover || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Charges Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Charges Breakdown</h4>
                  {instrument === 'EQUITY' ? (
                    <div className="text-center py-4">
                      <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                        No charges for equity positions
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Equity trades have zero brokerage and charges
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Brokerage:</span>
                        <span className="font-medium">₹{calculations.charges.brokerage.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">STT:</span>
                        <span className="font-medium">₹{calculations.charges.stt.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Exchange:</span>
                        <span className="font-medium">₹{calculations.charges.exchange.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">SEBI:</span>
                        <span className="font-medium">₹{calculations.charges.sebi.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Stamp Duty:</span>
                        <span className="font-medium">₹{calculations.charges.stampDuty.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">GST:</span>
                        <span className="font-medium">₹{calculations.charges.gst.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold">
                          <span className="text-slate-900 dark:text-slate-100">Total Charges:</span>
                          <span className="text-slate-900 dark:text-slate-100">₹{calculations.totalCharges.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* P&L Summary */}
                {(calculations.exitValue > 0 || (instrument === 'EQUITY' && ltpPrice && ltpPrice > 0)) && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">P&L Summary</h4>
                    <div className="space-y-2">
                      {instrument === 'EQUITY' && (
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Invested Capital:</span>
                          <span className="font-medium text-blue-600 dark:text-blue-400">₹{(calculations.investedCapital || 0).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Gross P&L:</span>
                        <span className={`font-medium ${(calculations.grossPnl || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {(calculations.grossPnl || 0) >= 0 ? '+' : ''}₹{(calculations.grossPnl || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Net P&L:</span>
                        <span className={`font-semibold ${(calculations.netPnl || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {(calculations.netPnl || 0) >= 0 ? '+' : ''}₹{(calculations.netPnl || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Return %:</span>
                        <span className={`font-semibold ${(calculations.percentageReturn || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {(calculations.percentageReturn || 0) >= 0 ? '+' : ''}{(calculations.percentageReturn || 0).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Save Draft
          </Button>
        </div>

        <div className="flex gap-3">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
          )}
          
          {currentStep < steps.length ? (
            <Button
              onClick={nextStep}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : 'Save Trade'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Step Components
function BasicInfoStep({ form, pools }: { form: ReturnType<typeof useForm<TradeFormSchema>>, pools: CapitalPool[] }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Basic Information
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Enter the basic details of your trade
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Trade Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Trade Type</Label>
            {form.watch('instrument') === 'EQUITY' ? (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Positional (Running Trade)
                  </span>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Equity positions are always running trades (positional)
                </p>
              </div>
            ) : (
              <RadioGroup
                value={form.watch('tradeType')}
                onValueChange={(value) => form.setValue('tradeType', value as 'INTRADAY' | 'POSITIONAL')}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="INTRADAY" id="intraday" />
                  <Label htmlFor="intraday" className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Intraday (Same Day)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="POSITIONAL" id="positional" />
                  <Label htmlFor="positional" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    Positional (Multi-day)
                  </Label>
                </div>
              </RadioGroup>
            )}
          </div>

          {/* Entry Date & Time */}
          <div className="space-y-2">
            <DateTimePicker
              label="Entry Date & Time"
              value={form.watch('entryDate')}
              onChange={(date) => form.setValue('entryDate', date)}
              placeholder="Select entry date and time"
            />
          </div>

          {/* Symbol/Ticker */}
          <div className="space-y-2">
            <Label htmlFor="symbol">Symbol/Ticker</Label>
            <SymbolSearchInput
              value={form.watch('symbol') || ''}
              onChange={(value) => form.setValue('symbol', value)}
              placeholder="e.g., RELIANCE, NIFTY50"
              className="w-full"
            />
          </div>

          {/* Instrument Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Instrument Type</Label>
            <RadioGroup
              value={form.watch('instrument')}
              onValueChange={(value) => form.setValue('instrument', value as 'EQUITY' | 'FUTURES' | 'OPTIONS')}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="EQUITY" id="equity" />
                <Label htmlFor="equity" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Equity
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="FUTURES" id="futures" />
                <Label htmlFor="futures" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Futures
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="OPTIONS" id="options" />
                <Label htmlFor="options" className="flex items-center gap-2">
                  <LineChart className="w-4 h-4" />
                  Options
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Capital Pool Selection */}
          <div className="space-y-2">
            <Label htmlFor="capitalPool">Capital Pool</Label>
            <Select
              value={form.watch('capitalPoolId')}
              onValueChange={(value) => form.setValue('capitalPoolId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select capital pool" />
              </SelectTrigger>
              <SelectContent>
                {pools.map((pool) => (
                  <SelectItem key={pool.id} value={pool.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{pool.name}</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        ₹{pool.currentAmount.toLocaleString()}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.capitalPoolId && (
              <p className="text-sm text-red-500">{form.formState.errors.capitalPoolId.message}</p>
            )}
          </div>

          {/* Options Specific Fields */}
          {form.watch('instrument') === 'OPTIONS' && (
            <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Options Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="optionType">Option Type</Label>
                  <RadioGroup
                    value={form.watch('optionType') || 'CALL'}
                    onValueChange={(value) => form.setValue('optionType', value as 'CALL' | 'PUT')}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="CALL" id="call" />
                      <Label htmlFor="call" className="text-green-600 font-medium">CALL</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PUT" id="put" />
                      <Label htmlFor="put" className="text-red-600 font-medium">PUT</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="strikePrice">Strike Price (₹)</Label>
                  <Input
                    id="strikePrice"
                    type="number"
                    step="0.05"
                    placeholder="25000"
                    {...form.register('strikePrice', { valueAsNumber: true })}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={(() => {
                      const date = form.watch('expiryDate')
                      if (!date) return ''
                      const dateObj = new Date(date)
                      if (isNaN(dateObj.getTime())) return ''
                      return dateObj.toISOString().slice(0, 10)
                    })()}
                    onChange={(e) => form.setValue('expiryDate', new Date(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lotSize">Lot Size</Label>
                  <Input
                    id="lotSize"
                    type="number"
                    placeholder="75"
                    {...form.register('lotSize', { valueAsNumber: true })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Position Direction */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Position Direction</Label>
            <RadioGroup
              value={form.watch('position')}
              onValueChange={(value) => form.setValue('position', value as 'BUY' | 'SELL')}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="BUY" id="buy" />
                <Label htmlFor="buy" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Buy/Long
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="SELL" id="sell" />
                <Label htmlFor="sell" className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  Sell/Short
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="100"
              {...form.register('quantity', { valueAsNumber: true })}
              className="w-full"
            />
          </div>

          {/* Entry Price */}
          <div className="space-y-2">
            <Label htmlFor="entryPrice">Entry Price (₹)</Label>
            <Input
              id="entryPrice"
              type="number"
              step="0.01"
              placeholder="2450.50"
              {...form.register('entryPrice', { valueAsNumber: true })}
              className="w-full"
            />
          </div>

          {/* LTP Price - Only for Equity */}
          {form.watch('instrument') === 'EQUITY' && (
            <div className="space-y-2">
              <Label htmlFor="ltpPrice">LTP (Last Traded Price) (₹)</Label>
              <Input
                id="ltpPrice"
                type="number"
                step="0.01"
                placeholder="210.00"
                {...form.register('ltpPrice', { valueAsNumber: true })}
                className="w-full"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Current market price for unrealized P&L calculation
              </p>
            </div>
          )}

          {/* Exit Date & Time - Only for Intraday trades (not for equity running trades) */}
          {form.watch('tradeType') === 'INTRADAY' && form.watch('instrument') !== 'EQUITY' && (
            <div className="space-y-2">
              <DateTimePicker
                label="Exit Date & Time"
                value={form.watch('exitDate')}
                onChange={(date) => form.setValue('exitDate', date)}
                placeholder="Select exit date and time"
              />
            </div>
          )}

          {/* Exit Price - Only for Intraday trades (not for equity running trades) */}
          {form.watch('tradeType') === 'INTRADAY' && form.watch('instrument') !== 'EQUITY' && (
            <div className="space-y-2">
              <Label htmlFor="exitPrice">Exit Price (₹)</Label>
              <Input
                id="exitPrice"
                type="number"
                step="0.01"
                placeholder="2485.75"
                {...form.register('exitPrice', { valueAsNumber: true })}
                className="w-full"
              />
            </div>
          )}

          {/* Running Trade Info for Equity */}
          {form.watch('instrument') === 'EQUITY' && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-900 dark:text-green-100">
                  Running Trade
                </span>
              </div>
              <p className="text-xs text-green-700 dark:text-green-300">
                This is a running equity position. P&L is calculated using LTP (Last Traded Price). 
                Exit details will be added when the position is closed.
              </p>
            </div>
          )}

          {/* Hedge Position Toggle - Show for Options */}
          {form.watch('instrument') === 'OPTIONS' && (
            <div className="space-y-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasHedgePosition"
                  checked={form.watch('hasHedgePosition') || false}
                  onChange={(e) => {
                    form.setValue('hasHedgePosition', e.target.checked)
                    if (e.target.checked) {
                      // Auto-set opposite option type
                      const mainOptionType = form.watch('optionType')
                      const oppositeOptionType = mainOptionType === 'CALL' ? 'PUT' : 'CALL'
                      form.setValue('hedgeOptionType', oppositeOptionType)
                      
                      // Auto-set same dates as main trade
                      form.setValue('hedgeEntryDate', form.watch('entryDate'))
                      form.setValue('hedgeExitDate', form.watch('exitDate'))
                      
                      // Auto-set same quantity as main trade
                      form.setValue('hedgeQuantity', form.watch('quantity'))
                    }
                  }}
                  className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <Label htmlFor="hasHedgePosition" className="font-medium text-orange-900 dark:text-orange-100">
                  Add Hedge Position (Opposite option to hedge the main trade)
                </Label>
              </div>
              
              {form.watch('hasHedgePosition') && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hedgeOptionType">Hedge Option Type</Label>
                      <RadioGroup
                        value={form.watch('hedgeOptionType')}
                        onValueChange={(value) => form.setValue('hedgeOptionType', value as 'CALL' | 'PUT')}
                        className="flex gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="CALL" id="hedge-call" />
                          <Label htmlFor="hedge-call" className="text-green-600 font-medium">CALL</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="PUT" id="hedge-put" />
                          <Label htmlFor="hedge-put" className="text-red-600 font-medium">PUT</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label htmlFor="hedgeQuantity">Hedge Quantity</Label>
                      <Input
                        id="hedgeQuantity"
                        type="number"
                        placeholder="225"
                        {...form.register('hedgeQuantity', {
                          setValueAs: (value) => value === '' ? undefined : Number(value)
                        })}
                        className="w-full mt-2"
                      />
                    </div>
                    <div>
                      <DateTimePicker
                        label="Hedge Entry Date & Time"
                        value={form.watch('hedgeEntryDate')}
                        onChange={(date) => form.setValue('hedgeEntryDate', date)}
                        placeholder="Select hedge entry date and time"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hedgeEntryPrice">Hedge Entry Price (₹)</Label>
                      <Input
                        id="hedgeEntryPrice"
                        type="number"
                        step="0.01"
                        placeholder="2450.50"
                        {...form.register('hedgeEntryPrice', {
                          setValueAs: (value) => value === '' ? undefined : Number(value)
                        })}
                        className="w-full mt-2"
                      />
                    </div>
                    <div>
                      <DateTimePicker
                        label="Hedge Exit Date & Time"
                        value={form.watch('hedgeExitDate')}
                        onChange={(date) => form.setValue('hedgeExitDate', date)}
                        placeholder="Select hedge exit date and time"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hedgeExitPrice">Hedge Exit Price (₹)</Label>
                      <Input
                        id="hedgeExitPrice"
                        type="number"
                        step="0.01"
                        placeholder="2485.75"
                        {...form.register('hedgeExitPrice', {
                          setValueAs: (value) => value === '' ? undefined : Number(value)
                        })}
                        className="w-full mt-2"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RiskManagementStep({ form }: { form: ReturnType<typeof useForm<TradeFormSchema>> }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Risk Management
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Set your stop loss and target levels
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Stop Loss */}
          <div className="space-y-2">
            <Label htmlFor="stopLoss">Stop Loss (₹)</Label>
            <Input
              id="stopLoss"
              type="number"
              step="0.01"
              placeholder="2400.00"
              {...form.register('stopLoss', { valueAsNumber: true })}
              className="w-full"
            />
          </div>

          {/* Target */}
          <div className="space-y-2">
            <Label htmlFor="target">Target (₹)</Label>
            <Input
              id="target"
              type="number"
              step="0.01"
              placeholder="2500.00"
              {...form.register('target', { valueAsNumber: true })}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-8">
          {/* Confidence Level */}
          <div className="space-y-2">
            <Label htmlFor="confidenceLevel">Confidence Level (1-10)</Label>
            <Input
              id="confidenceLevel"
              type="number"
              min="1"
              max="10"
              placeholder="8"
              {...form.register('confidenceLevel', { valueAsNumber: true })}
              className="w-full"
            />
          </div>

          {/* Market Condition */}
        <div className="space-y-2">
          <Label htmlFor="marketCondition">Market Condition</Label>
          <Select
            value={form.watch('marketCondition') || 'Bullish'}
            onValueChange={(value) => form.setValue('marketCondition', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select market condition" />
            </SelectTrigger>
            <SelectContent>
              {tradeData.marketConditions.map((condition) => (
                <SelectItem key={condition.id} value={condition.name}>
                  <div className="flex items-center gap-2">
                    <span>{condition.icon}</span>
                    <span>{condition.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        </div>
      </div>
    </div>
  )
}

function StrategyPsychologyStep({ form }: { form: ReturnType<typeof useForm<TradeFormSchema>> }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Strategy & Psychology
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Add strategy tags and emotional state
        </p>
      </div>

      <div className="space-y-6">
        {/* Emotional State */}
        <div className="space-y-2">
          <Label htmlFor="emotionalState">Emotional State</Label>
          <Select
            value={form.watch('emotionalState') || 'Confident'}
            onValueChange={(value) => form.setValue('emotionalState', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select emotional state" />
            </SelectTrigger>
            <SelectContent>
              {tradeData.emotionalStates.map((emotion) => (
                <SelectItem key={emotion.id} value={emotion.name}>
                  <div className="flex items-center gap-2">
                    <span>{emotion.icon}</span>
                    <span>{emotion.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Strategy Tags */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Strategy Tags</Label>
          <div className="flex flex-wrap gap-2">
            {tradeData.strategyTags.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className={`cursor-pointer transition-all duration-200 ${
                  (form.watch('strategyTagIds') || []).includes(tag.name)
                    ? `${tag.color} border-2 shadow-md`
                    : `bg-gray-50 border-gray-300 text-gray-700 hover:${tag.hoverColor}`
                }`}
                onClick={() => {
                  const currentTags = form.watch('strategyTagIds') || []
                  const newTags = currentTags.includes(tag.name)
                    ? currentTags.filter((t: string) => t !== tag.name)
                    : [...currentTags, tag.name]
                  form.setValue('strategyTagIds', newTags)
                }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Planning Section */}
        <div className="space-y-2">
          <Label htmlFor="planning">Pre-Trade Planning</Label>
          <Textarea
            id="planning"
            placeholder="What was your plan before entering this trade? What were your expectations, analysis, and reasoning?"
            rows={4}
            {...form.register('planning')}
            className="w-full"
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Add any additional notes about this trade..."
            rows={4}
            {...form.register('notes')}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}

function ReviewStep({ form, calculations }: { 
  form: ReturnType<typeof useForm<TradeFormSchema>>; 
  calculations: {
    entryValue: number
    exitValue: number
    turnover: number
    grossPnl: number
    netPnl: number
    totalCharges: number
    percentageReturn: number
    investedCapital: number
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
}) {
  const formData = form.getValues()

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Review & Save
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Review your trade details before saving
        </p>
      </div>

      <div className="space-y-12">
        {/* Trade Summary Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Trade Summary</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Trade Type</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {formData.tradeType}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Symbol</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{formData.symbol}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Instrument</span>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {formData.instrument}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Position</span>
                <Badge variant="outline" className={`${formData.position === 'BUY' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {formData.position}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Quantity</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{formData.quantity}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Entry Price</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">₹{formData.entryPrice}</span>
              </div>
              {formData.exitPrice && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Exit Price</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">₹{formData.exitPrice}</span>
                </div>
              )}
              {formData.instrument === 'OPTIONS' && (
                <>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Option Type</span>
                    <Badge variant="outline" className={`${formData.optionType === 'CALL' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {formData.optionType}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Strike Price</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">₹{formData.strikePrice}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Lot Size</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{formData.lotSize}</span>
                  </div>
                  {formData.expiryDate && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Expiry Date</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{new Date(formData.expiryDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="w-full h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700"></div>

        {/* Risk & Psychology Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Risk & Psychology</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {formData.stopLoss && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Stop Loss</span>
                  <span className="font-bold text-red-600">₹{formData.stopLoss}</span>
                </div>
              )}
              {formData.target && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Target</span>
                  <span className="font-bold text-green-600">₹{formData.target}</span>
                </div>
              )}
              {formData.confidenceLevel && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Confidence</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(formData.confidenceLevel / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{formData.confidenceLevel}/10</span>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {formData.marketCondition && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Market</span>
                  {(() => {
                    const condition = tradeData.marketConditions.find(c => c.name === formData.marketCondition)
                    return (
                      <Badge variant="outline" className={`${condition?.color || 'bg-gray-50 text-gray-700 border-gray-200'} flex items-center gap-1`}>
                        <span>{condition?.icon}</span>
                        <span>{formData.marketCondition}</span>
                      </Badge>
                    )
                  })()}
                </div>
              )}
              {formData.emotionalState && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Emotion</span>
                  {(() => {
                    const emotion = tradeData.emotionalStates.find(e => e.name === formData.emotionalState)
                    return (
                      <Badge variant="outline" className={`${emotion?.color || 'bg-gray-50 text-gray-700 border-gray-200'} flex items-center gap-1`}>
                        <span>{emotion?.icon}</span>
                        <span>{formData.emotionalState}</span>
                      </Badge>
                    )
                  })()}
                </div>
              )}
              {formData.strategyTagIds && formData.strategyTagIds.length > 0 && (
                <div className="space-y-3">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Strategy Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {formData.strategyTagIds.map((tagId: string, index: number) => {
                      const tagData = tradeData.strategyTags.find(t => t.id === tagId)
                      return (
                        <Badge 
                          key={`strategy-${tagId}-${index}`} 
                          variant="secondary" 
                          className={`${tagData?.color || 'bg-gray-100 text-gray-800 border-gray-200'} hover:${tagData?.hoverColor || 'hover:bg-gray-200'} transition-colors`}
                        >
                          {tagData?.name || tagId}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="w-full h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700"></div>

        {/* P&L Summary Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">P&L Summary</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Entry Value</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">₹{(calculations.entryValue || 0).toLocaleString()}</span>
              </div>
              {formData.instrument === 'EQUITY' && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Invested Capital</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">₹{(calculations.investedCapital || 0).toLocaleString()}</span>
                </div>
              )}
              {calculations.exitValue > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Exit Value</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">₹{(calculations.exitValue || 0).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Turnover</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">₹{(calculations.turnover || 0).toLocaleString()}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Total Charges</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">₹{(calculations.totalCharges || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Gross P&L</span>
                <span className={`font-bold text-lg ${(calculations.grossPnl || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {(calculations.grossPnl || 0) >= 0 ? '+' : ''}₹{(calculations.grossPnl || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Net P&L</span>
                <span className={`font-bold text-xl ${(calculations.netPnl || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {(calculations.netPnl || 0) >= 0 ? '+' : ''}₹{(calculations.netPnl || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Return %</span>
                <span className={`font-bold text-xl ${(calculations.percentageReturn || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {(calculations.percentageReturn || 0) >= 0 ? '+' : ''}{(calculations.percentageReturn || 0).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Planning and Notes Section */}
      {(formData.planning || formData.notes) && (
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {formData.planning && (
            <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-300">
              <div className="p-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Pre-Trade Planning</h3>
                </div>
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{formData.planning}</p>
                </div>
              </div>
            </Card>
          )}
          {formData.notes && (
            <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-300">
              <div className="p-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Notes</h3>
                </div>
                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{formData.notes}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

function BehavioralAnalysisStep({ form }: { form: ReturnType<typeof useForm<TradeFormSchema>> }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Behavioral Analysis
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Reflect on your trading behavior and psychology (optional)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Management Behavior */}
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg border border-white/20">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Risk Management
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="followedRiskReward"
                  {...form.register('followedRiskReward')}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="followedRiskReward" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Followed planned risk-reward ratio
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="followedIntradayHunter"
                  {...form.register('followedIntradayHunter')}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="followedIntradayHunter" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Followed intraday hunter strategy
                </Label>
              </div>
            </div>
          </div>
        </Card>

        {/* Trading Discipline */}
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg border border-white/20">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Trading Discipline
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="overtrading"
                  {...form.register('overtrading')}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <Label htmlFor="overtrading" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Avoided overtrading
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="waitedForRetracement"
                  {...form.register('waitedForRetracement')}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <Label htmlFor="waitedForRetracement" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Waited for proper retracement
                </Label>
              </div>
            </div>
          </div>
        </Card>

        {/* Patience & Timing */}
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg border border-white/20">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Patience & Timing
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hadPatienceWhileExiting"
                  {...form.register('hadPatienceWhileExiting')}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                />
                <Label htmlFor="hadPatienceWhileExiting" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Had patience while exiting trade
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="tradedAgainstTrend"
                  {...form.register('tradedAgainstTrend')}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                />
                <Label htmlFor="tradedAgainstTrend" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Traded against market trend
                </Label>
              </div>
            </div>
          </div>
        </Card>

        {/* Emotional State */}
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg border border-white/20">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-red-600" />
              Emotional State
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showedGreed"
                  {...form.register('showedGreed')}
                  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                />
                <Label htmlFor="showedGreed" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Showed greed in this trade
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showedFear"
                  {...form.register('showedFear')}
                  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                />
                <Label htmlFor="showedFear" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Showed fear in this trade
                </Label>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Enhanced Psychology Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Physical & Mental State */}
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg border border-white/20">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-600" />
              Physical & Mental State
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Sleep Quality (1-10)
                </Label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  {...form.register('sleepQuality', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Energy Level (1-10)
                </Label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  {...form.register('energyLevel', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Stress Level (1-10)
                </Label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  {...form.register('stressLevel', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Focus Level (1-10)
                </Label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  {...form.register('focusLevel', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  FOMO Level (1-10)
                </Label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  {...form.register('fomoLevel', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Market Context & External Factors */}
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg border border-white/20">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Market Context & External Factors
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Market Sentiment
                </Label>
                <select
                  {...form.register('marketSentiment')}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="Bullish">🐂 Bullish</option>
                  <option value="Bearish">🐻 Bearish</option>
                  <option value="Neutral">😐 Neutral</option>
                  <option value="Volatile">⚡ Volatile</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  News Impact
                </Label>
                <select
                  {...form.register('newsImpact')}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="Positive">📈 Positive</option>
                  <option value="Negative">📉 Negative</option>
                  <option value="Neutral">➡️ Neutral</option>
                  <option value="Mixed">🔄 Mixed</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Pre-Trade Mood
                </Label>
                <select
                  {...form.register('preTradeMood')}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="Excited">😄 Excited</option>
                  <option value="Calm">😌 Calm</option>
                  <option value="Anxious">😰 Anxious</option>
                  <option value="Confident">💪 Confident</option>
                  <option value="Frustrated">😤 Frustrated</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Post-Trade Mood
                </Label>
                <select
                  {...form.register('postTradeMood')}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="Satisfied">😊 Satisfied</option>
                  <option value="Regretful">😔 Regretful</option>
                  <option value="Neutral">😐 Neutral</option>
                  <option value="Proud">🎉 Proud</option>
                  <option value="Disappointed">😞 Disappointed</option>
                </select>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Trading Behavior & Decision Making */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Analysis */}
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg border border-white/20">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Time Analysis
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Analysis Time (minutes)
                </Label>
                <input
                  type="number"
                  min="1"
                  {...form.register('analysisTime', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Decision Time (minutes)
                </Label>
                <input
                  type="number"
                  min="1"
                  {...form.register('decisionTime', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Practice & External Factors */}
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg border border-white/20">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              Practice & External Factors
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="meditationPractice"
                  {...form.register('meditationPractice')}
                  className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                />
                <Label htmlFor="meditationPractice" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Did you meditate today?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="internetIssues"
                  {...form.register('internetIssues')}
                  className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                />
                <Label htmlFor="internetIssues" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Faced internet connectivity issues?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="socialMediaInfluence"
                  {...form.register('socialMediaInfluence')}
                  className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                />
                <Label htmlFor="socialMediaInfluence" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Influenced by social media/news
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="learningFromMistakes"
                  {...form.register('learningFromMistakes')}
                  className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                />
                <Label htmlFor="learningFromMistakes" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Learned from previous mistakes
                </Label>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Emotional Trading Patterns */}
      <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg border border-white/20">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <HeartCrack className="h-5 w-5 text-red-600" />
            Emotional Trading Patterns
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="revengeTrading"
                {...form.register('revengeTrading')}
                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
              />
              <Label htmlFor="revengeTrading" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Revenge Trading
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="impulsiveTrading"
                {...form.register('impulsiveTrading')}
                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
              />
              <Label htmlFor="impulsiveTrading" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Impulsive Trading
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="overconfidence"
                {...form.register('overconfidence')}
                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
              />
              <Label htmlFor="overconfidence" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Overconfident
              </Label>
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Reflection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg border border-white/20">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              Strategy Deviation Reason
            </h3>
            <Textarea
              {...form.register('strategyDeviation')}
              placeholder="If you deviated from your strategy, what was the reason? (e.g., market conditions, emotions, news, etc.)"
              className="min-h-[80px] resize-none border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </Card>

        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg border border-white/20">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Emotional Triggers
            </h3>
            <Textarea
              {...form.register('emotionalTriggers')}
              placeholder="What triggered your emotions during this trade? (e.g., news, social media, previous losses, etc.)"
              className="min-h-[80px] resize-none border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </Card>
      </div>

      <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg border border-white/20">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Coping Mechanisms
          </h3>
          <Textarea
            {...form.register('copingMechanisms')}
            placeholder="How did you cope with stress or negative emotions during this trade? (e.g., deep breathing, taking breaks, etc.)"
            className="min-h-[80px] resize-none border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </Card>

      {/* Psychology Notes */}
      <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg border border-white/20">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            Additional Psychology Notes
          </h3>
          <Textarea
            {...form.register('psychologyNotes')}
            placeholder="Reflect on your emotional state, decision-making process, and any behavioral patterns you noticed..."
            className="min-h-[120px] resize-none border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </Card>
    </div>
  )
}
