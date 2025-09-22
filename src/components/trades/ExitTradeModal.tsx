'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Calculator,
  TrendingUp,
  TrendingDown,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { formatCurrency, formatPercentage, calculateEquityPnL } from '@/utils/calculations'
import { TradeDetails } from '@/types/tradeDetails'

interface ExitTradeModalProps {
  trade: TradeDetails | null
  isOpen: boolean
  onClose: () => void
  onExit: (exitPrice: number, exitDate: Date) => Promise<void>
  isLoading?: boolean
}

export function ExitTradeModal({ 
  trade, 
  isOpen, 
  onClose, 
  onExit, 
  isLoading = false 
}: ExitTradeModalProps) {
  const [exitPrice, setExitPrice] = useState('')
  const [exitDate, setExitDate] = useState('')
  const [currentLtp, setCurrentLtp] = useState<number | null>(null)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen && trade) {
      const now = new Date()
      setExitDate(now.toISOString().slice(0, 16)) // Format for datetime-local input
      setExitPrice('')
      setCurrentLtp(null)
    } else if (!isOpen) {
      setExitPrice('')
      setExitDate('')
      setCurrentLtp(null)
    }
  }, [isOpen, trade])

  // Calculate P&L based on current inputs
  const calculatePnL = () => {
    if (!trade || !exitPrice) return null

    const price = parseFloat(exitPrice)
    if (isNaN(price) || price <= 0) return null

    return calculateEquityPnL(
      trade.entryPrice,
      trade.quantity,
      price,
      price,
      trade.position
    )
  }

  const pnlData = calculatePnL()
  const isProfit = pnlData?.netPnl && pnlData.netPnl > 0
  const isLoss = pnlData?.netPnl && pnlData.netPnl < 0

  const handleExit = async () => {
    if (!trade || !exitPrice || !exitDate) return

    const price = parseFloat(exitPrice)
    if (isNaN(price) || price <= 0) return

    const date = new Date(exitDate)
    await onExit(price, date)
  }

  const handleUseLtp = () => {
    if (currentLtp) {
      setExitPrice(currentLtp.toString())
    }
  }

  if (!trade) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Exit Position
          </DialogTitle>
          <DialogDescription>
            Close your {trade.symbol} position and calculate final P&L
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Trade Summary */}
          <Card className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{trade.symbol}</span>
                <Badge 
                  variant="outline"
                  className={
                    trade.instrument === 'EQUITY' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    trade.instrument === 'FUTURES' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                  }
                >
                  {trade.instrument === 'EQUITY' ? 'EQ' :
                   trade.instrument === 'FUTURES' ? 'FUT' : 'OPT'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Position</Label>
                  <div className={`font-medium ${
                    trade.position === 'BUY' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {trade.position}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Quantity</Label>
                  <div className="font-medium">{trade.quantity}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Entry Price</Label>
                  <div className="font-medium">{formatCurrency(trade.entryPrice)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Entry Value</Label>
                  <div className="font-medium">{formatCurrency(trade.entryPrice * trade.quantity)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exit Inputs */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exitPrice">Exit Price *</Label>
                <div className="flex gap-2">
                  <Input
                    id="exitPrice"
                    type="number"
                    step="0.01"
                    placeholder="Enter exit price"
                    value={exitPrice}
                    onChange={(e) => setExitPrice(e.target.value)}
                    className="text-right"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUseLtp}
                    disabled={!currentLtp}
                  >
                    LTP
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exitDate">Exit Date & Time *</Label>
                <Input
                  id="exitDate"
                  type="datetime-local"
                  value={exitDate}
                  onChange={(e) => setExitDate(e.target.value)}
                />
              </div>
            </div>

            {/* LTP Input */}
            <div className="space-y-2">
              <Label htmlFor="currentLtp">Current LTP (Optional)</Label>
              <Input
                id="currentLtp"
                type="number"
                step="0.01"
                placeholder="Enter current market price"
                value={currentLtp || ''}
                onChange={(e) => setCurrentLtp(e.target.value ? parseFloat(e.target.value) : null)}
                className="text-right"
              />
            </div>
          </div>

          {/* P&L Calculation */}
          {pnlData && (
            <Card className={`border-2 ${
              isProfit ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20' :
              isLoss ? 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/20' :
              'border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50'
            }`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {isProfit ? (
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : isLoss ? (
                    <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                  ) : (
                    <Calculator className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                  P&L Calculation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Exit Value</Label>
                    <div className="font-medium">{formatCurrency(pnlData.exitValue)}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Gross P&L</Label>
                    <div className={`font-medium ${
                      pnlData.grossPnl >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {pnlData.grossPnl >= 0 ? '+' : ''}{formatCurrency(pnlData.grossPnl)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Charges</Label>
                    <div className="font-medium text-muted-foreground">
                      {trade.instrument === 'EQUITY' ? '₹0.00' : '--'}
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Net P&L</Label>
                    <div className={`font-bold text-lg ${
                      pnlData.netPnl >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {pnlData.netPnl >= 0 ? '+' : ''}{formatCurrency(pnlData.netPnl)}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="text-center">
                  <div className="text-2xl font-bold">
                    <span className={`${
                      pnlData.percentageReturn >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {pnlData.percentageReturn >= 0 ? '+' : ''}{formatPercentage(pnlData.percentageReturn)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">Return on Investment</div>
                </div>

                {/* Equity-specific note */}
                {trade.instrument === 'EQUITY' && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-blue-800 dark:text-blue-200">
                      For equity positions, no charges are applied as per current regulations.
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Validation Messages */}
          {exitPrice && parseFloat(exitPrice) <= 0 && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-sm text-red-800 dark:text-red-200">
                Exit price must be greater than 0
              </span>
            </div>
          )}

          {exitPrice && !exitDate && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                Please select exit date and time
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleExit}
            disabled={
              isLoading || 
              !exitPrice || 
              !exitDate || 
              parseFloat(exitPrice) <= 0 ||
              !pnlData
            }
            className={`${
              isProfit ? 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700' :
              isLoss ? 'bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700' :
              'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exiting...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Exit Position
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
