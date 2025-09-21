'use client'

import { useState } from 'react'
import { useCapital } from '@/hooks/useCapital'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  BarChart3,
  Clock,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function CapitalPage() {
  const { pools, allocation, transactions, loading, error, setupCapital, addTransaction } = useCapital()
  const [showSetup, setShowSetup] = useState(false)
  const [showTransaction, setShowTransaction] = useState(false)
  const [setupData, setSetupData] = useState({
    totalAmount: '',
    equityAmount: '',
    fnoAmount: '',
    description: ''
  })
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

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await setupCapital({
      totalAmount: parseFloat(setupData.totalAmount),
      equityAmount: parseFloat(setupData.equityAmount),
      fnoAmount: parseFloat(setupData.fnoAmount),
      description: setupData.description
    })
    
    if (success) {
      setShowSetup(false)
      setSetupData({ totalAmount: '', equityAmount: '', fnoAmount: '', description: '' })
    }
  }

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await addTransaction({
      poolId: transactionData.poolId,
      transactionType: transactionData.transactionType,
      amount: parseFloat(transactionData.amount),
      description: transactionData.description
    })
    
    if (success) {
      setShowTransaction(false)
      setTransactionData({ poolId: '', transactionType: 'DEPOSIT', amount: '', description: '' })
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

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading capital data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  const hasCapitalSetup = pools.length > 0

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Capital Management</h1>
          <p className="text-muted-foreground">
            Manage your trading capital allocation and track performance
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/capital/transactions">
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              View Transactions
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => setShowTransaction(true)}
            disabled={!hasCapitalSetup}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowSetup(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {hasCapitalSetup ? 'Update Capital' : 'Setup Capital'}
          </Button>
        </div>
      </div>

      {!hasCapitalSetup ? (
        /* Initial Setup */
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Setup Your Trading Capital
            </CardTitle>
            <CardDescription>
              Set up your total capital and allocate it between equity and F&O trading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSetupSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="totalAmount">Total Capital Amount (₹)</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  placeholder="1000000"
                  value={setupData.totalAmount}
                  onChange={(e) => setSetupData(prev => ({ ...prev, totalAmount: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="equityAmount">Equity Capital Amount (₹)</Label>
                  <Input
                    id="equityAmount"
                    type="number"
                    min="0"
                    placeholder="700000"
                    value={setupData.equityAmount}
                    onChange={(e) => setSetupData(prev => ({ 
                      ...prev, 
                      equityAmount: e.target.value
                    }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fnoAmount">F&O Capital Amount (₹)</Label>
                  <Input
                    id="fnoAmount"
                    type="number"
                    min="0"
                    placeholder="300000"
                    value={setupData.fnoAmount}
                    onChange={(e) => setSetupData(prev => ({ 
                      ...prev, 
                      fnoAmount: e.target.value
                    }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Trading capital for 2024"
                  value={setupData.description}
                  onChange={(e) => setSetupData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Allocation Preview</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total Capital:</span>
                    <span className="font-medium">{formatCurrency(parseFloat(setupData.totalAmount || '0'))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Equity Capital:</span>
                    <span className="font-medium">{formatCurrency(parseFloat(setupData.equityAmount || '0'))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>F&O Capital:</span>
                    <span className="font-medium">{formatCurrency(parseFloat(setupData.fnoAmount || '0'))}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1 mt-2">
                    <span>Remaining:</span>
                    <span className={`font-medium ${(parseFloat(setupData.totalAmount || '0') - parseFloat(setupData.equityAmount || '0') - parseFloat(setupData.fnoAmount || '0')) < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {formatCurrency(parseFloat(setupData.totalAmount || '0') - parseFloat(setupData.equityAmount || '0') - parseFloat(setupData.fnoAmount || '0'))}
                    </span>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Setup Capital
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        /* Capital Overview */
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Capital</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(allocation?.totalCapital || 0)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {allocation?.totalPnl && allocation.totalPnl >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={allocation?.totalPnl && allocation.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {formatCurrency(allocation?.totalPnl || 0)} ({formatPercentage(allocation?.totalReturn || 0)})
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Equity Capital</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(allocation?.equityCapital || 0)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {allocation?.equityPnl && allocation.equityPnl >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={allocation?.equityPnl && allocation.equityPnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {formatCurrency(allocation?.equityPnl || 0)} ({formatPercentage(allocation?.equityReturn || 0)})
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">F&O Capital</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(allocation?.fnoCapital || 0)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {allocation?.fnoPnl && allocation.fnoPnl >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={allocation?.fnoPnl && allocation.fnoPnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {formatCurrency(allocation?.fnoPnl || 0)} ({formatPercentage(allocation?.fnoReturn || 0)})
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Capital Pools */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pools.map((pool) => (
                  <Card key={pool.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{pool.name}</span>
                        <Badge variant={pool.isActive ? 'default' : 'secondary'}>
                          {pool.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{pool.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current Balance</span>
                          <span className="font-medium">{formatCurrency(pool.currentAmount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Initial Amount</span>
                          <span className="font-medium">{formatCurrency(pool.initialAmount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Total P&L</span>
                          <span className={`font-medium ${pool.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {formatCurrency(pool.totalPnl)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Return %</span>
                          <span className={`font-medium ${pool.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {formatPercentage((pool.totalPnl / pool.initialAmount) * 100)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Invested</span>
                          <span>{formatCurrency(pool.totalInvested)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Withdrawn</span>
                          <span>{formatCurrency(pool.totalWithdrawn)}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Capital Utilization</span>
                          <span>{((pool.totalInvested / pool.initialAmount) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={(pool.totalInvested / pool.initialAmount) * 100} 
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest capital transactions across all pools</CardDescription>
                </div>
                <Link href="/capital/transactions">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <Card>
                <CardContent className="pt-6">
                  {transactions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium mb-2">No transactions yet</p>
                      <p className="text-sm">Start by adding your first transaction</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {transactions.slice(0, 5).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-full ${
                              transaction.transactionType === 'DEPOSIT' || transaction.transactionType === 'PROFIT' || transaction.transactionType === 'TRANSFER_IN'
                                ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                              {transaction.transactionType === 'DEPOSIT' || transaction.transactionType === 'PROFIT' || transaction.transactionType === 'TRANSFER_IN' ? (
                                <ArrowUpRight className="h-4 w-4" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{transaction.pool?.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {transaction.description || transaction.transactionType}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(transaction.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-medium ${
                              transaction.transactionType === 'DEPOSIT' || transaction.transactionType === 'PROFIT' || transaction.transactionType === 'TRANSFER_IN'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}>
                              {transaction.transactionType === 'DEPOSIT' || transaction.transactionType === 'PROFIT' || transaction.transactionType === 'TRANSFER_IN' ? '+' : '-'}
                              {formatCurrency(transaction.amount)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Balance: {formatCurrency(transaction.balanceAfter)}
                            </div>
                          </div>
                        </div>
                      ))}
                      {transactions.length > 5 && (
                        <div className="text-center pt-4">
                          <Link href="/capital/transactions">
                            <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                              View {transactions.length - 5} more transactions
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Setup Modal */}
      {showSetup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Setup Capital</CardTitle>
              <CardDescription>
                {hasCapitalSetup ? 'Update your capital allocation' : 'Set up your trading capital'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSetupSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="modal-totalAmount">Total Capital Amount (₹)</Label>
                  <Input
                    id="modal-totalAmount"
                    type="number"
                    placeholder="1000000"
                    value={setupData.totalAmount}
                    onChange={(e) => setSetupData(prev => ({ ...prev, totalAmount: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="modal-equityAmount">Equity Amount (₹)</Label>
                    <Input
                      id="modal-equityAmount"
                      type="number"
                      min="0"
                      placeholder="700000"
                      value={setupData.equityAmount}
                      onChange={(e) => setSetupData(prev => ({ 
                        ...prev, 
                        equityAmount: e.target.value
                      }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modal-fnoAmount">F&O Amount (₹)</Label>
                    <Input
                      id="modal-fnoAmount"
                      type="number"
                      min="0"
                      placeholder="300000"
                      value={setupData.fnoAmount}
                      onChange={(e) => setSetupData(prev => ({ 
                        ...prev, 
                        fnoAmount: e.target.value
                      }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modal-description">Description</Label>
                  <Input
                    id="modal-description"
                    placeholder="Trading capital for 2024"
                    value={setupData.description}
                    onChange={(e) => setSetupData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowSetup(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {hasCapitalSetup ? 'Update' : 'Setup'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transaction Modal */}
      {showTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
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
                  <Button type="button" variant="outline" onClick={() => setShowTransaction(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Add Transaction
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
  )
}
