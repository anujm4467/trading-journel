'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Calculator, 
  Shield, 
  Brain, 
  BarChart3,
  Clock
} from 'lucide-react'
import tradeData from '@/data/tradeData.json'
import { TradeDetails } from '@/types/tradeDetails'

interface TradeDetailsViewProps {
  trade: TradeDetails
}

export function TradeDetailsView({ trade }: TradeDetailsViewProps) {
  // Calculate P&L and charges
  const entryValue = trade.entryPrice * trade.quantity
  const exitValue = trade.exitPrice ? trade.exitPrice * trade.quantity : 0
  const turnover = entryValue + exitValue
  
  // Calculate gross P&L based on position
  let grossPnl = 0
  if (exitValue > 0) {
    if (trade.position === 'BUY') {
      grossPnl = exitValue - entryValue
    } else {
      grossPnl = entryValue - exitValue
    }
  }
  
  // Use stored charges from database if available
  let charges = {
    brokerage: 0,
    stt: 0,
    exchange: 0,
    sebi: 0,
    stampDuty: 0,
    gst: 0,
    total: 0
  }
  
  // If charges are stored in the database as an array, process them
  if (trade.charges && Array.isArray(trade.charges)) {
    trade.charges.forEach((charge: { chargeType: string; amount: number }) => {
      switch (charge.chargeType) {
        case 'BROKERAGE':
          charges.brokerage = charge.amount
          break
        case 'STT':
          charges.stt = charge.amount
          break
        case 'EXCHANGE':
          charges.exchange = charge.amount
          break
        case 'SEBI':
          charges.sebi = charge.amount
          break
        case 'STAMP_DUTY':
          charges.stampDuty = charge.amount
          break
        case 'GST':
          charges.gst = charge.amount
          break
      }
    })
    
    // Calculate GST if not present in charges array (18% of brokerage)
    if (charges.gst === 0 && charges.brokerage > 0) {
      charges.gst = charges.brokerage * 0.18
    }
    
    charges.total = charges.brokerage + charges.stt + charges.exchange + charges.sebi + charges.stampDuty + charges.gst
  } else if (trade.charges && typeof trade.charges === 'object' && !Array.isArray(trade.charges)) {
    // If charges are in object format, use them directly
    charges = { ...trade.charges }
    charges.gst = charges.brokerage * 0.18
    charges.total = Object.values(charges).reduce((sum: number, val: number) => 
      typeof val === 'number' ? sum + val : sum, 0
    )
  } else {
    // Fallback to calculation if no charges stored
    charges = {
      brokerage: turnover * 0.0001,
      stt: trade.position === 'SELL' ? exitValue * 0.001 : 0,
      exchange: turnover * 0.0000173,
      sebi: turnover * 0.000001,
      stampDuty: turnover * 0.00003,
      gst: 0,
      total: 0
    }
    charges.gst = charges.brokerage * 0.18
    charges.total = Object.values(charges).reduce((sum: number, val: number) => 
      typeof val === 'number' ? sum + val : sum, 0
    )
  }
  
  const netPnl = grossPnl - charges.total
  const percentageReturn = entryValue > 0 ? (netPnl / entryValue) * 100 : 0

  return (
    <div className="space-y-8">
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
                {trade.tradeType}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Symbol</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{trade.symbol}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Instrument</span>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {trade.instrument}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Position</span>
              <Badge variant="outline" className={`${trade.position === 'BUY' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {trade.position}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Quantity</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{trade.quantity}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Entry Price</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">₹{trade.entryPrice}</span>
            </div>
            {trade.exitPrice && (
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Exit Price</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">₹{trade.exitPrice}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Entry Date</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {new Date(trade.entryDate).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            {trade.exitDate && (
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Exit Date</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {new Date(trade.exitDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
            {trade.instrument === 'OPTIONS' && trade.optionsTrade && (
              <>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Option Type</span>
                  <Badge variant="outline" className={`${trade.optionsTrade.optionType === 'CALL' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {trade.optionsTrade.optionType}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Strike Price</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">₹{trade.optionsTrade.strikePrice}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Lot Size</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{trade.optionsTrade.lotSize}</span>
                </div>
                {trade.optionsTrade.expiryDate && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Expiry Date</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {new Date(trade.optionsTrade.expiryDate).toLocaleDateString()}
                    </span>
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
            {trade.stopLoss && (
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Stop Loss</span>
                <span className="font-bold text-red-600">₹{trade.stopLoss}</span>
              </div>
            )}
            {trade.target && (
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Target</span>
                <span className="font-bold text-green-600">₹{trade.target}</span>
              </div>
            )}
            {trade.confidenceLevel && (
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Confidence</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(trade.confidenceLevel / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{trade.confidenceLevel}/10</span>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {trade.marketCondition && (
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Market</span>
                {(() => {
                  const condition = tradeData.marketConditions.find(c => c.name === trade.marketCondition)
                  return (
                    <Badge variant="outline" className={`${condition?.color || 'bg-gray-50 text-gray-700 border-gray-200'} flex items-center gap-1`}>
                      <span>{condition?.icon}</span>
                      <span>{trade.marketCondition}</span>
                    </Badge>
                  )
                })()}
              </div>
            )}
            {trade.emotionalState && (
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Emotion</span>
                {(() => {
                  const emotion = tradeData.emotionalStates.find(e => e.name === trade.emotionalState)
                  return (
                    <Badge variant="outline" className={`${emotion?.color || 'bg-gray-50 text-gray-700 border-gray-200'} flex items-center gap-1`}>
                      <span>{emotion?.icon}</span>
                      <span>{trade.emotionalState}</span>
                    </Badge>
                  )
                })()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Horizontal Divider */}
      <div className="w-full h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700"></div>

      {/* Real-time Calculations Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Real-time Calculations</h3>
          {trade.hedgePosition && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              + Hedge
            </Badge>
          )}
        </div>
        
        {/* Values Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Values</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex justify-between items-center py-3 px-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Entry Value</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">₹{entryValue.toLocaleString()}</span>
            </div>
            {exitValue > 0 && (
              <div className="flex justify-between items-center py-3 px-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Exit Value</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">₹{exitValue.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-3 px-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Turnover</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">₹{turnover.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Charges Breakdown */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Charges Breakdown</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 px-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Brokerage</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">₹{charges.brokerage.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 font-medium">STT</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">₹{charges.stt.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Exchange</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">₹{charges.exchange.toFixed(2)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 px-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 font-medium">SEBI</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">₹{charges.sebi.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Stamp Duty</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">₹{charges.stampDuty.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 font-medium">GST</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">₹{charges.gst.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Total Charges</span>
            <span className="font-bold text-lg text-slate-900 dark:text-slate-100">₹{charges.total.toFixed(2)}</span>
          </div>
        </div>

        {/* P&L Summary */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">P&L Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex justify-between items-center py-3 px-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Gross P&L</span>
              <span className={`font-bold text-lg ${grossPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {grossPnl >= 0 ? '+' : ''}₹{grossPnl.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Net P&L</span>
              <span className={`font-bold text-xl ${netPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {netPnl >= 0 ? '+' : ''}₹{netPnl.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Return %</span>
              <span className={`font-bold text-xl ${percentageReturn >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {percentageReturn >= 0 ? '+' : ''}{percentageReturn.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hedge Position Section */}
      {trade.hedgePosition && (
        <>
          <div className="w-full h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700"></div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Hedge Position</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Hedge Position</span>
                  <Badge variant="outline" className={`${trade.hedgePosition.optionType === 'CALL' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {trade.hedgePosition.optionType}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Hedge Quantity</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{trade.hedgePosition.quantity}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Hedge Entry Price</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">₹{trade.hedgePosition.entryPrice}</span>
                </div>
                {trade.hedgePosition.exitPrice && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Hedge Exit Price</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">₹{trade.hedgePosition.exitPrice}</span>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Hedge Entry Date</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {new Date(trade.hedgePosition.entryDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                {trade.hedgePosition.exitDate && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Hedge Exit Date</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {new Date(trade.hedgePosition.exitDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
                {trade.hedgePosition.grossPnl !== null && trade.hedgePosition.grossPnl !== undefined && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Hedge Gross P&L</span>
                    <span className={`font-bold ${trade.hedgePosition.grossPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{trade.hedgePosition.grossPnl.toFixed(2)}
                    </span>
                  </div>
                )}
                {trade.hedgePosition.netPnl !== null && trade.hedgePosition.netPnl !== undefined && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Hedge Net P&L</span>
                    <span className={`font-bold text-lg ${trade.hedgePosition.netPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{trade.hedgePosition.netPnl.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {trade.hedgePosition.notes && (
              <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                <h4 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2">Hedge Notes</h4>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{trade.hedgePosition.notes}</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Additional Trade Details */}
      <div className="w-full h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700"></div>
      
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Additional Details</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {trade.holdingDuration && (
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Holding Duration</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {Math.floor(trade.holdingDuration / 60)}h {trade.holdingDuration % 60}m
                </span>
              </div>
            )}
            {trade.riskAmount && (
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Risk Amount</span>
                <span className="font-bold text-red-600">₹{trade.riskAmount}</span>
              </div>
            )}
            {trade.rewardAmount && (
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Reward Amount</span>
                <span className="font-bold text-green-600">₹{trade.rewardAmount}</span>
              </div>
            )}
            {trade.riskRewardRatio && (
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Risk:Reward Ratio</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">1:{trade.riskRewardRatio.toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {trade.brokerName && (
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Broker</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{trade.brokerName}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Custom Brokerage</span>
              <Badge variant="outline" className={trade.customBrokerage ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}>
                {trade.customBrokerage ? 'Yes' : 'No'}
              </Badge>
            </div>
            {trade.brokerageType && (
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Brokerage Type</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{trade.brokerageType}</span>
              </div>
            )}
            {trade.brokerageValue && (
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Brokerage Value</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">₹{trade.brokerageValue}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All Tags Section */}
      {(trade.strategyTags || trade.emotionalTags || trade.marketTags) && (
        <>
          <div className="w-full h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700"></div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Tags & Classification</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trade.strategyTags && trade.strategyTags.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Strategy Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {trade.strategyTags.map((tag: { strategyTagId?: string; id?: string; strategyTag?: { name: string; color?: string; hoverColor?: string }; name?: string }) => (
                      <Badge 
                        key={tag.strategyTagId || tag.id} 
                        variant="secondary" 
                        className={`${tag.strategyTag?.color || 'bg-blue-100 text-blue-800 border-blue-200'} hover:${tag.strategyTag?.hoverColor || 'hover:bg-blue-200'} transition-colors`}
                      >
                        {tag.strategyTag?.name || tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {trade.emotionalTags && trade.emotionalTags.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Emotional Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {trade.emotionalTags.map((tag: { emotionalTagId?: string; id?: string; emotionalTag?: { name: string; color?: string; hoverColor?: string }; name?: string }) => (
                      <Badge 
                        key={tag.emotionalTagId || tag.id} 
                        variant="secondary" 
                        className={`${tag.emotionalTag?.color || 'bg-purple-100 text-purple-800 border-purple-200'} hover:${tag.emotionalTag?.hoverColor || 'hover:bg-purple-200'} transition-colors`}
                      >
                        {tag.emotionalTag?.name || tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {trade.marketTags && trade.marketTags.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Market Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {trade.marketTags.map((tag: { marketTagId?: string; id?: string; marketTag?: { name: string; color?: string; hoverColor?: string }; name?: string }) => (
                      <Badge 
                        key={tag.marketTagId || tag.id} 
                        variant="secondary" 
                        className={`${tag.marketTag?.color || 'bg-orange-100 text-orange-800 border-orange-200'} hover:${tag.marketTag?.hoverColor || 'hover:bg-orange-200'} transition-colors`}
                      >
                        {tag.marketTag?.name || tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Planning and Notes Section */}
      {(trade.planning || trade.notes) && (
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {trade.planning && (
            <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-300">
              <div className="p-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Pre-Trade Planning</h3>
                </div>
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{trade.planning}</p>
                </div>
              </div>
            </Card>
          )}
          {trade.notes && (
            <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-300">
              <div className="p-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Notes</h3>
                </div>
                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{trade.notes}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
