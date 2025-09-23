'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Search, Target, TrendingUp, CheckCircle, XCircle, Clock, Edit, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { Prediction, PredictionUpdateData, getStatusColor, getStatusLabel, getConfidenceColor, getConfidenceLabel } from '@/types/prediction'
import { PredictionStatus, PredictionResult } from '@prisma/client'

export default function PredictionsPage() {
  const router = useRouter()
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [filteredPredictions, setFilteredPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [strategyFilter, setStrategyFilter] = useState<string>('all')
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)

  // Fetch predictions
  const fetchPredictions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/predictions')
      const data = await response.json()
      
      if (data.data) {
        setPredictions(data.data)
        setFilteredPredictions(data.data)
      }
    } catch (error) {
      console.error('Error fetching predictions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Navigate to create prediction page
  const handleCreatePrediction = () => {
    router.push('/predictions/new')
  }

  // Update prediction
  const handleUpdatePrediction = async (id: string, data: PredictionUpdateData) => {
    try {
      const response = await fetch(`/api/predictions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        await fetchPredictions()
        setIsUpdateDialogOpen(false)
        setSelectedPrediction(null)
      }
    } catch (error) {
      console.error('Error updating prediction:', error)
    }
  }

  // Delete prediction
  const handleDeletePrediction = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prediction?')) return

    try {
      const response = await fetch(`/api/predictions/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchPredictions()
      }
    } catch (error) {
      console.error('Error deleting prediction:', error)
    }
  }

  // Filter predictions
  useEffect(() => {
    let filtered = predictions

    if (searchTerm) {
      filtered = filtered.filter(prediction =>
        prediction.strategy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prediction.strategyNotes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prediction.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(prediction => prediction.status === statusFilter)
    }

    if (strategyFilter !== 'all') {
      filtered = filtered.filter(prediction => prediction.strategy === strategyFilter)
    }

    setFilteredPredictions(filtered)
  }, [predictions, searchTerm, statusFilter, strategyFilter])

  useEffect(() => {
    fetchPredictions()
  }, [])

  const getStatusIcon = (status: PredictionStatus) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />
      case 'PASSED':
        return <CheckCircle className="h-4 w-4" />
      case 'FAILED':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUniqueStrategies = () => {
    const strategies = [...new Set(predictions.map(p => p.strategy))]
    return strategies
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Trading Predictions
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track and analyze your trading strategy predictions
            </p>
          </div>
          
          <Button 
            onClick={handleCreatePrediction}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Prediction
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'Total Predictions', value: predictions.length, color: 'blue' },
            { label: 'Pending', value: predictions.filter(p => p.status === 'PENDING').length, color: 'yellow' },
            { label: 'Passed', value: predictions.filter(p => p.status === 'PASSED').length, color: 'green' },
            { label: 'Failed', value: predictions.filter(p => p.status === 'FAILED').length, color: 'red' }
          ].map((stat) => (
            <Card key={stat.label} className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                    <Target className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 border border-white/20"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search predictions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PASSED">Passed</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={strategyFilter} onValueChange={setStrategyFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Strategies</SelectItem>
                {getUniqueStrategies().map(strategy => (
                  <SelectItem key={strategy} value={strategy}>{strategy}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Predictions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg border border-white/20 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-700">
                  <TableHead>Date</TableHead>
                  <TableHead>Strategy</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span>Loading predictions...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredPredictions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No predictions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPredictions.map((prediction, index) => (
                    <motion.tr
                      key={prediction.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-200/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {formatDate(prediction.predictionDate)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{prediction.strategy}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`${getConfidenceColor(prediction.confidence)} border-current`}
                        >
                          {getConfidenceLabel(prediction.confidence)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(prediction.status)} border-current flex items-center space-x-1`}
                        >
                          {getStatusIcon(prediction.status)}
                          <span>{getStatusLabel(prediction.status)}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {prediction.strategyNotes || prediction.notes || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedPrediction(prediction)
                              setIsUpdateDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePrediction(prediction.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>

        {/* Update Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Update Prediction</DialogTitle>
              <DialogDescription>
                Update the status and result of your prediction.
              </DialogDescription>
            </DialogHeader>
            {selectedPrediction && (
              <PredictionUpdateForm
                prediction={selectedPrediction}
                onUpdate={handleUpdatePrediction}
                onClose={() => {
                  setIsUpdateDialogOpen(false)
                  setSelectedPrediction(null)
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Prediction Update Form Component
interface PredictionUpdateFormProps {
  prediction: Prediction
  onUpdate: (id: string, data: PredictionUpdateData) => Promise<void>
  onClose: () => void
}

function PredictionUpdateForm({ prediction, onUpdate, onClose }: PredictionUpdateFormProps) {
  const [status, setStatus] = useState<PredictionStatus>(prediction.status)
  const [result, setResult] = useState<string>(prediction.result || '')
  const [failureReason, setFailureReason] = useState(prediction.failureReason || '')
  const [notes, setNotes] = useState(prediction.notes || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onUpdate(prediction.id, {
        status,
        result: result as PredictionResult,
        failureReason: failureReason || undefined,
        notes: notes || undefined
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Strategy</Label>
          <p className="text-sm text-gray-600 dark:text-gray-400">{prediction.strategy}</p>
        </div>

        <div>
          <Label className="text-sm font-medium">Confidence</Label>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {getConfidenceLabel(prediction.confidence)}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as PredictionStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PASSED">Passed</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {status === 'PASSED' && (
          <div className="space-y-2">
            <Label htmlFor="result">Result</Label>
            <Select value={result} onValueChange={setResult}>
              <SelectTrigger>
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUCCESS">Success</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {status === 'FAILED' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="result">Result</Label>
              <Select value={result} onValueChange={setResult}>
                <SelectTrigger>
                  <SelectValue placeholder="Select result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FAILURE">Failure</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="failureReason">Failure Reason</Label>
              <Textarea
                id="failureReason"
                value={failureReason}
                onChange={(e) => setFailureReason(e.target.value)}
                placeholder="Explain why the prediction failed..."
                className="min-h-[80px]"
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional observations..."
            className="min-h-[80px]"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Prediction'}
        </Button>
      </div>
    </form>
  )
}
