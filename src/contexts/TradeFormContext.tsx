'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { TradeFormData } from '@/types/trade'

interface TradeFormContextType {
  isOpen: boolean
  openTradeForm: () => void
  closeTradeForm: () => void
  saveTrade: (data: TradeFormData) => void
}

const TradeFormContext = createContext<TradeFormContextType | undefined>(undefined)

export function TradeFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openTradeForm = () => {
    setIsOpen(true)
  }

  const closeTradeForm = () => {
    setIsOpen(false)
  }

  const saveTrade = (data: TradeFormData) => {
    // TODO: Save trade to database
    console.log('Saving trade:', data)
    setIsOpen(false)
  }

  return (
    <TradeFormContext.Provider value={{
      isOpen,
      openTradeForm,
      closeTradeForm,
      saveTrade
    }}>
      {children}
    </TradeFormContext.Provider>
  )
}

export function useTradeForm() {
  const context = useContext(TradeFormContext)
  if (context === undefined) {
    throw new Error('useTradeForm must be used within a TradeFormProvider')
  }
  return context
}
