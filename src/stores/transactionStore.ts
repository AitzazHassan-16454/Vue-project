import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Transaction {
  id: string
  client: string
  category: string
  amount: number
  status: 'Completed' | 'Pending' | 'Refunded'
  date: string
  avatar: string
}

export const useTransactionStore = defineStore(
  'transactions',
  () => {
    const list = ref<Transaction[]>([
      {
        id: 'TXN-9401',
        client: 'Acme Cloud Platform',
        category: 'Enterprise Annual Tier',
        amount: 14200.0,
        status: 'Completed',
        date: 'Oct 26, 2026',
        avatar: 'AC',
      },
      {
        id: 'TXN-9402',
        client: 'HyperScale AI Labs',
        category: 'GPU Cluster Lease',
        amount: 8450.0,
        status: 'Completed',
        date: 'Oct 26, 2026',
        avatar: 'HS',
      },
      {
        id: 'TXN-9403',
        client: 'Starlight Media Studios',
        category: 'Media Transcoding License',
        amount: 1250.0,
        status: 'Pending',
        date: 'Oct 25, 2026',
        avatar: 'SM',
      },
      {
        id: 'TXN-9404',
        client: 'Zenith Retail Solutions',
        category: 'POS Ingestion Stream',
        amount: 4900.0,
        status: 'Completed',
        date: 'Oct 25, 2026',
        avatar: 'ZR',
      },
      {
        id: 'TXN-9405',
        client: 'DevSprint Operations',
        category: 'Developer Pro Seats',
        amount: 480.0,
        status: 'Refunded',
        date: 'Oct 24, 2026',
        avatar: 'DS',
      },
      {
        id: 'TXN-9406',
        client: 'Orbit Robotics Group',
        category: 'Autonomous Telemetry Core',
        amount: 6700.0,
        status: 'Completed',
        date: 'Oct 24, 2026',
        avatar: 'OR',
      },
      {
        id: 'TXN-9407',
        client: 'FinVanguard Technologies',
        category: 'Ledger Audit API License',
        amount: 3200.0,
        status: 'Completed',
        date: 'Oct 23, 2026',
        avatar: 'FV',
      },
      {
        id: 'TXN-9408',
        client: 'AeroDynamics Aerospace',
        category: 'Simulation Stream Tier',
        amount: 9100.0,
        status: 'Pending',
        date: 'Oct 22, 2026',
        avatar: 'AD',
      },
    ])

    const totalVolume = computed(() =>
      list.value
        .filter((t) => t.status === 'Completed')
        .reduce((sum, t) => sum + t.amount, 0)
    )

    const completedCount = computed(
      () => list.value.filter((t) => t.status === 'Completed').length
    )

    const pendingCount = computed(
      () => list.value.filter((t) => t.status === 'Pending').length
    )

    function addTransaction(tx: Omit<Transaction, 'id' | 'date' | 'avatar'>) {
      const randomNum = Math.floor(1000 + Math.random() * 9000)
      const initials = tx.client
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

      const today = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })

      const newTx: Transaction = {
        id: `TXN-${randomNum}`,
        client: tx.client,
        category: tx.category,
        amount: Number(tx.amount),
        status: tx.status,
        date: today,
        avatar: initials || 'TX',
      }

      list.value.unshift(newTx)
    }

    function deleteTransaction(id: string) {
      list.value = list.value.filter((t) => t.id !== id)
    }

    function updateTransaction(id: string, updated: Partial<Omit<Transaction, 'id'>>) {
      const idx = list.value.findIndex((t) => t.id === id)
      const current = list.value[idx]
      if (idx !== -1 && current) {
        list.value[idx] = {
          id: current.id,
          client: updated.client ?? current.client,
          category: updated.category ?? current.category,
          amount: updated.amount ?? current.amount,
          status: updated.status ?? current.status,
          date: updated.date ?? current.date,
          avatar: updated.avatar ?? current.avatar,
        }
      }
    }

    return {
      list,
      totalVolume,
      completedCount,
      pendingCount,
      addTransaction,
      deleteTransaction,
      updateTransaction,
    }
  },
  {
    persist: true,
  }
)
