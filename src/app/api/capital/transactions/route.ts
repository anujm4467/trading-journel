import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'
import { TransactionType } from '@prisma/client'

// GET /api/capital/transactions - Get capital transactions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const poolId = searchParams.get('poolId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where = poolId ? { poolId } : {}

    const [transactions, total] = await Promise.all([
      prisma.capitalTransaction.findMany({
        where,
        include: {
          pool: true
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.capitalTransaction.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        transactions,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        }
      }
    })
  } catch (error) {
    console.error('Error fetching capital transactions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

// POST /api/capital/transactions - Create a capital transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { poolId, transactionType, amount, description, referenceId, referenceType } = body

    if (!poolId || !transactionType || !amount) {
      return NextResponse.json(
        { success: false, error: 'Pool ID, transaction type, and amount are required' },
        { status: 400 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Get current pool balance
    const pool = await prisma.capitalPool.findUnique({
      where: { id: poolId }
    })

    if (!pool) {
      return NextResponse.json(
        { success: false, error: 'Capital pool not found' },
        { status: 404 }
      )
    }

    // Calculate new balance
    let newBalance = pool.currentAmount
    let newTotalPnl = pool.totalPnl
        const newTotalInvested = pool.totalInvested
    let newTotalWithdrawn = pool.totalWithdrawn

    switch (transactionType) {
      case 'DEPOSIT':
        newBalance += amount
        break
      case 'WITHDRAWAL':
        if (amount > pool.currentAmount) {
          return NextResponse.json(
            { success: false, error: 'Insufficient balance for withdrawal' },
            { status: 400 }
          )
        }
        newBalance -= amount
        newTotalWithdrawn += amount
        break
      case 'PROFIT':
        newBalance += amount
        newTotalPnl += amount
        break
      case 'LOSS':
        if (amount > pool.currentAmount) {
          return NextResponse.json(
            { success: false, error: 'Loss amount cannot exceed current balance' },
            { status: 400 }
          )
        }
        newBalance -= amount
        newTotalPnl -= amount
        break
      case 'TRANSFER_IN':
        newBalance += amount
        break
      case 'TRANSFER_OUT':
        if (amount > pool.currentAmount) {
          return NextResponse.json(
            { success: false, error: 'Insufficient balance for transfer' },
            { status: 400 }
          )
        }
        newBalance -= amount
        break
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create transaction record
      const transaction = await tx.capitalTransaction.create({
        data: {
          poolId,
          transactionType: transactionType as TransactionType,
          amount,
          description,
          referenceId,
          referenceType,
          balanceAfter: newBalance
        },
        include: {
          pool: true
        }
      })

      // Update pool balance
      await tx.capitalPool.update({
        where: { id: poolId },
        data: {
          currentAmount: newBalance,
          totalPnl: newTotalPnl,
          totalInvested: newTotalInvested,
          totalWithdrawn: newTotalWithdrawn
        }
      })

      return transaction
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Transaction created successfully'
    })
  } catch (error) {
    console.error('Error creating capital transaction:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}

// DELETE /api/capital/transactions - Delete a capital transaction
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get('id')

    if (!transactionId) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID is required' },
        { status: 400 }
      )
    }

    // Get the transaction to understand its impact
    const transaction = await prisma.capitalTransaction.findUnique({
      where: { id: transactionId },
      include: { pool: true }
    })

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Check if transaction is referenced by a trade
    if (transaction.referenceType === 'TRADE' && transaction.referenceId) {
      const trade = await prisma.trade.findUnique({
        where: { id: transaction.referenceId }
      })
      
      if (trade) {
        return NextResponse.json(
          { success: false, error: 'Cannot delete transaction linked to an existing trade' },
          { status: 400 }
        )
      }
    }

    // Use transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Delete the transaction
      await tx.capitalTransaction.delete({
        where: { id: transactionId }
      })

      // Recalculate pool balance by getting all remaining transactions
      const remainingTransactions = await tx.capitalTransaction.findMany({
        where: { poolId: transaction.poolId },
        orderBy: { createdAt: 'asc' }
      })

      // Recalculate the pool balance from scratch
      let currentBalance = transaction.pool.initialAmount
      let totalPnl = 0
      let totalInvested = 0
      let totalWithdrawn = 0

      for (const txn of remainingTransactions) {
        switch (txn.transactionType) {
          case 'DEPOSIT':
            currentBalance += txn.amount
            break
          case 'WITHDRAWAL':
            currentBalance -= txn.amount
            totalWithdrawn += txn.amount
            break
          case 'PROFIT':
            currentBalance += txn.amount
            totalPnl += txn.amount
            break
          case 'LOSS':
            currentBalance -= txn.amount
            totalPnl -= txn.amount
            break
          case 'TRANSFER_IN':
            currentBalance += txn.amount
            break
          case 'TRANSFER_OUT':
            currentBalance -= txn.amount
            break
        }
      }

      // Update pool with recalculated values
      await tx.capitalPool.update({
        where: { id: transaction.poolId },
        data: {
          currentAmount: currentBalance,
          totalPnl,
          totalInvested,
          totalWithdrawn
        }
      })
    })

    return NextResponse.json({
      success: true,
      message: 'Transaction deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting capital transaction:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete transaction' },
      { status: 500 }
    )
  }
}