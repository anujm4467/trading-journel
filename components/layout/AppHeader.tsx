'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/ui/Logo'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Search,
  Download,
  Plus,
  Bell,
  Settings,
  User
} from 'lucide-react'

interface AppHeaderProps {
  onAddTrade: () => void
  onExport: (format: string) => void
  onDateRangeChange: (range: string) => void
  onInstrumentFilter: (instruments: string[]) => void
  onSearch: (query: string) => void
  selectedInstruments: string[]
  searchQuery: string
}

const dateRangePresets = [
  { label: 'Today', value: 'today' },
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
  { label: 'MTD', value: 'mtd' },
  { label: 'YTD', value: 'ytd' },
  { label: 'Custom', value: 'custom' }
]

const instruments = [
  { label: 'Equity', value: 'EQUITY', count: 0 },
  { label: 'Futures', value: 'FUTURES', count: 0 },
  { label: 'Options', value: 'OPTIONS', count: 0 }
]

export function AppHeader({
  onAddTrade,
  onExport,
  onDateRangeChange,
  onInstrumentFilter,
  onSearch,
  selectedInstruments,
  searchQuery
}: AppHeaderProps) {
  const [selectedDateRange, setSelectedDateRange] = useState('30d')

  const handleDateRangeChange = (range: string) => {
    setSelectedDateRange(range)
    onDateRangeChange(range)
  }

  const handleInstrumentToggle = (instrument: string) => {
    const newSelection = selectedInstruments.includes(instrument)
      ? selectedInstruments.filter(i => i !== instrument)
      : [...selectedInstruments, instrument]
    onInstrumentFilter(newSelection)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 shadow-lg">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Logo and Title - Fixed width */}
        <div className="flex-shrink-0 w-64">
          <Logo size="md" className="hover:scale-105 transition-transform duration-300" />
        </div>

        {/* Center Controls - Responsive */}
        <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-2xl mx-4">
          {/* Date Range Selector */}
          <div className="flex items-center space-x-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg p-1 backdrop-blur-sm">
            {dateRangePresets.slice(0, 4).map((preset) => (
              <Button
                key={preset.value}
                variant={selectedDateRange === preset.value ? "default" : "ghost"}
                size="sm"
                onClick={() => handleDateRangeChange(preset.value)}
                className={`h-7 px-2 text-xs transition-all duration-200 ${
                  selectedDateRange === preset.value 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          {/* Instrument Filter Chips */}
          <div className="flex items-center space-x-1">
            {instruments.map((instrument) => (
              <Button
                key={instrument.value}
                variant={selectedInstruments.includes(instrument.value) ? "default" : "outline"}
                size="sm"
                onClick={() => handleInstrumentToggle(instrument.value)}
                className={`h-7 px-2 text-xs transition-all duration-200 ${
                  selectedInstruments.includes(instrument.value)
                    ? 'bg-green-600 text-white shadow-lg hover:bg-green-700'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {instrument.label}
                {instrument.count > 0 && (
                  <Badge variant="secondary" className="ml-1 h-3 px-1 text-xs bg-white/20 text-white">
                    {instrument.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Right Controls - Responsive */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Search - Hidden on small screens */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search trades..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-48 lg:w-56 pl-10 h-8 text-sm bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Last Updated Badge - Hidden on small screens */}
          <Badge variant="outline" className="hidden lg:flex text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700">
            <span className="hidden xl:inline">Last updated: 2 minutes ago</span>
            <span className="xl:hidden">2m ago</span>
          </Badge>

          {/* Quick Add Trade - Responsive text */}
          <Button 
            onClick={onAddTrade} 
            className="h-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
          >
            <Plus className="h-4 w-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Add Trade</span>
            <span className="sm:hidden">Add</span>
          </Button>

          {/* Export Menu - Icon only on small screens */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-700/50">
                <Download className="h-4 w-4 mr-1 lg:mr-2" />
                <span className="hidden lg:inline">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border-white/20">
              <DropdownMenuItem onClick={() => onExport('csv')} className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('excel')} className="hover:bg-green-50 dark:hover:bg-green-900/20">
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('pdf')} className="hover:bg-red-50 dark:hover:bg-red-900/20">
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-700/50 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">1</span>
          </Button>

          {/* Settings */}
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-700/50">
            <Settings className="h-4 w-4" />
          </Button>

          {/* User Profile */}
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
