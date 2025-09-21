'use client'

import { useState } from 'react'
import { useCapital } from '@/hooks/useCapital'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  DollarSign, 
  Wallet, 
  Plus, 
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Search,
  RefreshCw,
  Calendar,
  Clock,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CapitalTransactionsPage() {
  const { pools, allocation, transactions, loading, error, addTransaction, deleteTransaction, refreshData } = useCapital()
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [showAddCapital, setShowAddCapital] = useState(false)
  const [selectedPool, setSelectedPool] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const [transactionData, setTransactionData] = useState<{
    poolId: string
    transactionType: 'DEPOSIT' | 'WITHDRAWAL' | 'PROFIT' | 'LOSS' | 'TRANSFER_IN' | 'TRANSFER_OUT'
    amount: string
    description: string
  }>({
    poolId: '',
    transactionType: 'DEPOSIT',
    amount: '',
    description: ''
  })

  const [capitalData, setCapitalData] = useState({
    poolId: '',
    amount: '',
    description: ''
  })

  const itemsPerPage = 10

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.pool?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'ALL' || transaction.transactionType === filterType
    const matchesPool = !selectedPool || transaction.poolId === selectedPool
    return matchesSearch && matchesType && matchesPool
  })

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await addTransaction({
      poolId: transactionData.poolId,
      transactionType: transactionData.transactionType,
      amount: parseFloat(transactionData.amount),
      description: transactionData.description
    })
    
    if (success) {
      setShowAddTransaction(false)
      setTransactionData({ poolId: '', transactionType: 'DEPOSIT', amount: '', description: '' })
    }
  }

  const handleAddCapital = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await addTransaction({
      poolId: capitalData.poolId,
      transactionType: 'DEPOSIT',
      amount: parseFloat(capitalData.amount),
      description: capitalData.description || 'Additional capital deposit'
    })
    
    if (success) {
      setShowAddCapital(false)
      setCapitalData({ poolId: '', amount: '', description: '' })
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshData()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleDeleteTransaction = async (transactionId: string) => {
    if (window.confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
      const success = await deleteTransaction(transactionId)
      if (success) {
        // Transaction deleted successfully, data will be refreshed automatically
      }
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
      case 'PROFIT':
      case 'TRANSFER_IN':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />
      case 'WITHDRAWAL':
      case 'LOSS':
      case 'TRANSFER_OUT':
        return <ArrowDownRight className="h-4 w-4 text-red-600" />
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
      case 'PROFIT':
      case 'TRANSFER_IN':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'WITHDRAWAL':
      case 'LOSS':
      case 'TRANSFER_OUT':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <Button onClick={handleRefresh}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Capital Transactions
            </h1>
            <p className="text-muted-foreground">
              Manage your capital movements and track all transactions
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowAddCapital(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Capital
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowAddTransaction(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Capital Overview Cards */}
      {allocation && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Capital</CardTitle>
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800/50">
                  <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatCurrency(allocation.totalCapital)}
                </div>
                <div className={`text-sm font-medium ${allocation.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {allocation.totalPnl >= 0 ? '+' : ''}{formatCurrency(allocation.totalPnl)} ({allocation.totalReturn.toFixed(2)}%)
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="backdrop-blur-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Equity Capital</CardTitle>
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-800/50">
                  <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatCurrency(allocation.equityCapital)}
                </div>
                <div className={`text-sm font-medium ${allocation.equityPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {allocation.equityPnl >= 0 ? '+' : ''}{formatCurrency(allocation.equityPnl)} ({allocation.equityReturn.toFixed(2)}%)
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Available: {formatCurrency(allocation.availableEquity)}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200/50 dark:border-purple-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">F&O Capital</CardTitle>
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-800/50">
                  <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {formatCurrency(allocation.fnoCapital)}
                </div>
                <div className={`text-sm font-medium ${allocation.fnoPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {allocation.fnoPnl >= 0 ? '+' : ''}{formatCurrency(allocation.fnoPnl)} ({allocation.fnoReturn.toFixed(2)}%)
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Available: {formatCurrency(allocation.availableFno)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Filters and Search */}
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
              >
                <option value="ALL">All Types</option>
                <option value="DEPOSIT">Deposits</option>
                <option value="WITHDRAWAL">Withdrawals</option>
                <option value="PROFIT">Profits</option>
                <option value="LOSS">Losses</option>
                <option value="TRANSFER_IN">Transfers In</option>
                <option value="TRANSFER_OUT">Transfers Out</option>
              </select>
              <select
                value={selectedPool}
                onChange={(e) => setSelectedPool(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
              >
                <option value="">All Pools</option>
                {pools.map((pool) => (
                  <option key={pool.id} value={pool.id}>
                    {pool.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <CardDescription>
            Complete record of all capital movements ({filteredTransactions.length} transactions)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No transactions found
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                {searchTerm || filterType !== 'ALL' || selectedPool
                  ? 'Try adjusting your filters'
                  : 'Start by adding your first transaction'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                      <TableHead className="font-bold">Type</TableHead>
                      <TableHead className="font-bold">Pool</TableHead>
                      <TableHead className="font-bold">Description</TableHead>
                      <TableHead className="font-bold text-right">Amount</TableHead>
                      <TableHead className="font-bold text-right">Balance After</TableHead>
                      <TableHead className="font-bold">Date</TableHead>
                      <TableHead className="font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {paginatedTransactions.map((transaction, index) => (
                        <motion.tr
                          key={transaction.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTransactionIcon(transaction.transactionType)}
                              <Badge className={getTransactionColor(transaction.transactionType)}>
                                {transaction.transactionType}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span className="font-medium">{transaction.pool?.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate">
                              {transaction.description || 'No description'}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className={`font-bold ${
                              transaction.transactionType === 'DEPOSIT' || 
                              transaction.transactionType === 'PROFIT' || 
                              transaction.transactionType === 'TRANSFER_IN'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}>
                              {transaction.transactionType === 'DEPOSIT' || 
                               transaction.transactionType === 'PROFIT' || 
                               transaction.transactionType === 'TRANSFER_IN' ? '+' : '-'}
                              {formatCurrency(transaction.amount)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {formatCurrency(transaction.balanceAfter)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <Calendar className="h-3 w-3" />
                              {formatDate(transaction.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteTransaction(transaction.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {showAddTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Add Transaction</CardTitle>
                  <CardDescription>Record a capital transaction</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTransactionSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="transaction-pool">Capital Pool</Label>
                      <select
                        id="transaction-pool"
                        className="w-full p-2 border rounded-md"
                        value={transactionData.poolId}
                        onChange={(e) => setTransactionData(prev => ({ ...prev, poolId: e.target.value }))}
                        required
                      >
                        <option value="">Select pool</option>
                        {pools.map((pool) => (
                          <option key={pool.id} value={pool.id}>
                            {pool.name} - {formatCurrency(pool.currentAmount)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transaction-type">Transaction Type</Label>
                      <select
                        id="transaction-type"
                        className="w-full p-2 border rounded-md"
                        value={transactionData.transactionType}
                        onChange={(e) => setTransactionData(prev => ({ ...prev, transactionType: e.target.value as 'DEPOSIT' | 'WITHDRAWAL' | 'PROFIT' | 'LOSS' | 'TRANSFER_IN' | 'TRANSFER_OUT' }))}
                        required
                      >
                        <option value="DEPOSIT">Deposit</option>
                        <option value="WITHDRAWAL">Withdrawal</option>
                        <option value="PROFIT">Profit</option>
                        <option value="LOSS">Loss</option>
                        <option value="TRANSFER_IN">Transfer In</option>
                        <option value="TRANSFER_OUT">Transfer Out</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transaction-amount">Amount (₹)</Label>
                      <Input
                        id="transaction-amount"
                        type="number"
                        placeholder="10000"
                        value={transactionData.amount}
                        onChange={(e) => setTransactionData(prev => ({ ...prev, amount: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transaction-description">Description</Label>
                      <Input
                        id="transaction-description"
                        placeholder="Optional description"
                        value={transactionData.description}
                        onChange={(e) => setTransactionData(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setShowAddTransaction(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1">
                        Add Transaction
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Capital Modal */}
      <AnimatePresence>
        {showAddCapital && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add Capital
                  </CardTitle>
                  <CardDescription>Add more capital to your trading pools</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddCapital} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="capital-pool">Select Pool</Label>
                      <select
                        id="capital-pool"
                        className="w-full p-2 border rounded-md"
                        value={capitalData.poolId}
                        onChange={(e) => setCapitalData(prev => ({ ...prev, poolId: e.target.value }))}
                        required
                      >
                        <option value="">Select pool</option>
                        {pools.map((pool) => (
                          <option key={pool.id} value={pool.id}>
                            {pool.name} - {formatCurrency(pool.currentAmount)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="capital-amount">Amount to Add (₹)</Label>
                      <Input
                        id="capital-amount"
                        type="number"
                        placeholder="50000"
                        value={capitalData.amount}
                        onChange={(e) => setCapitalData(prev => ({ ...prev, amount: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="capital-description">Description</Label>
                      <Input
                        id="capital-description"
                        placeholder="e.g., Additional capital for Q2 2024"
                        value={capitalData.description}
                        onChange={(e) => setCapitalData(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setShowAddCapital(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1">
                        Add Capital
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
  )
}
