'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Target, Save, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { PredictionForm } from '@/components/forms/PredictionForm'
import { PredictionFormData } from '@/types/prediction'

export default function NewPredictionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleCreatePrediction = async (data: PredictionFormData) => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        router.push('/predictions')
      } else {
        const errorData = await response.json()
        console.error('Error creating prediction:', errorData.error)
        // You could add toast notification here
      }
    } catch (error) {
      console.error('Error creating prediction:', error)
      // You could add toast notification here
    } finally {
      setIsLoading(false)
    }
  }


  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create New Prediction
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Record your trading strategy prediction with confidence level and detailed notes
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Target className="h-3 w-3" />
              <span>New Prediction</span>
            </Badge>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PredictionForm
            onSubmit={handleCreatePrediction}
            isLoading={isLoading}
            mode="create"
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                // This would trigger a draft save
                // For now, we'll just show a message
                console.log('Save as draft functionality would go here')
              }}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Draft</span>
            </Button>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Tips for Better Predictions</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Strategy Selection</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Choose the strategy that best fits your current market analysis</li>
                <li>Consider market conditions and volatility</li>
                <li>Be specific about your approach</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Confidence Level</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Rate your confidence honestly (1-10 scale)</li>
                <li>Consider all factors: technical, fundamental, sentiment</li>
                <li>Track how your confidence correlates with actual results</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Strategy Notes</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Document your entry/exit criteria clearly</li>
                <li>Include risk management rules</li>
                <li>Note any specific market conditions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Tracking Results</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Update predictions with actual results</li>
                <li>Analyze patterns in your successful strategies</li>
                <li>Learn from failed predictions</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
