'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  Filter,
  Download,
  Plus,
  Search,
  Loader2,
  LogOut
} from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/utils/calculations'
import { useTrades } from '@/hooks/useTrades'
import { ExitTradeModal } from './ExitTradeModal'
import { Trade } from '@/types/trade'
import { TradeDetails } from '@/types/tradeDetails'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function TradesTable() {
  const router = useRouter()
  const {
    trades,
    loading,
    error,
    pagination,
    refetch,
    deleteTrade,
    deleteTrades,
    setFilters
  } = useTrades()
  
  
  const [selectedTrades, setSelectedTrades] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [exitModalOpen, setExitModalOpen] = useState(false)
  const [selectedTradeForExit, setSelectedTradeForExit] = useState<TradeDetails | null>(null)
  const [isExiting, setIsExiting] = useState(false)

  // Update search filter when search query changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters({ search: searchQuery || undefined })
    }, 500) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchQuery, setFilters])

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
    setFilters({ sortBy: key, sortOrder: direction })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTrades(trades.map(trade => trade.id))
    } else {
      setSelectedTrades([])
    }
  }

  const handleSelectTrade = (tradeId: string, checked: boolean) => {
    if (checked) {
      setSelectedTrades([...selectedTrades, tradeId])
    } else {
      setSelectedTrades(selectedTrades.filter(id => id !== tradeId))
    }
  }

  const handleDeleteTrade = async (tradeId: string) => {
    setIsDeleting(tradeId)
    try {
      await deleteTrade(tradeId)
      setSelectedTrades(prev => prev.filter(id => id !== tradeId))
    } catch (error) {
      console.error('Failed to delete trade:', error)
    } finally {
      setIsDeleting(null)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedTrades.length === 0) return
    
    setIsDeleting('bulk')
    try {
      await deleteTrades(selectedTrades)
      setSelectedTrades([])
    } catch (error) {
      console.error('Failed to delete trades:', error)
    } finally {
      setIsDeleting(null)
    }
  }

  const handleTradeClick = (tradeId: string) => {
    router.push(`/trades/${tradeId}`)
  }

  // Helper function to convert Trade to TradeDetails
  const convertTradeToDetails = (trade: Trade): TradeDetails => {
    return {
      id: trade.id,
      tradeType: trade.tradeType || 'INTRADAY',
      symbol: trade.symbol,
      instrument: trade.instrument || 'EQUITY',
      position: trade.position || 'BUY',
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
      confidenceLevel: trade.confidenceLevel || undefined,
      emotionalState: trade.emotionalState || undefined,
      marketCondition: trade.marketCondition || undefined,
      planning: trade.planning || undefined,
      notes: trade.notes || undefined,
      brokerName: trade.brokerName || undefined,
      customBrokerage: trade.customBrokerage || false,
      brokerageType: trade.brokerageType || undefined,
      brokerageValue: trade.brokerageValue || undefined,
      isDraft: trade.isDraft || false,
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
        position: trade.hedgePosition.position, // Keep the original position field
        optionType: trade.hedgePosition.position === 'BUY' ? 'CALL' : 'PUT', // Convert position to option type
        entryDate: typeof trade.hedgePosition.entryDate === 'string' ? trade.hedgePosition.entryDate : trade.hedgePosition.entryDate.toISOString(),
        exitDate: trade.hedgePosition.exitDate ? (typeof trade.hedgePosition.exitDate === 'string' ? trade.hedgePosition.exitDate : trade.hedgePosition.exitDate.toISOString()) : undefined,
        entryPrice: trade.hedgePosition.entryPrice,
        exitPrice: trade.hedgePosition.exitPrice || undefined,
        quantity: trade.hedgePosition.quantity,
        entryValue: trade.hedgePosition.entryValue,
        exitValue: trade.hedgePosition.exitValue || undefined,
        grossPnl: trade.hedgePosition.grossPnl || undefined,
        netPnl: trade.hedgePosition.netPnl || undefined,
        totalCharges: trade.hedgePosition.totalCharges || undefined,
        percentageReturn: trade.hedgePosition.percentageReturn || undefined,
        notes: trade.hedgePosition.notes || undefined,
        charges: trade.hedgePosition.charges || []
      } : undefined,
      charges: trade.charges ? (
        Array.isArray(trade.charges) 
          ? trade.charges.map(charge => ({
              id: charge.id,
              tradeId: charge.tradeId,
              chargeType: charge.chargeType as 'BROKERAGE' | 'STT' | 'EXCHANGE' | 'SEBI' | 'STAMP_DUTY' | 'GST',
              rate: charge.rate,
              baseAmount: charge.baseAmount,
              amount: charge.amount,
              description: charge.description || undefined,
              createdAt: typeof charge.createdAt === 'string' ? charge.createdAt : charge.createdAt.toISOString()
            }))
          : trade.charges
      ) : undefined,
      strategyTags: trade.strategyTags?.map(st => ({
        id: st.strategyTagId,
        name: st.strategyTag.name,
        color: st.strategyTag.color,
        description: st.strategyTag.description || undefined
      })) || undefined,
      emotionalTags: trade.emotionalTags?.map(et => ({
        id: et.emotionalTagId,
        name: et.emotionalTag.name,
        color: et.emotionalTag.color,
        description: et.emotionalTag.description || undefined
      })) || undefined,
      marketTags: trade.marketTags?.map(mt => ({
        id: mt.marketTagId,
        name: mt.marketTag.name,
        color: mt.marketTag.color,
        description: mt.marketTag.description || undefined
      })) || undefined,
      attachments: trade.attachments?.map(att => ({
        id: att.id,
        fileName: att.fileName,
        filePath: att.filePath,
        fileSize: att.fileSize,
        fileType: att.fileType,
        createdAt: typeof att.createdAt === 'string' ? att.createdAt : att.createdAt.toISOString()
      })) || undefined
    }
  }

  const handleExitTrade = (trade: Trade) => {
    setSelectedTradeForExit(convertTradeToDetails(trade))
    setExitModalOpen(true)
  }

  const handleExitConfirm = async (exitPrice: number, exitDate: Date) => {
    if (!selectedTradeForExit) return

    setIsExiting(true)
    try {
      const response = await fetch(`/api/trades/${selectedTradeForExit.id}/exit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exitPrice,
          exitDate: exitDate.toISOString(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to exit trade')
      }

      // Refresh trades data
      await refetch()
      
      // Close modal
      setExitModalOpen(false)
      setSelectedTradeForExit(null)
    } catch (error) {
      console.error('Failed to exit trade:', error)
      // You might want to show a toast notification here
    } finally {
      setIsExiting(false)
    }
  }

  // Calculate summary metrics
  const totalTrades = trades.length
  const closedTrades = trades.filter(trade => trade.exitPrice).length
  
  const totalNetPnl = trades.reduce((sum, trade) => {
    if (trade.exitPrice && trade.charges) {
      const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
      const chargesTotal = Array.isArray(trade.charges) 
        ? trade.charges.reduce((acc, charge) => acc + charge.amount, 0)
        : trade.charges.total
      return sum + grossPnl - chargesTotal
    }
    return sum
  }, 0)

  const winningTrades = trades.filter(trade => {
    if (!trade.exitPrice || !trade.charges) return false
    const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1)
    const chargesTotal = Array.isArray(trade.charges) 
      ? trade.charges.reduce((acc, charge) => acc + charge.amount, 0)
      : trade.charges.total
    return grossPnl - chargesTotal > 0
  }).length

  const winRate = closedTrades > 0 ? (winningTrades / closedTrades) * 100 : 0
  const avgTrade = closedTrades > 0 ? totalNetPnl / closedTrades : 0

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading trades...</span>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-destructive">Error: {error}</div>
        <Button onClick={refetch} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trade Journal</h1>
          <p className="text-muted-foreground">
            Track and analyze your trading performance
          </p>
        </div>
        <Link href="/trades/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Trade
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 backdrop-blur-sm bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-gray-800/90 dark:to-gray-900/90 border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Trades</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalTrades}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">T</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 backdrop-blur-sm bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-gray-800/90 dark:to-gray-900/90 border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Net P&L</p>
              <p className={`text-2xl font-bold ${totalNetPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {totalNetPnl >= 0 ? '+' : ''}{formatCurrency(totalNetPnl)}
              </p>
            </div>
            <div className={`h-8 w-8 rounded-full ${totalNetPnl >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'} flex items-center justify-center`}>
              <span className={`font-bold text-sm ${totalNetPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>₹</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 backdrop-blur-sm bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-gray-800/90 dark:to-gray-900/90 border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatPercentage(winRate)}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">%</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 backdrop-blur-sm bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-gray-800/90 dark:to-gray-900/90 border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Trade</p>
              <p className={`text-2xl font-bold ${avgTrade >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {avgTrade >= 0 ? '+' : ''}{formatCurrency(avgTrade)}
              </p>
            </div>
            <div className={`h-8 w-8 rounded-full ${avgTrade >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'} flex items-center justify-center`}>
              <span className={`font-bold text-sm ${avgTrade >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={selectedTrades.length === trades.length && trades.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-muted-foreground">Select All</span>
          </div>

          {selectedTrades.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedTrades.length} selected
              </span>
              <Button variant="outline" size="sm">
                Bulk Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBulkDelete}
                disabled={isDeleting === 'bulk'}
              >
                {isDeleting === 'bulk' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete Selected
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search trades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Trades Table */}
      <div className="rounded-xl border backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 dark:border-gray-700/50 shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-700 border-b border-slate-200 dark:border-gray-600">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedTrades.length === trades.length && trades.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('entryDate')}
              >
                Entry Date
                {sortConfig?.key === 'entryDate' && (
                  <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('symbol')}
              >
                Symbol
                {sortConfig?.key === 'symbol' && (
                  <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Position</TableHead>
              <TableHead 
                className="text-right cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('quantity')}
              >
                Qty
                {sortConfig?.key === 'quantity' && (
                  <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </TableHead>
              <TableHead className="text-right">Entry ₹</TableHead>
              <TableHead className="text-right">Exit ₹</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead 
                className="text-right cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('grossPnl')}
              >
                Gross P&L
                {sortConfig?.key === 'grossPnl' && (
                  <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </TableHead>
              <TableHead className="text-right">Charges</TableHead>
              <TableHead 
                className="text-right cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('netPnl')}
              >
                Net P&L
                {sortConfig?.key === 'netPnl' && (
                  <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </TableHead>
              <TableHead>Strategy</TableHead>
              <TableHead>R:R</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade) => {
              const isOpen = !trade.exitPrice
              // Calculate main trade P&L
              const mainGrossPnl = trade.exitPrice ? 
                (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.position === 'BUY' ? 1 : -1) : 
                null
              
              // Calculate hedge position P&L if exists
              let hedgeGrossPnl = 0
              let hedgeCharges = 0
              if (trade.hedgePosition && trade.hedgePosition.exitPrice) {
                const hedgeEntryValue = trade.hedgePosition.entryPrice * trade.hedgePosition.quantity
                const hedgeExitValue = trade.hedgePosition.exitPrice * trade.hedgePosition.quantity
                
                if (trade.hedgePosition.position === 'BUY') {
                  hedgeGrossPnl = hedgeExitValue - hedgeEntryValue
                } else {
                  hedgeGrossPnl = hedgeEntryValue - hedgeExitValue
                }
                
                hedgeCharges = trade.hedgePosition.charges?.reduce((sum, charge) => sum + charge.amount, 0) || 0
              }
              
              // Combine main trade and hedge P&L
              const grossPnl = mainGrossPnl ? mainGrossPnl + hedgeGrossPnl : null
              const chargesTotal = trade.charges ? 
                (Array.isArray(trade.charges) 
                  ? trade.charges.reduce((acc, charge) => acc + charge.amount, 0)
                  : trade.charges.total) : 0
              const netPnl = grossPnl ? grossPnl - (chargesTotal + hedgeCharges) : null
              const percentageReturn = netPnl && trade.entryPrice ? 
                (netPnl / (trade.entryPrice * trade.quantity)) * 100 : null
              
              return (
                <TableRow 
                  key={trade.id}
                  className={`${selectedTrades.includes(trade.id) ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''} ${
                    isOpen ? 'border-l-4 border-l-orange-500' : ''
                  } cursor-pointer hover:bg-slate-50/50 dark:hover:bg-gray-700/50 transition-all duration-200 border-b border-slate-100 dark:border-gray-700`}
                  onClick={() => handleTradeClick(trade.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedTrades.includes(trade.id)}
                      onCheckedChange={(checked) => handleSelectTrade(trade.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(trade.entryDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">{trade.symbol}</span>
                      <span className="text-xs">
                        {trade.instrument === 'EQUITY' && '🏢'}
                        {trade.instrument === 'FUTURES' && '📊'}
                        {trade.instrument === 'OPTIONS' && '📈'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={
                        trade.instrument === 'EQUITY' ? 'bg-equity/10 text-equity' :
                        trade.instrument === 'FUTURES' ? 'bg-futures/10 text-futures' :
                        'bg-options/10 text-options'
                      }
                    >
                      {trade.instrument === 'EQUITY' ? 'EQ' :
                       trade.instrument === 'FUTURES' ? 'FUT' : 'OPT'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${
                      trade.position === 'BUY' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {trade.position}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{trade.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(trade.entryPrice)}</TableCell>
                  <TableCell className="text-right">
                    {trade.exitPrice ? formatCurrency(trade.exitPrice) : '--'}
                  </TableCell>
                  <TableCell>
                    {trade.exitDate ? 
                      `${Math.floor((new Date(trade.exitDate).getTime() - new Date(trade.entryDate).getTime()) / (1000 * 60 * 60))}h` : 
                      '--'
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    {grossPnl !== null ? (
                      <span className={`font-medium ${grossPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {grossPnl >= 0 ? '+' : ''}{formatCurrency(grossPnl)}
                      </span>
                    ) : '--'}
                  </TableCell>
                  <TableCell className="text-right">
                    {trade.charges ? formatCurrency(chargesTotal) : '--'}
                  </TableCell>
                  <TableCell className="text-right">
                    {netPnl !== null ? (
                      <div>
                        <div className={`font-bold ${netPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {netPnl >= 0 ? '+' : ''}{formatCurrency(netPnl)}
                        </div>
                        {percentageReturn !== null && (
                          <div className={`text-xs ${percentageReturn >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {percentageReturn >= 0 ? '+' : ''}{formatPercentage(percentageReturn)}
                          </div>
                        )}
                      </div>
                    ) : '--'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{trade.strategy || '--'}</Badge>
                  </TableCell>
                  <TableCell>
                    {trade.stopLoss && trade.target ? 
                      `1:${(trade.target / trade.stopLoss).toFixed(1)}` : 
                      '--'
                    }
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isDeleting === trade.id}>
                          {isDeleting === trade.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleTradeClick(trade.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {isOpen && (
                          <DropdownMenuItem 
                            onClick={() => handleExitTrade(trade)}
                            className="text-green-600 dark:text-green-400"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Exit Position
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteTrade(trade.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {trades.length} of {pagination.total} trades
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={pagination.page <= 1}
              onClick={() => setFilters({ page: pagination.page - 1 })}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={pagination.page >= pagination.pages}
              onClick={() => setFilters({ page: pagination.page + 1 })}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Exit Trade Modal */}
      <ExitTradeModal
        trade={selectedTradeForExit}
        isOpen={exitModalOpen}
        onClose={() => {
          setExitModalOpen(false)
          setSelectedTradeForExit(null)
        }}
        onExit={handleExitConfirm}
        isLoading={isExiting}
      />
    </div>
  )
}
