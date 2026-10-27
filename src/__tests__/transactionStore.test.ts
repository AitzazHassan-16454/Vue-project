import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTransactionStore } from '@/stores/transactionStore'

describe('transactionStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default seed transactions', () => {
    const store = useTransactionStore()
    expect(store.list.length).toBeGreaterThan(0)
    expect(store.totalVolume).toBeGreaterThan(0)
  })

  it('calculates total volume and status counts accurately', () => {
    const store = useTransactionStore()
    const completed = store.list.filter((t) => t.status === 'Completed')
    const calculatedSum = completed.reduce((acc, t) => acc + t.amount, 0)
    expect(store.totalVolume).toBe(calculatedSum)
    expect(store.completedCount).toBe(completed.length)
  })

  it('adds a transaction at the beginning of the list', () => {
    const store = useTransactionStore()
    const initialCount = store.list.length

    const newTx = store.addTransaction({
      client: 'Vanguard Systems',
      category: 'Enterprise Annual Tier',
      amount: 15000,
      status: 'Completed',
    })

    expect(store.list.length).toBe(initialCount + 1)
    expect(store.list[0]?.id).toBe(newTx.id)
    expect(store.list[0]?.client).toBe('Vanguard Systems')
    expect(store.list[0]?.avatar).toBe('VS')
  })

  it('updates an existing transaction correctly', () => {
    const store = useTransactionStore()
    const firstTx = store.list[0]
    expect(firstTx).toBeDefined()
    if (!firstTx) return

    store.updateTransaction(firstTx.id, {
      amount: 99999,
      status: 'Pending',
    })

    const updated = store.list.find((t) => t.id === firstTx.id)
    expect(updated?.amount).toBe(99999)
    expect(updated?.status).toBe('Pending')
  })

  it('deletes a transaction by id', () => {
    const store = useTransactionStore()
    const firstTx = store.list[0]
    expect(firstTx).toBeDefined()
    if (!firstTx) return

    const initialCount = store.list.length
    store.deleteTransaction(firstTx.id)

    expect(store.list.length).toBe(initialCount - 1)
    expect(store.list.find((t) => t.id === firstTx.id)).toBeUndefined()
  })
})
