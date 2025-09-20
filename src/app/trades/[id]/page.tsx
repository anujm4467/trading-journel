'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { TradeDetailsView } from '@/components/trades/TradeDetailsView'
import { useTrades } from '@/hooks/useTrades'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { TradeDetails } from '@/types/tradeDetails'

export default function TradeDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { getTradeById, deleteTrade } = useTrades()
  const [trade, setTrade] = useState<TradeDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading trade details...</span>
        </div>
      </MainLayout>
    )
  }

  if (error || !trade) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-destructive">Error: {error || 'Trade not found'}</div>
          <Button onClick={() => router.push('/trades')} variant="outline">
            Back to Trades
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
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
    </MainLayout>
  )
}
