'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { TradeDetailsView } from '@/components/trades/TradeDetailsView'
import { useTrades } from '@/hooks/useTrades'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { TradeDetails } from '@/types/tradeDetails'
import { Trade } from '@/types/trade'

export default function TradeDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { getTradeById, deleteTrade } = useTrades()
  const [trade, setTrade] = useState<TradeDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const tradeId = params.id as string

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
        optionType: trade.hedgePosition.position as 'CALL' | 'PUT', // Assuming position maps to optionType
        quantity: trade.hedgePosition.quantity,
        entryPrice: trade.hedgePosition.entryPrice,
        exitPrice: trade.hedgePosition.exitPrice || undefined,
        entryDate: typeof trade.hedgePosition.entryDate === 'string' ? trade.hedgePosition.entryDate : trade.hedgePosition.entryDate.toISOString(),
        exitDate: trade.hedgePosition.exitDate ? (typeof trade.hedgePosition.exitDate === 'string' ? trade.hedgePosition.exitDate : trade.hedgePosition.exitDate.toISOString()) : undefined,
        entryValue: trade.hedgePosition.entryValue,
        exitValue: trade.hedgePosition.exitValue || undefined,
        grossPnl: trade.hedgePosition.grossPnl || undefined,
        netPnl: trade.hedgePosition.netPnl || undefined,
        notes: trade.hedgePosition.notes || undefined
      } : undefined
    }
  }

  useEffect(() => {
    const fetchTrade = async () => {
      try {
        setLoading(true)
        const tradeData = await getTradeById(tradeId)
        setTrade(convertTradeToDetails(tradeData))
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

  const handleDelete = async () => {
    if (!trade) return
    
    if (window.confirm('Are you sure you want to delete this trade? This action cannot be undone.')) {
      setIsDeleting(true)
      try {
        await deleteTrade(trade.id)
        router.push('/trades')
      } catch (err) {
        console.error('Error deleting trade:', err)
        alert('Failed to delete trade')
      } finally {
        setIsDeleting(false)
      }
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
              onClick={() => router.push('/trades')}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Trades
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Trade Details
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {trade.symbol} - {trade.instrument} - {trade.position}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link href={`/trades/${trade.id}/edit`}>
              <Button variant="outline" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Trade
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete Trade
            </Button>
          </div>
        </div>

        {/* Trade Details Content */}
        <TradeDetailsView trade={trade} />
      </div>
  )
}
