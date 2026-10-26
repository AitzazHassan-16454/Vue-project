<script setup lang="ts">
import {
  TrendingUp,
  DollarSign,
  Users,
  CreditCard,
  ArrowUpRight,
  Sparkles,
} from '@lucide/vue'

const kpis = [
  {
    title: 'Monthly Recurring Revenue',
    value: '$48,250',
    change: '+14.2%',
    isPositive: true,
    icon: DollarSign,
    color: 'from-blue-600 to-indigo-600',
  },
  {
    title: 'Active Customers',
    value: '2,845',
    change: '+8.1%',
    isPositive: true,
    icon: Users,
    color: 'from-emerald-600 to-teal-600',
  },
  {
    title: 'Avg. Revenue Per User',
    value: '$169.50',
    change: '+3.4%',
    isPositive: true,
    icon: CreditCard,
    color: 'from-violet-600 to-purple-600',
  },
  {
    title: 'Net Retention Rate',
    value: '108.4%',
    change: '+2.1%',
    isPositive: true,
    icon: TrendingUp,
    color: 'from-amber-600 to-orange-600',
  },
]
</script>

<template>
  <div class="space-y-8">
    <!-- Welcome Header Banner -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/20 to-slate-900 border border-blue-500/20 p-6 md:p-8">
      <div class="relative z-10 max-w-2xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
          <Sparkles class="w-3.5 h-3.5" />
          <span>Real-time Financial Intelligence</span>
        </div>
        <h2 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Welcome back, Aitzaz
        </h2>
        <p class="text-sm md:text-base text-slate-300 mt-2 leading-relaxed">
          Your revenue is up <span class="text-emerald-400 font-semibold">+14.2%</span> compared to last month. All payment gateways and telemetry pipelines are running smoothly.
        </p>
      </div>
      <div class="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
    </div>

    <!-- KPI Metric Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <div
        v-for="kpi in kpis"
        :key="kpi.title"
        class="group p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5"
      >
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-medium text-slate-400">{{ kpi.title }}</span>
          <div :class="['w-9 h-9 rounded-xl bg-gradient-to-tr flex items-center justify-center text-white shadow-md', kpi.color]">
            <component :is="kpi.icon" class="w-4 h-4" />
          </div>
        </div>
        <div class="flex items-baseline justify-between">
          <div class="text-2xl font-bold text-white tracking-tight">
            {{ kpi.value }}
          </div>
          <span class="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
            <ArrowUpRight class="w-3 h-3" />
            {{ kpi.change }}
          </span>
        </div>
      </div>
    </div>

    <!-- Overview Content Placeholders for Charts & Ledger -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Chart Card Placeholder -->
      <div class="lg:col-span-2 p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex flex-col justify-between min-h-[340px]">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 class="text-base font-semibold text-white">Revenue & Cash Flow Dynamics</h3>
            <p class="text-xs text-slate-400">Monthly progression and expense analysis</p>
          </div>
          <span class="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/50">
            Phase 4 Integration
          </span>
        </div>
        <div class="flex-1 flex flex-col items-center justify-center py-12 text-slate-400">
          <div class="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
            <TrendingUp class="w-6 h-6" />
          </div>
          <p class="text-sm font-medium text-slate-300">Interactive Chart.js Canvas</p>
          <p class="text-xs text-slate-400 mt-1 max-w-sm text-center">
            Ready to render multi-dataset revenue graphs and volume projections in Phase 4.
          </p>
        </div>
      </div>

      <!-- Quick Distribution Placeholder -->
      <div class="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex flex-col justify-between min-h-[340px]">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 class="text-base font-semibold text-white">Expense Distribution</h3>
            <p class="text-xs text-slate-400">Top cost centers</p>
          </div>
        </div>
        <div class="flex-1 flex flex-col items-center justify-center py-12 text-slate-400">
          <div class="w-24 h-24 rounded-full border-4 border-dashed border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-400 mb-3">
            Doughnut
          </div>
          <p class="text-xs text-slate-400 text-center">
            Cloud, Payroll, Operations breakdown.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
