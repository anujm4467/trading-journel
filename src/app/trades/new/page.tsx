'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TradeFormPage } from '@/components/forms/TradeFormPage'
import { TradeFormData } from '@/types/trade'
import { tradesApi } from '@/lib/api'

export default function NewTradePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = async (tradeData: TradeFormData) => {
    if (isSubmitting) return // Prevent duplicate submissions
    
    setIsSubmitting(true)
    try {
      console.log('Saving trade:', tradeData)
      
      // Prepare data for API
      const apiData = {
        ...tradeData,
        entryDate: tradeData.entryDate.toISOString(),
        exitDate: tradeData.exitDate?.toISOString(),
        expiryDate: tradeData.expiryDate?.toISOString(),
        hedgeEntryDate: tradeData.hedgeEntryDate?.toISOString(),
        hedgeExitDate: tradeData.hedgeExitDate?.toISOString(),
        // Convert position to side for API compatibility
        side: tradeData.position,
        // Convert instrument to instrumentType for API compatibility
        instrumentType: tradeData.instrument,
      }
      
      const response = await tradesApi.createTrade(apiData)
      
      if (response.error) {
        console.error('API Error:', response.error)
        alert(`Error saving trade: ${response.error}`)
        return
      }
      
      console.log('Trade saved successfully:', response.data)
      
      // Redirect to trades page after successful save
      router.push('/trades')
    } catch (error) {
      console.error('Error saving trade:', error)
      alert(`Error saving trade: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = async (tradeData: TradeFormData) => {
    if (isSubmitting) return // Prevent duplicate submissions
    
    setIsSubmitting(true)
    try {
      console.log('Saving draft:', tradeData)
      
      // Prepare data for API with isDraft flag
      const apiData = {
        ...tradeData,
        entryDate: tradeData.entryDate.toISOString(),
        exitDate: tradeData.exitDate?.toISOString(),
        expiryDate: tradeData.expiryDate?.toISOString(),
        hedgeEntryDate: tradeData.hedgeEntryDate?.toISOString(),
        hedgeExitDate: tradeData.hedgeExitDate?.toISOString(),
        // Convert position to side for API compatibility
        side: tradeData.position,
        // Convert instrument to instrumentType for API compatibility
        instrumentType: tradeData.instrument,
        isDraft: true,
      }
      
      const response = await tradesApi.createTrade(apiData)
      
      if (response.error) {
        console.error('API Error:', response.error)
        alert(`Error saving draft: ${response.error}`)
        return
      }
      
      console.log('Draft saved successfully:', response.data)
      
      // Redirect to trades page after successful save
      router.push('/trades')
    } catch (error) {
      console.error('Error saving draft:', error)
      alert(`Error saving draft: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8">
        <TradeFormPage
          onSave={handleSave}
          onSaveDraft={handleSaveDraft}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}
