<script setup lang="ts">
import { ref } from 'vue'
import {
  DollarSign,
  Users,
  CreditCard,
  TrendingUp,
  Sparkles,
  Zap,
  Cpu,
} from '@lucide/vue'
import MetricCard from '@/components/analytics/MetricCard.vue'
import RevenueChart from '@/components/analytics/RevenueChart.vue'
import ExpenseDoughnut from '@/components/analytics/ExpenseDoughnut.vue'
import RecentTransactions from '@/components/transactions/RecentTransactions.vue'

const isSimulating = ref(false)

function simulateTraffic() {
  isSimulating.value = true
  setTimeout(() => {
    isSimulating.value = false
  }, 1200)
}
</script>

<template>
  <div class="space-y-8 pb-12">
    <!-- Top Executive Welcome Banner (Light Theme First) -->
    <div class="depth-card relative overflow-hidden rounded-2xl p-6 md:p-8">
      <!-- Decorative background accent -->
      <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-50/70 rounded-full blur-2xl pointer-events-none"></div>

      <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-3">
            <Sparkles class="w-3.5 h-3.5 text-indigo-600" />
            <span>Real-time Telemetry • 12 Active Payment Nodes</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Financial Cockpit & Executive Summary
          </h2>
          <p class="text-xs md:text-sm text-slate-600 mt-2 leading-relaxed font-normal">
            Monthly recurring revenue is tracking at <span class="text-emerald-700 font-bold">$48,250.00</span> (+14.2% MoM). All merchant settlements, Stripe pipelines, and telemetry listeners are operating at 100% capacity.
          </p>
        </div>

        <!-- Quick Action Buttons -->
        <div class="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            type="button"
            @click="simulateTraffic"
            :disabled="isSimulating"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition shadow-2xs disabled:opacity-50"
          >
            <Cpu :class="['w-4 h-4 text-indigo-600', isSimulating && 'animate-spin']" />
            <span>{{ isSimulating ? 'Simulating Traffic...' : 'Run Load Simulation' }}</span>
          </button>
          <button
            type="button"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <Zap class="w-4 h-4 text-indigo-200" />
            <span>Deploy Snapshot</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 4 High-End Metric Cards with Sparklines -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <MetricCard
        title="Monthly Recurring Revenue"
        value="$48,250"
        change="+14.2%"
        :is-positive="true"
        description="+$5,980 new additions this month"
        accent-color="violet"
        :sparkline-data="[31000, 33500, 36000, 38200, 41000, 44200, 48250]"
      >
        <template #icon>
          <DollarSign class="w-4 h-4" />
        </template>
      </MetricCard>

      <MetricCard
        title="Active Subscriptions"
        value="2,845"
        change="+8.4%"
        :is-positive="true"
        description="Enterprise & Team accounts"
        accent-color="emerald"
        :sparkline-data="[2100, 2220, 2350, 2480, 2600, 2710, 2845]"
      >
        <template #icon>
          <Users class="w-4 h-4" />
        </template>
      </MetricCard>

      <MetricCard
        title="Avg. Revenue Per User"
        value="$169.50"
        change="+3.1%"
        :is-positive="true"
        description="Driven by GPU tier upgrades"
        accent-color="blue"
        :sparkline-data="[150, 154, 157, 161, 163, 166, 169.5]"
      >
        <template #icon>
          <CreditCard class="w-4 h-4" />
        </template>
      </MetricCard>

      <MetricCard
        title="Net Revenue Retention"
        value="108.4%"
        change="+2.2%"
        :is-positive="true"
        description="Top quartile SaaS benchmark"
        accent-color="amber"
        :sparkline-data="[101, 102.5, 104, 105.2, 106.8, 107.5, 108.4]"
      >
        <template #icon>
          <TrendingUp class="w-4 h-4" />
        </template>
      </MetricCard>
    </div>

    <!-- Charts Row: Main Revenue Line Chart & Expense Doughnut Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <RevenueChart />
      </div>
      <div>
        <ExpenseDoughnut />
      </div>
    </div>

    <!-- Full Transactions Ledger with Search, Status, and CSV Export -->
    <RecentTransactions />
  </div>
</template>
