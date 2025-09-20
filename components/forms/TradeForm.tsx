'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Calculator,
  Save,
  X
} from 'lucide-react'
import { TradeFormData } from '@/types/trade'
import { TradeType, InstrumentType, PositionType } from '@prisma/client'
import { calculateCharges, calculatePnL, formatCurrency } from '@/utils/calculations'

const tradeFormSchema = z.object({
  tradeType: z.enum(['ENTRY_ONLY', 'ROUND_TRIP', 'MULTI_LEG']),
  entryDate: z.date(),
  entryPrice: z.number().positive('Entry price must be positive'),
  quantity: z.number().positive('Quantity must be positive'),
  position: z.enum(['BUY', 'SELL', 'LONG', 'SHORT']),
  symbol: z.string().min(1, 'Symbol is required'),
  instrument: z.enum(['EQUITY', 'FUTURES', 'OPTIONS']),
  exitDate: z.date().optional(),
  exitPrice: z.number().positive().optional(),
  stopLoss: z.number().positive().optional(),
  target: z.number().positive().optional(),
  confidenceLevel: z.number().min(1).max(10).optional(),
  emotionalState: z.string().optional(),
  marketCondition: z.string().optional(),
  brokerName: z.string().optional(),
  customBrokerage: z.boolean(),
  brokerageType: z.string().optional(),
  brokerageValue: z.number().positive().optional(),
  notes: z.string().optional(),
  strategyTagIds: z.array(z.string()),
  emotionalTagIds: z.array(z.string()),
  marketTagIds: z.array(z.string()),
  // Options specific
  optionType: z.enum(['CALL', 'PUT']).optional(),
  strikePrice: z.number().positive().optional(),
  expiryDate: z.date().optional(),
  lotSize: z.number().positive().optional(),
  underlying: z.string().optional()
})

interface TradeFormProps {
  onSave: (data: TradeFormData) => void
  onCancel: () => void
  initialData?: Partial<TradeFormData>
}

export function TradeForm({ onSave, onCancel, initialData }: TradeFormProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const form = useForm<TradeFormData>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: {
      tradeType: 'ROUND_TRIP',
      entryDate: new Date(),
      position: 'BUY',
      instrument: 'EQUITY',
      customBrokerage: false,
      strategyTagIds: [],
      emotionalTagIds: [],
      marketTagIds: [],
      lotSize: 50,
      ...initialData
    }
  })

  const watchedValues = form.watch()
  const { entryPrice, quantity, exitPrice, instrument, position } = watchedValues

  // Calculate real-time values
  const entryValue = entryPrice && quantity ? entryPrice * quantity : 0
  const exitValue = exitPrice && quantity ? exitPrice * quantity : 0
  const turnover = entryValue + exitValue

  const charges = calculateCharges(entryValue, exitValue, instrument, position)
  const pnl = calculatePnL(entryValue, exitValue, charges, position)

  const steps = [
    { title: 'Basic Info', description: 'Trade details and instrument' },
    { title: 'Risk Management', description: 'Stop loss and targets' },
    { title: 'Strategy & Psychology', description: 'Tags and emotional state' },
    { title: 'Review & Save', description: 'Final review and calculations' }
  ]

  const onSubmit = (data: TradeFormData) => {
    onSave(data)
  }

  const onSaveDraft = () => {
    form.handleSubmit(onSubmit)()
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep form={form} />
      case 1:
        return <RiskManagementStep form={form} />
      case 2:
        return <StrategyStep form={form} />
      case 3:
        return <ReviewStep form={form} charges={charges} pnl={pnl} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Add New Trade</CardTitle>
              <CardDescription>
                {steps[currentStep].description}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                    ${index <= currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {index + 1}
                  </div>
                  <div className="ml-2">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-16 h-px bg-border mx-4" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <div>
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Previous
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onSaveDraft}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save Trade
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Real-time Calculations Panel */}
      <div className="mt-6">
        <CalculationPreview
          entryValue={entryValue}
          exitValue={exitValue}
          turnover={turnover}
          charges={charges}
        />
      </div>
    </div>
  )
}

