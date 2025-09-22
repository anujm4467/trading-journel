'use client'

import { useState, createContext, useContext } from 'react'
import { Sidebar } from './Sidebar'
import { AppHeader } from './AppHeader'
import { FilterPanel } from './FilterPanel'
import { TradeFilters } from '@/types/trade'
import { AnalyticsFilters } from '@/hooks/useAnalytics'

interface MainLayoutProps {
  children: React.ReactNode
}

interface FilterContextType {
  globalFilters: AnalyticsFilters
  setGlobalFilters: (filters: AnalyticsFilters) => void
  selectedInstruments: string[]
  setSelectedInstruments: (instruments: string[]) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function useFilterContext() {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilterContext must be used within a FilterProvider')
  }
  return context
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [filters, setFilters] = useState<TradeFilters>({})
  const [globalFilters, setGlobalFilters] = useState<AnalyticsFilters>({})
  const [searchQuery, setSearchQuery] = useState('')

  const handleExport = (format: string) => {
    // TODO: Implement export functionality
    console.log('Export as', format)
  }


  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // TODO: Implement search functionality
    console.log('Search query:', query)
  }

  const handleFiltersChange = (newFilters: TradeFilters) => {
    setFilters(newFilters)
  }

  const handleApplyFilters = () => {
    setIsFilterPanelOpen(false)
    // TODO: Apply filters to data
    console.log('Filters applied:', filters)
  }

  const handleClearFilters = () => {
    setFilters({})
    setGlobalFilters({})
    setSearchQuery('')
    console.log('Filters cleared')
  }


  // Debug logging
  console.log('MainLayout - rendering with globalFilters:', globalFilters)

  return (
    <FilterContext.Provider value={{
      globalFilters,
      setGlobalFilters,
      selectedInstruments: [],
      setSelectedInstruments: () => {},
      searchQuery,
      setSearchQuery
    }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Header */}
        <div className="relative z-10">
        <AppHeader
          onExport={handleExport}
          onSearch={handleSearch}
          searchQuery={searchQuery}
        />
        </div>

        <div className="flex h-[calc(100vh-4rem)] relative z-10">
          {/* Sidebar */}
          <Sidebar className="hidden md:flex" />

          {/* Main Content */}
          <main className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              {children}
            </div>
          </main>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          isOpen={isFilterPanelOpen}
          onClose={() => setIsFilterPanelOpen(false)}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />

      </div>
    </FilterContext.Provider>
  )
}
