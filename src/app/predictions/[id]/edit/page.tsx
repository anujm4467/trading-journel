'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Target, Save, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { PredictionForm } from '@/components/forms/PredictionForm'
import { PredictionFormData, Prediction } from '@/types/prediction'

export default function EditPredictionPage() {
  const router = useRouter()
  const params = useParams()
  const predictionId = params.id as string

  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch prediction data
  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/predictions/${predictionId}`)
        const data = await response.json()

        if (response.ok) {
          setPrediction(data.data)
        } else {
          console.error('Error fetching prediction:', data.error)
          router.push('/predictions')
        }
      } catch (error) {
        console.error('Error fetching prediction:', error)
        router.push('/predictions')
      } finally {
        setIsLoading(false)
      }
    }

    if (predictionId) {
      fetchPrediction()
    }
  }, [predictionId, router])

  const handleUpdatePrediction = async (data: PredictionFormData) => {
    try {
      setIsSaving(true)
      
      const response = await fetch(`/api/predictions/${predictionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        router.push('/predictions')
      } else {
        const errorData = await response.json()
        console.error('Error updating prediction:', errorData.error)
        // You could add toast notification here
      }
    } catch (error) {
      console.error('Error updating prediction:', error)
      // You could add toast notification here
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Loading prediction...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!prediction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Prediction Not Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              The prediction you&apos;re looking for doesn&apos;t exist or has been deleted.
            </p>
            <Button onClick={() => router.push('/predictions')}>
              Back to Predictions
            </Button>
          </div>
        </div>
      </div>
    )
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
                Edit Prediction
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Update your trading strategy prediction details
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Target className="h-3 w-3" />
              <span>Edit Mode</span>
            </Badge>
          </div>
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-lg font-semibold mb-4">Current Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Strategy</p>
              <p className="font-medium">{prediction.strategy}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
              <Badge 
                variant="outline" 
                className={`${
                  prediction.status === 'PASSED'
                    ? 'text-green-600 border-green-200'
                    : prediction.status === 'FAILED'
                    ? 'text-red-600 border-red-200'
                    : 'text-yellow-600 border-yellow-200'
                }`}
              >
                {prediction.status}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Confidence</p>
              <p className="font-medium">Level {prediction.confidence}</p>
            </div>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 shadow-2xl border border-white/20">
            <CardHeader className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Update Prediction
                </CardTitle>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Modify the details of your trading strategy prediction
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              <PredictionForm
                onSubmit={handleUpdatePrediction}
                isLoading={isSaving}
                mode="edit"
                initialData={{
                  predictionDate: new Date(prediction.predictionDate),
                  strategy: prediction.strategy,
                  strategyNotes: prediction.strategyNotes || '',
                  confidence: prediction.confidence,
                  notes: prediction.notes || ''
                }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