// Step Components
function BasicInfoStep({ form }: { form: ReturnType<typeof useForm<TradeFormData>> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="tradeType">Trade Type</Label>
          <RadioGroup
            value={form.watch('tradeType')}
            onValueChange={(value) => form.setValue('tradeType', value as TradeType)}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ENTRY_ONLY" id="entry-only" />
              <Label htmlFor="entry-only">Entry Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ROUND_TRIP" id="round-trip" />
              <Label htmlFor="round-trip">Round Trip</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="MULTI_LEG" id="multi-leg" />
              <Label htmlFor="multi-leg">Multi-Leg</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="entryDate">Entry Date & Time</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input
              type="date"
              {...form.register('entryDate', { valueAsDate: true })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="symbol">Symbol/Ticker</Label>
          <Input
            id="symbol"
            placeholder="e.g., RELIANCE, NIFTY50"
            {...form.register('symbol')}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="instrument">Instrument Type</Label>
          <RadioGroup
            value={form.watch('instrument')}
            onValueChange={(value) => form.setValue('instrument', value as InstrumentType)}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="EQUITY" id="equity" />
              <Label htmlFor="equity">🏢 Equity</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="FUTURES" id="futures" />
              <Label htmlFor="futures">📊 Futures</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="OPTIONS" id="options" />
              <Label htmlFor="options">📈 Options</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="position">Position Direction</Label>
          <RadioGroup
            value={form.watch('position')}
            onValueChange={(value) => form.setValue('position', value as PositionType)}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="BUY" id="buy" />
              <Label htmlFor="buy" className="text-profit">📈 Buy/Long</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="SELL" id="sell" />
              <Label htmlFor="sell" className="text-loss">📉 Sell/Short</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            placeholder="100"
            {...form.register('quantity', { valueAsNumber: true })}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="entryPrice">Entry Price (₹)</Label>
          <Input
            id="entryPrice"
            type="number"
            step="0.01"
            placeholder="2450.50"
            {...form.register('entryPrice', { valueAsNumber: true })}
            className="mt-2"
          />
        </div>

        {form.watch('tradeType') === 'ROUND_TRIP' && (
          <>
            <div>
              <Label htmlFor="exitDate">Exit Date & Time</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Input
                  type="date"
                  {...form.register('exitDate', { valueAsDate: true })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="exitPrice">Exit Price (₹)</Label>
              <Input
                id="exitPrice"
                type="number"
                step="0.01"
                placeholder="2485.75"
                {...form.register('exitPrice', { valueAsNumber: true })}
                className="mt-2"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function RiskManagementStep({ form }: { form: ReturnType<typeof useForm<TradeFormData>> }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="stopLoss">Stop Loss (₹)</Label>
          <Input
            id="stopLoss"
            type="number"
            step="0.01"
            placeholder="2420.00"
            {...form.register('stopLoss', { valueAsNumber: true })}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="target">Target/Take Profit (₹)</Label>
          <Input
            id="target"
            type="number"
            step="0.01"
            placeholder="2500.00"
            {...form.register('target', { valueAsNumber: true })}
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <Label>Confidence Level (1-10)</Label>
        <div className="mt-2">
          <Slider
            value={[form.watch('confidenceLevel') || 5]}
            onValueChange={([value]) => form.setValue('confidenceLevel', value)}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-1">
            <span>Low (1)</span>
            <span>High (10)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function StrategyStep({ form }: { form: ReturnType<typeof useForm<TradeFormData>> }) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Strategy Tags</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {['Breakout', 'Momentum', 'Pullback', 'Mean Reversion', 'Scalping', 'Swing'].map((strategy) => (
            <div key={strategy} className="flex items-center space-x-2">
              <Checkbox
                id={strategy}
                checked={form.watch('strategyTagIds')?.includes(strategy) || false}
                onCheckedChange={(checked) => {
                  const current = form.watch('strategyTagIds') || []
                  const newValue = checked
                    ? [...current, strategy]
                    : current.filter((s: string) => s !== strategy)
                  form.setValue('strategyTagIds', newValue)
                }}
              />
              <Label htmlFor={strategy} className="text-sm">{strategy}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="emotionalState">Emotional State</Label>
          <Select
            value={form.watch('emotionalState')}
            onValueChange={(value) => form.setValue('emotionalState', value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select emotional state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calm">Calm</SelectItem>
              <SelectItem value="confident">Confident</SelectItem>
              <SelectItem value="nervous">Nervous</SelectItem>
              <SelectItem value="fomo">FOMO</SelectItem>
              <SelectItem value="revenge">Revenge</SelectItem>
              <SelectItem value="overconfident">Overconfident</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="marketCondition">Market Condition</Label>
          <Select
            value={form.watch('marketCondition')}
            onValueChange={(value) => form.setValue('marketCondition', value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select market condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="range-bound">Range-bound</SelectItem>
              <SelectItem value="volatile">Volatile</SelectItem>
              <SelectItem value="news-event">News Event</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Trade Notes</Label>
        <Textarea
          id="notes"
          placeholder="Trade reasoning, market analysis, lessons learned..."
          className="mt-2"
          rows={4}
          {...form.register('notes')}
        />
      </div>
    </div>
  )
}

function ReviewStep({ form, charges, pnl }: { 
  form: ReturnType<typeof useForm<TradeFormData>>
  charges: ReturnType<typeof calculateCharges>
  pnl: ReturnType<typeof calculatePnL>
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Trade Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Symbol:</span>
              <span className="font-medium">{form.watch('symbol')}</span>
            </div>
            <div className="flex justify-between">
              <span>Instrument:</span>
              <span className="font-medium">{form.watch('instrument')}</span>
            </div>
            <div className="flex justify-between">
              <span>Position:</span>
              <span className="font-medium">{form.watch('position')}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantity:</span>
              <span className="font-medium">{form.watch('quantity')}</span>
            </div>
            <div className="flex justify-between">
              <span>Entry Price:</span>
              <span className="font-medium">₹{form.watch('entryPrice')}</span>
            </div>
            {form.watch('exitPrice') && (
              <div className="flex justify-between">
                <span>Exit Price:</span>
                <span className="font-medium">₹{form.watch('exitPrice')}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">P&L Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Gross P&L:</span>
              <span className={`font-medium ${pnl.grossPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                {formatCurrency(pnl.grossPnl)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Charges:</span>
              <span className="font-medium">₹{charges.total}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Net P&L:</span>
              <span className={pnl.netPnl >= 0 ? 'text-profit' : 'text-loss'}>
                {formatCurrency(pnl.netPnl)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Return %:</span>
              <span className={`font-medium ${pnl.percentageReturn >= 0 ? 'text-profit' : 'text-loss'}`}>
                {pnl.percentageReturn.toFixed(2)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Calculation Preview Component
function CalculationPreview({ entryValue, exitValue, turnover, charges }: {
  entryValue: number
  exitValue: number
  turnover: number
  charges: ReturnType<typeof calculateCharges>
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          Real-time Calculations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="font-medium">Values</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Entry Value:</span>
                <span>{formatCurrency(entryValue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Exit Value:</span>
                <span>{formatCurrency(exitValue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Turnover:</span>
                <span>{formatCurrency(turnover)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Charges Breakdown</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Brokerage:</span>
                <span>₹{charges.brokerage}</span>
              </div>
              <div className="flex justify-between">
                <span>STT:</span>
                <span>₹{charges.stt}</span>
              </div>
              <div className="flex justify-between">
                <span>Exchange:</span>
                <span>₹{charges.exchange}</span>
              </div>
              <div className="flex justify-between">
                <span>SEBI:</span>
                <span>₹{charges.sebi}</span>
              </div>
              <div className="flex justify-between">
                <span>Stamp Duty:</span>
                <span>₹{charges.stampDuty}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-1">
                <span>Total Charges:</span>
                <span>₹{charges.total}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
