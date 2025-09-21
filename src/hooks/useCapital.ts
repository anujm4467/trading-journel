import { useState, useEffect, useCallback } from 'react'
import { CapitalPool, CapitalTransaction, CapitalAllocation, CapitalSetupData } from '@/types/trade'

interface UseCapitalReturn {
  pools: CapitalPool[]
  allocation: CapitalAllocation | null
  transactions: CapitalTransaction[]
  loading: boolean
  error: string | null
  setupCapital: (data: CapitalSetupData) => Promise<boolean>
  addTransaction: (data: {
    poolId: string
    transactionType: 'DEPOSIT' | 'WITHDRAWAL' | 'PROFIT' | 'LOSS' | 'TRANSFER_IN' | 'TRANSFER_OUT'
    amount: number
    description?: string
    referenceId?: string
    referenceType?: string
  }) => Promise<boolean>
  deleteTransaction: (transactionId: string) => Promise<boolean>
  refreshData: () => Promise<void>
}

export function useCapital(): UseCapitalReturn {
  const [pools, setPools] = useState<CapitalPool[]>([])
  const [allocation, setAllocation] = useState<CapitalAllocation | null>(null)
  const [transactions, setTransactions] = useState<CapitalTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCapitalData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/capital')
      const result = await response.json()

      if (result.success) {
        setPools(result.data.pools)
        setAllocation(result.data.allocation)
      } else {
        setError(result.error || 'Failed to fetch capital data')
      }
    } catch (err) {
      setError('Network error while fetching capital data')
      console.error('Error fetching capital data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTransactions = useCallback(async (poolId?: string) => {
    try {
      const url = poolId ? `/api/capital/transactions?poolId=${poolId}` : '/api/capital/transactions'
      const response = await fetch(url)
      const result = await response.json()

      if (result.success) {
        setTransactions(result.data.transactions)
      } else {
        setError(result.error || 'Failed to fetch transactions')
      }
    } catch (err) {
      setError('Network error while fetching transactions')
      console.error('Error fetching transactions:', err)
    }
  }, [])

  const setupCapital = useCallback(async (data: CapitalSetupData): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/capital', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setPools(result.data)
        // Recalculate allocation
        const totalPool = result.data.find((p: CapitalPool) => p.poolType === 'TOTAL')
        const equityPool = result.data.find((p: CapitalPool) => p.poolType === 'EQUITY')
        const fnoPool = result.data.find((p: CapitalPool) => p.poolType === 'FNO')

        const newAllocation: CapitalAllocation = {
          totalCapital: totalPool?.currentAmount || 0,
          equityCapital: equityPool?.currentAmount || 0,
          fnoCapital: fnoPool?.currentAmount || 0,
          availableEquity: equityPool?.currentAmount || 0,
          availableFno: fnoPool?.currentAmount || 0,
          totalPnl: totalPool?.totalPnl || 0,
          equityPnl: equityPool?.totalPnl || 0,
          fnoPnl: fnoPool?.totalPnl || 0,
          totalReturn: totalPool ? (totalPool.totalPnl / totalPool.initialAmount) * 100 : 0,
          equityReturn: equityPool ? (equityPool.totalPnl / equityPool.initialAmount) * 100 : 0,
          fnoReturn: fnoPool ? (fnoPool.totalPnl / fnoPool.initialAmount) * 100 : 0
        }

        setAllocation(newAllocation)
        return true
      } else {
        setError(result.error || 'Failed to setup capital')
        return false
      }
    } catch (err) {
      setError('Network error while setting up capital')
      console.error('Error setting up capital:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addTransaction = useCallback(async (data: {
    poolId: string
    transactionType: 'DEPOSIT' | 'WITHDRAWAL' | 'PROFIT' | 'LOSS' | 'TRANSFER_IN' | 'TRANSFER_OUT'
    amount: number
    description?: string
    referenceId?: string
    referenceType?: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/capital/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        // Refresh data to get updated balances
        await fetchCapitalData()
        await fetchTransactions()
        return true
      } else {
        setError(result.error || 'Failed to add transaction')
        return false
      }
    } catch (err) {
      setError('Network error while adding transaction')
      console.error('Error adding transaction:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [fetchCapitalData, fetchTransactions])

  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchCapitalData(),
      fetchTransactions()
    ])
  }, [fetchCapitalData, fetchTransactions])

  const deleteTransaction = useCallback(async (transactionId: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/capital/transactions?id=${transactionId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        // Refresh data to get updated pools and transactions
        await refreshData()
        return true
      } else {
        setError(result.error || 'Failed to delete transaction')
        return false
      }
    } catch (err) {
      setError('Network error while deleting transaction')
      console.error('Error deleting transaction:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [refreshData])

  useEffect(() => {
    fetchCapitalData()
    fetchTransactions()
  }, [fetchCapitalData, fetchTransactions])

  return {
    pools,
    allocation,
    transactions,
    loading,
    error,
    setupCapital,
    addTransaction,
    deleteTransaction,
    refreshData
  }
}
