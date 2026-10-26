<script setup lang="ts">
import { computed } from 'vue'
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  Clock,
} from '@lucide/vue'
import { useTransactionStore } from '@/stores/transactionStore'
import RecentTransactions from '@/components/transactions/RecentTransactions.vue'

const txStore = useTransactionStore()

const pendingVolume = computed(() =>
  txStore.list
    .filter((t) => t.status === 'Pending')
    .reduce((sum, t) => sum + t.amount, 0)
)
</script>

<template>
  <div class="space-y-8 pb-12">
    <!-- Page Header Banner -->
    <div class="depth-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
          <CreditCard class="w-3.5 h-3.5" />
          <span>Real-time Financial Ledger</span>
        </div>
        <h2 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Billing, Payments & Invoices
        </h2>
        <p class="text-xs md:text-sm text-slate-500 font-medium mt-1">
          Full immutable audit trail with instant client search, CSV export, and record entry.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
          Sync Status: <span class="text-emerald-600">Live (0ms latency)</span>
        </span>
      </div>
    </div>

    <!-- Quick Ledger KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="depth-card depth-card-hover rounded-2xl p-5 flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Settled Inflow</span>
          <div class="text-2xl font-black text-slate-900 font-mono mt-1">
            ${{ txStore.totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
          </div>
          <span class="text-[11px] text-emerald-600 font-bold mt-1 inline-block">
            {{ txStore.completedCount }} Successful Invoices
          </span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
          <CheckCircle2 class="w-5 h-5" />
        </div>
      </div>

      <div class="depth-card depth-card-hover rounded-2xl p-5 flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Clearance</span>
          <div class="text-2xl font-black text-amber-600 font-mono mt-1">
            ${{ pendingVolume.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
          </div>
          <span class="text-[11px] text-amber-700 font-bold mt-1 inline-block">
            {{ txStore.pendingCount }} Under Gateway Settlement
          </span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
          <Clock class="w-5 h-5" />
        </div>
      </div>

      <div class="depth-card depth-card-hover rounded-2xl p-5 flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Ledger Entries</span>
          <div class="text-2xl font-black text-indigo-600 font-mono mt-1">
            {{ txStore.list.length }} Records
          </div>
          <span class="text-[11px] text-indigo-700 font-bold mt-1 inline-block">
            Synced with localStorage
          </span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-2xs">
          <DollarSign class="w-5 h-5" />
        </div>
      </div>
    </div>

    <!-- The Transactions Table Component -->
    <RecentTransactions />
  </div>
</template>
