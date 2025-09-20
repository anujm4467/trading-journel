'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion'
import { 
  Calendar,
  TrendingUp,
  Target,
  Filter,
  X,
  Save
} from 'lucide-react'
import { TradeFilters } from '@/types/trade'

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  filters: TradeFilters
  onFiltersChange: (filters: TradeFilters) => void
  onApplyFilters: () => void
  onClearFilters: () => void
}

const timeSlots = [
  { label: 'Pre-Market (9:00-9:15)', value: 'pre-market' },
  { label: 'Opening (9:15-10:00)', value: 'opening' },
  { label: 'Morning (10:00-12:00)', value: 'morning' },
  { label: 'Afternoon (12:00-15:00)', value: 'afternoon' },
  { label: 'Closing (15:00-15:30)', value: 'closing' }
]

const daysOfWeek = [
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' }
]

const holdingDurations = [
  { label: 'Scalp (<15 min)', value: 'scalp' },
  { label: 'Intraday (15min-1day)', value: 'intraday' },
  { label: 'Swing (1-7 days)', value: 'swing' },
  { label: 'Positional (>7 days)', value: 'positional' }
]


export function FilterPanel({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<TradeFilters>(filters)

  const handleFilterChange = (key: keyof TradeFilters, value: unknown) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
  }

  const handleApply = () => {
    onFiltersChange(localFilters)
    onApplyFilters()
  }

  const handleClear = () => {
    const clearedFilters: TradeFilters = {}
    setLocalFilters(clearedFilters)
    onClearFilters()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div 
        className="fixed right-0 top-0 h-full w-80 bg-background border-l shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <Accordion type="multiple" defaultValue={['date', 'instruments']} className="space-y-4">
            {/* Date & Time Filters */}
            <AccordionItem value="date" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Date & Time</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      placeholder="From"
                      value={localFilters.dateRange?.from?.toISOString().split('T')[0] || ''}
                      onChange={(e) => handleFilterChange('dateRange', {
                        ...localFilters.dateRange,
                        from: e.target.value ? new Date(e.target.value) : undefined
                      })}
                    />
                    <Input
                      type="date"
                      placeholder="To"
                      value={localFilters.dateRange?.to?.toISOString().split('T')[0] || ''}
                      onChange={(e) => handleFilterChange('dateRange', {
                        ...localFilters.dateRange,
                        to: e.target.value ? new Date(e.target.value) : undefined
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Time of Day</Label>
                  <div className="space-y-2">
                    {timeSlots.map((slot) => (
                      <div key={slot.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={slot.value}
                          checked={localFilters.timeOfDay?.includes(slot.value) || false}
                          onCheckedChange={(checked) => {
                            const current = localFilters.timeOfDay || []
                            const newValue = checked
                              ? [...current, slot.value]
                              : current.filter(t => t !== slot.value)
                            handleFilterChange('timeOfDay', newValue)
                          }}
                        />
                        <Label htmlFor={slot.value} className="text-sm">
                          {slot.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Day of Week</Label>
                  <div className="space-y-2">
                    {daysOfWeek.map((day) => (
                      <div key={day.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={day.value}
                          checked={localFilters.dayOfWeek?.includes(day.value) || false}
                          onCheckedChange={(checked) => {
                            const current = localFilters.dayOfWeek || []
                            const newValue = checked
                              ? [...current, day.value]
                              : current.filter(d => d !== day.value)
                            handleFilterChange('dayOfWeek', newValue)
                          }}
                        />
                        <Label htmlFor={day.value} className="text-sm">
                          {day.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Instrument Filters */}
            <AccordionItem value="instruments" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Instruments</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Asset Type</Label>
                  <div className="space-y-2">
                    {['EQUITY', 'FUTURES', 'OPTIONS'].map((instrument) => (
                      <div key={instrument} className="flex items-center space-x-2">
                        <Checkbox
                          id={instrument}
                          checked={localFilters.instruments?.includes(instrument as 'EQUITY' | 'FUTURES' | 'OPTIONS') || false}
                          onCheckedChange={(checked) => {
                            const current = localFilters.instruments || []
                            const newValue = checked
                              ? [...current, instrument as 'EQUITY' | 'FUTURES' | 'OPTIONS']
                              : current.filter(i => i !== instrument)
                            handleFilterChange('instruments', newValue)
                          }}
                        />
                        <Label htmlFor={instrument} className="text-sm">
                          {instrument} (0 trades)
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Position Type</Label>
                  <div className="space-y-2">
                    {['BUY', 'SELL'].map((position) => (
                      <div key={position} className="flex items-center space-x-2">
                        <Checkbox
                          id={position}
                          checked={localFilters.positions?.includes(position as 'BUY' | 'SELL') || false}
                          onCheckedChange={(checked) => {
                            const current = localFilters.positions || []
                            const newValue = checked
                              ? [...current, position as 'BUY' | 'SELL']
                              : current.filter(p => p !== position)
                            handleFilterChange('positions', newValue)
                          }}
                        />
                        <Label htmlFor={position} className="text-sm">
                          {position}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Performance Filters */}
            <AccordionItem value="performance" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Performance</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>P&L Range (₹)</Label>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={localFilters.pnlRange?.min || ''}
                        onChange={(e) => handleFilterChange('pnlRange', {
                          ...localFilters.pnlRange,
                          min: e.target.value ? Number(e.target.value) : undefined
                        })}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={localFilters.pnlRange?.max || ''}
                        onChange={(e) => handleFilterChange('pnlRange', {
                          ...localFilters.pnlRange,
                          max: e.target.value ? Number(e.target.value) : undefined
                        })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Win/Loss</Label>
                  <div className="space-y-2">
                    {['winners', 'losers', 'breakeven'].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={localFilters.winLoss?.includes(type) || false}
                          onCheckedChange={(checked) => {
                            const current = localFilters.winLoss || []
                            const newValue = checked
                              ? [...current, type]
                              : current.filter(w => w !== type)
                            handleFilterChange('winLoss', newValue)
                          }}
                        />
                        <Label htmlFor={type} className="text-sm capitalize">
                          {type} only
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Holding Duration</Label>
                  <div className="space-y-2">
                    {holdingDurations.map((duration) => (
                      <div key={duration.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={duration.value}
                          checked={localFilters.holdingDuration?.includes(duration.value) || false}
                          onCheckedChange={(checked) => {
                            const current = localFilters.holdingDuration || []
                            const newValue = checked
                              ? [...current, duration.value]
                              : current.filter(h => h !== duration.value)
                            handleFilterChange('holdingDuration', newValue)
                          }}
                        />
                        <Label htmlFor={duration.value} className="text-sm">
                          {duration.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Footer */}
        <div className="border-t p-4 space-y-2">
          <div className="flex space-x-2">
            <Button onClick={handleApply} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear All
            </Button>
          </div>
          <Button variant="outline" className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save as Preset
          </Button>
        </div>
      </div>
    </div>
  )
}
