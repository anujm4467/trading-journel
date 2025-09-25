'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { CalendarIcon, Target, TrendingUp, FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { DateTimePicker } from '@/components/ui/date-time-picker'

import { 
  PredictionFormData, 
  PREDICTION_DIRECTION_OPTIONS,
  getConfidenceColor, 
  getConfidenceLabel,
  getDirectionColor,
  getDirectionIcon,
  PredictionDirection
} from '@/types/prediction'
import tradeData from '@/data/tradeData.json'

const predictionSchema = z.object({
  predictionDate: z.date({
    message: 'Prediction date is required'
  }),
  strategy: z.string().min(1, 'Strategy is required'),
  direction: z.enum(['BULLISH', 'BEARISH', 'NEUTRAL'], {
    message: 'Direction is required'
  }),
  strategyNotes: z.string().optional(),
  confidence: z.number().min(1, 'Confidence must be at least 1').max(10, 'Confidence must be at most 10'),
  notes: z.string().optional()
})

interface PredictionFormProps {
  onSubmit: (data: PredictionFormData) => Promise<void>
  initialData?: Partial<PredictionFormData>
  isLoading?: boolean
  mode?: 'create' | 'edit'
}

export function PredictionForm({ 
  onSubmit, 
  initialData, 
  isLoading = false, 
  mode = 'create' 
}: PredictionFormProps) {

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<PredictionFormData>({
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      predictionDate: initialData?.predictionDate || new Date(),
      strategy: initialData?.strategy || '',
      direction: initialData?.direction || 'BULLISH',
      strategyNotes: initialData?.strategyNotes || '',
      confidence: initialData?.confidence || 5,
      notes: initialData?.notes || ''
    }
  })

  const watchedStrategy = watch('strategy')
  const watchedDirection = watch('direction')
  const watchedConfidence = watch('confidence')

  const handleStrategyChange = (strategy: string) => {
    setValue('strategy', strategy)
  }

  const handleDirectionChange = (direction: PredictionDirection) => {
    setValue('direction', direction)
  }

  const handleConfidenceChange = (value: number[]) => {
    const newConfidence = value[0]
    setValue('confidence', newConfidence)
  }

  const onFormSubmit = async (data: PredictionFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Error submitting prediction form:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto"
    >
      <div className="max-w-4xl mx-auto">
        {/* Main Form */}
        <div>
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 shadow-2xl border border-white/20">
            <CardContent className="space-y-12 pt-12 px-8">
              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-12">
                {/* Prediction Date */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                      <CalendarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <Label htmlFor="predictionDate" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Prediction Date & Time
                      </Label>
                      <p className="text-base text-gray-500 dark:text-gray-400 mt-1">When are you making this prediction?</p>
                    </div>
                  </div>
                  <div className="ml-12">
                    <DateTimePicker
                      value={watch('predictionDate')}
                      onChange={(date) => setValue('predictionDate', date)}
                      placeholder="Select prediction date and time"
                    />
                    {errors.predictionDate && (
                      <p className="text-sm text-red-500 mt-2">{errors.predictionDate.message}</p>
                    )}
                  </div>
                </div>

                {/* Strategy Selection */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
                      <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <Label htmlFor="strategy" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Trading Strategy
                      </Label>
                      <p className="text-base text-gray-500 dark:text-gray-400 mt-1">What strategy are you using for this prediction?</p>
                    </div>
                  </div>
                  <div className="ml-12">
                    <Select value={watchedStrategy} onValueChange={handleStrategyChange}>
                      <SelectTrigger className="w-full h-12 text-base">
                        <SelectValue placeholder="Select a trading strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        {tradeData.strategyTags.map((strategy) => (
                          <SelectItem key={strategy.id} value={strategy.name} className="text-base">
                            {strategy.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.strategy && (
                      <p className="text-sm text-red-500 mt-2">{errors.strategy.message}</p>
                    )}
                  </div>
                </div>

                {/* Market Direction */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20">
                      <Target className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <Label htmlFor="direction" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Market Direction
                      </Label>
                      <p className="text-base text-gray-500 dark:text-gray-400 mt-1">What direction do you predict the market will move?</p>
                    </div>
                  </div>
                  <div className="ml-12">
                    <div className="grid grid-cols-3 gap-8">
                      {PREDICTION_DIRECTION_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleDirectionChange(option.value as PredictionDirection)}
                          className={`p-8 rounded-2xl border-2 transition-all duration-200 ${
                            watchedDirection === option.value
                              ? `${getDirectionColor(option.value)} border-current bg-opacity-10`
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="text-center space-y-3">
                            <div className="text-3xl">{getDirectionIcon(option.value as PredictionDirection)}</div>
                            <div className={`text-lg font-semibold ${watchedDirection === option.value ? getDirectionColor(option.value) : 'text-gray-700 dark:text-gray-300'}`}>
                              {option.label}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    {errors.direction && (
                      <p className="text-sm text-red-500 mt-2">{errors.direction.message}</p>
                    )}
                  </div>
                </div>

                {/* Strategy Notes */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                      <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <Label htmlFor="strategyNotes" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Strategy Notes
                      </Label>
                      <p className="text-base text-gray-500 dark:text-gray-400 mt-1">Describe your approach, entry/exit criteria, and risk management</p>
                    </div>
                  </div>
                  <div className="ml-12">
                    <Textarea
                      {...register('strategyNotes')}
                      placeholder="Describe your strategy approach, entry/exit criteria, risk management, etc."
                      className="min-h-[160px] resize-none text-base p-4"
                    />
                    {errors.strategyNotes && (
                      <p className="text-sm text-red-500 mt-2">{errors.strategyNotes.message}</p>
                    )}
                  </div>
                </div>

                {/* Confidence Level */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20">
                      <Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <Label className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Confidence Level: {getConfidenceLabel(watchedConfidence)}
                      </Label>
                      <p className="text-base text-gray-500 dark:text-gray-400 mt-1">How confident are you in this prediction? (1-10 scale)</p>
                    </div>
                  </div>
                  <div className="ml-12 space-y-8">
                    <div className="space-y-4">
                      <Slider
                        value={[watchedConfidence]}
                        onValueChange={handleConfidenceChange}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>Very Low (1)</span>
                        <span>Maximum (10)</span>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Badge 
                        variant="outline" 
                        className={`${getConfidenceColor(watchedConfidence)} border-current text-base px-4 py-2`}
                      >
                        Level {watchedConfidence} - {getConfidenceLabel(watchedConfidence)}
                      </Badge>
                    </div>
                    {errors.confidence && (
                      <p className="text-sm text-red-500 mt-2">{errors.confidence.message}</p>
                    )}
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                      <FileText className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <Label htmlFor="notes" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Additional Notes (Optional)
                      </Label>
                      <p className="text-base text-gray-500 dark:text-gray-400 mt-1">Any additional observations, market conditions, or personal notes</p>
                    </div>
                  </div>
                  <div className="ml-12">
                    <Textarea
                      {...register('notes')}
                      placeholder="Any additional observations, market conditions, or personal notes..."
                      className="min-h-[120px] resize-none text-base p-4"
                    />
                    {errors.notes && (
                      <p className="text-sm text-red-500 mt-2">{errors.notes.message}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-12"
                >
                  <Button
                    type="submit"
                    disabled={!isValid || isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl text-xl"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving Prediction...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <Target className="h-5 w-5" />
                        <span>{mode === 'create' ? 'Create Prediction' : 'Update Prediction'}</span>
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
