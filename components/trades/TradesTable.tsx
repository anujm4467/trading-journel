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
  Loader2
} from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/utils/calculations'
import { useTrades } from '@/hooks/useTrades'

export function TradesTable() {
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

  // Calculate summary metrics
  const totalTrades = trades.length
  const closedTrades = trades.filter(trade => trade.exitPrice).length
  
  const totalNetPnl = trades.reduce((sum, trade) => {
    if (trade.exitPrice && trade.charges) {
      const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.side === 'BUY' ? 1 : -1)
      return sum + grossPnl - trade.charges.total
    }
    return sum
  }, 0)

  const winningTrades = trades.filter(trade => {
    if (!trade.exitPrice || !trade.charges) return false
    const grossPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.side === 'BUY' ? 1 : -1)
    return grossPnl - trade.charges.total > 0
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
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Trade
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Trades</p>
              <p className="text-2xl font-bold">{totalTrades}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">T</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Net P&L</p>
              <p className={`text-2xl font-bold ${totalNetPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                {formatCurrency(totalNetPnl)}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-profit/10 flex items-center justify-center">
              <span className="text-profit font-bold text-sm">₹</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
              <p className="text-2xl font-bold">{formatPercentage(winRate)}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
              <span className="text-success font-bold text-sm">%</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Trade</p>
              <p className={`text-2xl font-bold ${avgTrade >= 0 ? 'text-profit' : 'text-loss'}`}>
                {formatCurrency(avgTrade)}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-info/10 flex items-center justify-center">
              <span className="text-info font-bold text-sm">A</span>
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
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
              const grossPnl = trade.exitPrice ? 
                (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.side === 'BUY' ? 1 : -1) : 
                null
              const netPnl = grossPnl && trade.charges ? grossPnl - trade.charges.total : null
              const percentageReturn = netPnl && trade.entryPrice ? 
                (netPnl / (trade.entryPrice * trade.quantity)) * 100 : null
              
              return (
                <TableRow 
                  key={trade.id}
                  className={`${selectedTrades.includes(trade.id) ? 'bg-muted/50' : ''} ${
                    isOpen ? 'border-l-4 border-l-warning' : ''
                  }`}
                >
                  <TableCell>
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
                        {trade.instrumentType === 'EQUITY' && '🏢'}
                        {trade.instrumentType === 'FUTURES' && '📊'}
                        {trade.instrumentType === 'OPTIONS' && '📈'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={
                        trade.instrumentType === 'EQUITY' ? 'bg-equity/10 text-equity' :
                        trade.instrumentType === 'FUTURES' ? 'bg-futures/10 text-futures' :
                        'bg-options/10 text-options'
                      }
                    >
                      {trade.instrumentType === 'EQUITY' ? 'EQ' :
                       trade.instrumentType === 'FUTURES' ? 'FUT' : 'OPT'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={
                      trade.side === 'BUY' 
                        ? 'text-profit font-medium' 
                        : 'text-loss font-medium'
                    }>
                      {trade.side}
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
                      <span className={grossPnl >= 0 ? 'text-profit font-medium' : 'text-loss font-medium'}>
                        {formatCurrency(grossPnl)}
                      </span>
                    ) : '--'}
                  </TableCell>
                  <TableCell className="text-right">
                    {trade.charges ? formatCurrency(trade.charges.total) : '--'}
                  </TableCell>
                  <TableCell className="text-right">
                    {netPnl !== null ? (
                      <div>
                        <div className={netPnl >= 0 ? 'text-profit font-bold' : 'text-loss font-bold'}>
                          {formatCurrency(netPnl)}
                        </div>
                        {percentageReturn !== null && (
                          <div className={`text-xs ${percentageReturn >= 0 ? 'text-profit' : 'text-loss'}`}>
                            {formatPercentage(percentageReturn)}
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
                  <TableCell>
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
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
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
    </div>
  )
}
