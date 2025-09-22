'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DateTimePickerProps {
  value?: Date
  onChange: (date: Date) => void
  placeholder?: string
  className?: string
  label?: string
  disabled?: boolean
}

export function DateTimePicker({ 
  value, 
  onChange, 
  placeholder = "Select date and time",
  className,
  label,
  disabled = false
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null)
  const [selectedHour, setSelectedHour] = useState<number>(9)
  const [selectedMinute, setSelectedMinute] = useState<number>(15)
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM')

  // Initialize with default time (9:15 AM) if no value provided
  useEffect(() => {
    if (!value) {
      const defaultDate = new Date()
      defaultDate.setHours(9, 15, 0, 0)
      setSelectedDate(defaultDate)
      setSelectedHour(9)
      setSelectedMinute(15)
      setSelectedPeriod('AM')
    } else {
      setSelectedDate(value)
      const hours = value.getHours()
      const minutes = value.getMinutes()
      
      if (hours === 0) {
        setSelectedHour(12)
        setSelectedPeriod('AM')
      } else if (hours < 12) {
        setSelectedHour(hours)
        setSelectedPeriod('AM')
      } else if (hours === 12) {
        setSelectedHour(12)
        setSelectedPeriod('PM')
      } else {
        setSelectedHour(hours - 12)
        setSelectedPeriod('PM')
      }
      setSelectedMinute(minutes)
    }
  }, [value])

  const handleDateChange = (date: Date) => {
    if (selectedDate) {
      const newDate = new Date(date)
      newDate.setHours(selectedPeriod === 'AM' ? selectedHour : selectedHour + 12, selectedMinute, 0, 0)
      if (selectedPeriod === 'AM' && selectedHour === 12) {
        newDate.setHours(0, selectedMinute, 0, 0)
      }
      setSelectedDate(newDate)
      onChange(newDate)
    }
  }

  const handleTimeChange = (hour: number, minute: number, period: 'AM' | 'PM') => {
    if (selectedDate) {
      const newDate = new Date(selectedDate)
      let adjustedHour = hour
      
      if (period === 'AM' && hour === 12) {
        adjustedHour = 0
      } else if (period === 'PM' && hour !== 12) {
        adjustedHour = hour + 12
      }
      
      newDate.setHours(adjustedHour, minute, 0, 0)
      setSelectedDate(newDate)
      onChange(newDate)
    }
  }

  const formatDisplayValue = () => {
    if (!selectedDate) return placeholder
    
    const dateStr = selectedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
    
    const timeStr = selectedDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    
    return `${dateStr} at ${timeStr}`
  }

  const generateTimeOptions = () => {
    const hours = Array.from({ length: 12 }, (_, i) => i + 1)
    const minutes = Array.from({ length: 60 }, (_, i) => i)
    
    return { hours, minutes }
  }

  const { hours, minutes } = generateTimeOptions()

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {formatDisplayValue()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {/* Date Picker */}
            <div className="p-3 border-r">
              <div className="space-y-2">
                <div className="text-sm font-medium">Select Date</div>
                <Input
                  type="date"
                  value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      const date = new Date(e.target.value)
                      handleDateChange(date)
                    }
                  }}
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Time Picker */}
            <div className="p-3">
              <div className="space-y-2">
                <div className="text-sm font-medium">Select Time</div>
                <div className="flex items-center space-x-2">
                  {/* Hour */}
                  <Select
                    value={selectedHour.toString()}
                    onValueChange={(value) => {
                      const hour = parseInt(value)
                      setSelectedHour(hour)
                      handleTimeChange(hour, selectedMinute, selectedPeriod)
                    }}
                  >
                    <SelectTrigger className="w-16">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {hours.map((hour) => (
                        <SelectItem key={hour} value={hour.toString()}>
                          {hour.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <span className="text-sm">:</span>
                  
                  {/* Minute */}
                  <Select
                    value={selectedMinute.toString()}
                    onValueChange={(value) => {
                      const minute = parseInt(value)
                      setSelectedMinute(minute)
                      handleTimeChange(selectedHour, minute, selectedPeriod)
                    }}
                  >
                    <SelectTrigger className="w-16">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {minutes.map((minute) => (
                        <SelectItem key={minute} value={minute.toString()}>
                          {minute.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* AM/PM */}
                  <Select
                    value={selectedPeriod}
                    onValueChange={(value: 'AM' | 'PM') => {
                      setSelectedPeriod(value)
                      handleTimeChange(selectedHour, selectedMinute, value)
                    }}
                  >
                    <SelectTrigger className="w-16">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Quick Time Buttons */}
                <div className="flex flex-wrap gap-1 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedHour(9)
                      setSelectedMinute(15)
                      setSelectedPeriod('AM')
                      handleTimeChange(9, 15, 'AM')
                    }}
                    className="text-xs"
                  >
                    9:15 AM
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedHour(10)
                      setSelectedMinute(0)
                      setSelectedPeriod('AM')
                      handleTimeChange(10, 0, 'AM')
                    }}
                    className="text-xs"
                  >
                    10:00 AM
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedHour(12)
                      setSelectedMinute(0)
                      setSelectedPeriod('PM')
                      handleTimeChange(12, 0, 'PM')
                    }}
                    className="text-xs"
                  >
                    12:00 PM
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedHour(3)
                      setSelectedMinute(30)
                      setSelectedPeriod('PM')
                      handleTimeChange(3, 30, 'PM')
                    }}
                    className="text-xs"
                  >
                    3:30 PM
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 p-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const now = new Date()
                now.setHours(9, 15, 0, 0)
                setSelectedDate(now)
                setSelectedHour(9)
                setSelectedMinute(15)
                setSelectedPeriod('AM')
                onChange(now)
                setIsOpen(false)
              }}
            >
              Today 9:15 AM
            </Button>
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
