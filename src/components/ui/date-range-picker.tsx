'use client'

import { useState } from 'react'
import { Calendar, X } from 'lucide-react'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Card, CardContent, CardHeader, CardTitle } from './card'

interface DateRangePickerProps {
  isOpen: boolean
  onClose: () => void
  onApply: (dateFrom: string, dateTo: string) => void
  initialDateFrom?: string
  initialDateTo?: string
}

export function DateRangePicker({
  isOpen,
  onClose,
  onApply,
  initialDateFrom,
  initialDateTo
}: DateRangePickerProps) {
  const [dateFrom, setDateFrom] = useState(
    initialDateFrom ? new Date(initialDateFrom).toISOString().split('T')[0] : ''
  )
  const [dateTo, setDateTo] = useState(
    initialDateTo ? new Date(initialDateTo).toISOString().split('T')[0] : ''
  )

  const handleApply = () => {
    if (dateFrom && dateTo) {
      const fromDate = new Date(dateFrom)
      const toDate = new Date(dateTo)
      
      // Set time to start of day for from date and end of day for to date
      fromDate.setHours(0, 0, 0, 0)
      toDate.setHours(23, 59, 59, 999)
      
      onApply(fromDate.toISOString(), toDate.toISOString())
      onClose()
    }
  }

  const handleClear = () => {
    setDateFrom('')
    setDateTo('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Custom Date Range
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dateFrom">From Date</Label>
            <Input
              id="dateFrom"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateTo">To Date</Label>
            <Input
              id="dateTo"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleClear}
              className="flex-1 mr-2"
            >
              Clear
            </Button>
            <Button
              onClick={handleApply}
              disabled={!dateFrom || !dateTo}
              className="flex-1 ml-2"
            >
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
