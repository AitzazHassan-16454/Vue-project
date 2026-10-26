<script setup lang="ts">
import { CreditCard, Download, Search } from '@lucide/vue'

const dummyTransactions = [
  { id: 'TXN-9401', client: 'Acme Technologies', plan: 'Enterprise Pro', amount: '$2,400.00', status: 'Completed', date: 'Oct 26, 2026' },
  { id: 'TXN-9402', client: 'HyperScale Labs', plan: 'Team Plan', amount: '$490.00', status: 'Completed', date: 'Oct 25, 2026' },
  { id: 'TXN-9403', client: 'Starlight Media', plan: 'Growth Tier', amount: '$850.00', status: 'Pending', date: 'Oct 25, 2026' },
  { id: 'TXN-9404', client: 'Zenith Retail Corp', plan: 'Enterprise Custom', amount: '$4,200.00', status: 'Completed', date: 'Oct 24, 2026' },
  { id: 'TXN-9405', client: 'DevSprint IO', plan: 'Developer Starter', amount: '$99.00', status: 'Failed', date: 'Oct 23, 2026' },
]
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl md:text-2xl font-bold text-white tracking-tight">Financial Ledger & Transactions</h2>
        <p class="text-xs md:text-sm text-slate-400">Audit trail, invoice history, and billing records.</p>
      </div>

      <button type="button" class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/20 transition self-start sm:self-auto">
        <Download class="w-3.5 h-3.5" />
        <span>Export CSV</span>
      </button>
    </div>

    <!-- Table Container -->
    <div class="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80">
      <div class="flex items-center justify-between mb-4">
        <div class="relative w-64">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter records..."
            class="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-800 border border-slate-700/60 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <span class="text-xs text-slate-400 font-mono">Showing 5 of 5 records</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 bg-slate-800/40">
            <tr>
              <th class="py-3 px-4">Transaction ID</th>
              <th class="py-3 px-4">Client</th>
              <th class="py-3 px-4">Subscription</th>
              <th class="py-3 px-4">Amount</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            <tr v-for="tx in dummyTransactions" :key="tx.id" class="hover:bg-slate-800/40 transition">
              <td class="py-3.5 px-4 font-mono font-medium text-blue-400">{{ tx.id }}</td>
              <td class="py-3.5 px-4 font-semibold text-white">{{ tx.client }}</td>
              <td class="py-3.5 px-4 text-slate-400">{{ tx.plan }}</td>
              <td class="py-3.5 px-4 font-bold text-slate-200">{{ tx.amount }}</td>
              <td class="py-3.5 px-4">
                <span
                  :class="[
                    'px-2 py-0.5 rounded-full text-[10px] font-semibold border',
                    tx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    tx.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  ]"
                >
                  {{ tx.status }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-slate-400">{{ tx.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
