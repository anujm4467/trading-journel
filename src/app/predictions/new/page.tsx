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

      </div>
    </div>
  )
}
