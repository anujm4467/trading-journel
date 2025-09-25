'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { TradeFormPage } from '@/components/forms/TradeFormPage'
import { useTrades } from '@/hooks/useTrades'
import { TradeFormData } from '@/types/trade'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Trade } from '@/types/trade'
import { TradeDetails } from '@/types/tradeDetails'

export default function EditTradePage() {
  const params = useParams()
  const router = useRouter()
  const { getTradeById, updateTrade } = useTrades()
  const [trade, setTrade] = useState<Trade | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tradeId = params.id as string

  useEffect(() => {
    const fetchTrade = async () => {
      try {
        setLoading(true)
        const tradeData = await getTradeById(tradeId)
        setTrade(tradeData)
      } catch (err) {
        setError('Failed to load trade details')
        console.error('Error fetching trade:', err)
      } finally {
        setLoading(false)
      }
    }

    if (tradeId) {
      fetchTrade()
    }
  }, [tradeId, getTradeById])

  const handleSave = async (data: TradeFormData) => {
    console.log('handleSave called in edit page with data:', data)
    if (!tradeId) {
      console.error('No tradeId available')
      return
    }
    
    setIsSubmitting(true)
    try {
      console.log('Calling updateTrade with tradeId:', tradeId)
      
      // Transform the data to match the Trade type
      const tradeData: Partial<Trade> = {
        ...data,
        hedgePosition: data.hedgePosition ? {
          id: '',
          tradeId: tradeId,
          position: data.hedgePosition,
          entryDate: data.hedgeEntryDate || new Date(),
          entryPrice: data.hedgeEntryPrice || 0,
          quantity: data.hedgeQuantity || 0,
          exitDate: data.hedgeExitDate || null,
          exitPrice: data.hedgeExitPrice || null,
          entryValue: (data.hedgeEntryPrice || 0) * (data.hedgeQuantity || 0),
          exitValue: data.hedgeExitPrice ? data.hedgeExitPrice * (data.hedgeQuantity || 0) : null,
          grossPnl: null,
          netPnl: null,
          createdAt: new Date(),
          updatedAt: new Date()
        } : null
      }
      
      await updateTrade(tradeId, tradeData)
      console.log('updateTrade completed successfully')
      router.push(`/trades/${tradeId}`)
    } catch (err) {
      console.error('Error updating trade:', err)
      alert('Failed to update trade')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = async (data: TradeFormData) => {
    if (!tradeId) return
    
    setIsSubmitting(true)
    try {
      // Transform the data to match the Trade type
      const tradeData: Partial<Trade> = {
        ...data,
        isDraft: true,
        hedgePosition: data.hedgePosition ? {
          id: '',
          tradeId: tradeId,
          position: data.hedgePosition,
          entryDate: data.hedgeEntryDate || new Date(),
          entryPrice: data.hedgeEntryPrice || 0,
          quantity: data.hedgeQuantity || 0,
          exitDate: data.hedgeExitDate || null,
          exitPrice: data.hedgeExitPrice || null,
          entryValue: (data.hedgeEntryPrice || 0) * (data.hedgeQuantity || 0),
          exitValue: data.hedgeExitPrice ? data.hedgeExitPrice * (data.hedgeQuantity || 0) : null,
          grossPnl: null,
          netPnl: null,
          createdAt: new Date(),
          updatedAt: new Date()
        } : null
      }
      
      await updateTrade(tradeId, tradeData)
      router.push(`/trades/${tradeId}`)
    } catch (err) {
      console.error('Error saving draft:', err)
      alert('Failed to save draft')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/trades/${tradeId}`)
  }

  // Convert Trade to TradeDetails format for the form
  const convertTradeToDetails = (trade: Trade): TradeDetails => {
    return {
      id: trade.id,
      tradeType: (trade.tradeType as 'INTRADAY' | 'POSITIONAL') || 'INTRADAY',
      symbol: trade.symbol,
      isDraft: trade.isDraft || false,
      instrument: (trade.instrument as 'EQUITY' | 'FUTURES' | 'OPTIONS') || 'EQUITY',
      position: (trade.position as 'BUY' | 'SELL') || 'BUY',
      quantity: trade.quantity,
      entryPrice: trade.entryPrice,
      exitPrice: trade.exitPrice || undefined,
      entryValue: trade.entryValue || trade.entryPrice * trade.quantity,
      exitValue: trade.exitValue || undefined,
      turnover: trade.turnover || (trade.entryValue || trade.entryPrice * trade.quantity) + (trade.exitValue || 0),
      grossPnl: trade.grossPnl || undefined,
      netPnl: trade.netPnl || undefined,
      totalCharges: trade.totalCharges || undefined,
      percentageReturn: trade.percentageReturn || undefined,
      entryDate: typeof trade.entryDate === 'string' ? trade.entryDate : trade.entryDate.toISOString(),
      exitDate: trade.exitDate ? (typeof trade.exitDate === 'string' ? trade.exitDate : trade.exitDate.toISOString()) : undefined,
      holdingDuration: trade.holdingDuration || undefined,
      createdAt: typeof trade.createdAt === 'string' ? trade.createdAt : trade.createdAt.toISOString(),
      updatedAt: typeof trade.updatedAt === 'string' ? trade.updatedAt : trade.updatedAt.toISOString(),
      stopLoss: trade.stopLoss || undefined,
      target: trade.target || undefined,
      riskAmount: trade.riskAmount || undefined,
      rewardAmount: trade.rewardAmount || undefined,
      riskRewardRatio: trade.riskRewardRatio || undefined,
      confidenceLevel: trade.confidenceLevel || trade.confidence || undefined,
      emotionalState: trade.emotionalState || undefined,
      marketCondition: trade.marketCondition || undefined,
      planning: trade.planning || undefined,
      notes: trade.notes || undefined,
      brokerName: trade.brokerName || undefined,
      customBrokerage: trade.customBrokerage || false,
      brokerageType: trade.brokerageType || undefined,
      brokerageValue: trade.brokerageValue || undefined,
      // Add other required fields with defaults
      charges: trade.charges ? (Array.isArray(trade.charges) ? trade.charges.filter(charge => 
        ['BROKERAGE', 'STT', 'EXCHANGE', 'SEBI', 'STAMP_DUTY', 'GST'].includes(charge.chargeType)
      ).map(charge => ({
        id: charge.id,
        tradeId: charge.tradeId,
        chargeType: charge.chargeType as 'BROKERAGE' | 'STT' | 'EXCHANGE' | 'SEBI' | 'STAMP_DUTY' | 'GST',
        rate: charge.rate,
        baseAmount: charge.baseAmount,
        amount: charge.amount,
        description: charge.description || undefined,
        createdAt: typeof charge.createdAt === 'string' ? charge.createdAt : charge.createdAt.toISOString()
      })) : trade.charges) : undefined,
      strategyTags: trade.strategyTags?.map(tag => ({
        id: tag.strategyTagId,
        name: tag.strategyTag?.name || '',
        color: tag.strategyTag?.color || 'bg-blue-100 text-blue-800',
        description: tag.strategyTag?.description || undefined
      })) || undefined,
      emotionalTags: trade.emotionalTags?.map(tag => ({
        id: tag.emotionalTagId,
        name: tag.emotionalTag?.name || '',
        color: tag.emotionalTag?.color || 'bg-purple-100 text-purple-800',
        description: tag.emotionalTag?.description || undefined
      })) || undefined,
      marketTags: trade.marketTags?.map(tag => ({
        id: tag.marketTagId,
        name: tag.marketTag?.name || '',
        color: tag.marketTag?.color || 'bg-orange-100 text-orange-800',
        description: tag.marketTag?.description || undefined
      })) || undefined,
      optionsTrade: trade.optionsTrade ? {
        id: trade.optionsTrade.id,
        optionType: trade.optionsTrade.optionType,
        strikePrice: trade.optionsTrade.strikePrice,
        expiryDate: typeof trade.optionsTrade.expiryDate === 'string' ? trade.optionsTrade.expiryDate : trade.optionsTrade.expiryDate.toISOString(),
        lotSize: trade.optionsTrade.lotSize,
        underlying: trade.optionsTrade.underlying
      } : undefined,
      hedgePosition: trade.hedgePosition ? {
        id: trade.hedgePosition.id,
        position: trade.hedgePosition.position, // Add position field
        optionType: trade.hedgePosition.position === 'BUY' ? 'CALL' : 'PUT', // Convert position to optionType
        quantity: trade.hedgePosition.quantity,
        entryPrice: trade.hedgePosition.entryPrice,
        exitPrice: trade.hedgePosition.exitPrice || undefined,
        entryDate: typeof trade.hedgePosition.entryDate === 'string' ? trade.hedgePosition.entryDate : trade.hedgePosition.entryDate.toISOString(),
        exitDate: trade.hedgePosition.exitDate ? (typeof trade.hedgePosition.exitDate === 'string' ? trade.hedgePosition.exitDate : trade.hedgePosition.exitDate.toISOString()) : undefined,
        entryValue: trade.hedgePosition.entryValue,
        exitValue: trade.hedgePosition.exitValue || undefined,
        grossPnl: trade.hedgePosition.grossPnl || undefined,
        netPnl: trade.hedgePosition.netPnl || undefined,
        notes: trade.hedgePosition.notes || undefined,
        charges: trade.hedgePosition.charges?.map(charge => ({
          id: charge.id,
          tradeId: charge.hedgeId, // Use hedgeId as tradeId for compatibility
          chargeType: charge.chargeType as 'BROKERAGE' | 'STT' | 'EXCHANGE' | 'SEBI' | 'STAMP_DUTY' | 'GST',
          rate: charge.rate,
          baseAmount: charge.baseAmount,
          amount: charge.amount,
          description: charge.description || undefined,
          createdAt: typeof charge.createdAt === 'string' ? charge.createdAt : charge.createdAt.toISOString()
        })) || []
      } : undefined
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading trade details...</span>
      </div>
    )
  }

  if (error || !trade) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-destructive">Error: {error || 'Trade not found'}</div>
        <Button onClick={() => router.push('/trades')} variant="outline">
          Back to Trades
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-6 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/trades/${trade.id}`)}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Trade Details
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Edit Trade
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {trade.symbol} - {trade.instrument} - {trade.position}
              </p>
            </div>
          </div>
        </div>

        {/* Trade Form */}
        <TradeFormPage
          initialData={trade ? convertTradeToDetails(trade) : undefined}
          isEdit={true}
          onSave={handleSave}
          onSaveDraft={handleSaveDraft}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
  )
}
