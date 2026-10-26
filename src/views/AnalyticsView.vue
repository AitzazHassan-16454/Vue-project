<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartOptions,
  type ChartData,
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  ArrowUpRight,
} from '@lucide/vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const timeRange = ref<'30D' | '90D' | '12M'>('30D')

const barDatasets = {
  '30D': {
    labels: ['Organic Search', 'Developer Docs', 'Product Hunt', 'Partner Referrals', 'X / Twitter'],
    cac: [120, 180, 240, 310, 420],
    ltv: [1420, 1850, 1640, 2400, 1950],
  },
  '90D': {
    labels: ['Organic Search', 'Developer Docs', 'Product Hunt', 'Partner Referrals', 'X / Twitter'],
    cac: [110, 175, 230, 290, 390],
    ltv: [1550, 1980, 1720, 2600, 2100],
  },
  '12M': {
    labels: ['Organic Search', 'Developer Docs', 'Product Hunt', 'Partner Referrals', 'X / Twitter'],
    cac: [95, 160, 210, 270, 360],
    ltv: [1750, 2200, 1890, 2950, 2400],
  },
}

const activeBarData = computed(() => barDatasets[timeRange.value])

const barChartData = computed<ChartData<'bar'>>(() => ({
  labels: activeBarData.value.labels,
  datasets: [
    {
      label: 'CAC (Customer Acquisition Cost)',
      data: activeBarData.value.cac,
      backgroundColor: '#f59e0b', // Amber
      borderRadius: 6,
    },
    {
      label: 'LTV (Lifetime Value)',
      data: activeBarData.value.ltv,
      backgroundColor: '#4f46e5', // Royal Indigo
      borderRadius: 6,
    },
  ],
}))

const barChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#475569',
        font: { family: 'system-ui', size: 12, weight: 600 },
        boxWidth: 12,
        usePointStyle: true,
      },
    },
    tooltip: {
      backgroundColor: '#0f172a',
      padding: 12,
      cornerRadius: 10,
      callbacks: {
        label: (ctx) => ` ${ctx.dataset.label}: $${ctx.parsed.y !== null ? ctx.parsed.y.toLocaleString() : '0'}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#64748b', font: { weight: 500, size: 11 } },
    },
    y: {
      grid: { color: '#f1f5f9' },
      ticks: {
        color: '#64748b',
        callback: (v) => `$${v}`,
      },
    },
  },
}

// Cohort Retention Matrix Data
const cohorts = [
  { cohort: 'May 2026', users: 420, m0: '100%', m1: '94.2%', m2: '90.5%', m3: '88.1%', m6: '84.6%' },
  { cohort: 'Jun 2026', users: 560, m0: '100%', m1: '95.1%', m2: '91.8%', m3: '89.4%', m6: '86.2%' },
  { cohort: 'Jul 2026', users: 680, m0: '100%', m1: '96.4%', m2: '93.2%', m3: '91.0%', m6: '88.0%' },
  { cohort: 'Aug 2026', users: 810, m0: '100%', m1: '97.0%', m2: '94.5%', m3: '92.3%', m6: '—' },
  { cohort: 'Sep 2026', users: 950, m0: '100%', m1: '97.8%', m2: '95.2%', m3: '—', m6: '—' },
  { cohort: 'Oct 2026', users: 1120, m0: '100%', m1: '98.4%', m2: '—', m3: '—', m6: '—' },
]
</script>

<template>
  <div class="space-y-8 pb-12">
    <!-- Header -->
    <div class="depth-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
          <BarChart3 class="w-3.5 h-3.5" />
          <span>Performance & Growth Intelligence</span>
        </div>
        <h2 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Customer Cohorts & Unit Economics
        </h2>
        <p class="text-xs md:text-sm text-slate-500 font-medium mt-1">
          LTV to CAC efficiency, payback periods, and multi-month subscription retention matrix.
        </p>
      </div>

      <!-- Timeframe Toggle -->
      <div class="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 self-start md:self-auto">
        <button
          v-for="r in (['30D', '90D', '12M'] as const)"
          :key="r"
          type="button"
          @click="timeRange = r"
          :class="[
            'px-3 py-1 text-xs font-bold rounded-lg transition-all',
            timeRange === r
              ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          {{ r }}
        </button>
      </div>
    </div>

    <!-- 3 Unit Economic Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="depth-card depth-card-hover rounded-2xl p-6 flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">LTV / CAC Ratio</span>
          <div class="text-3xl font-black text-indigo-600 font-mono mt-1">
            4.2x
          </div>
          <span class="text-[11px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-1">
            <ArrowUpRight class="w-3 h-3" />
            Top-Tier Benchmark (>3x)
          </span>
        </div>
        <div class="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-2xs">
          <Target class="w-5 h-5" />
        </div>
      </div>

      <div class="depth-card depth-card-hover rounded-2xl p-6 flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">CAC Payback Time</span>
          <div class="text-3xl font-black text-slate-900 font-mono mt-1">
            4.8 Mo
          </div>
          <span class="text-[11px] text-emerald-600 font-bold mt-1 inline-block">
            Capital recovered in &lt; 5 months
          </span>
        </div>
        <div class="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
          <TrendingUp class="w-5 h-5" />
        </div>
      </div>

      <div class="depth-card depth-card-hover rounded-2xl p-6 flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Annual Churn Rate</span>
          <div class="text-3xl font-black text-slate-900 font-mono mt-1">
            1.18%
          </div>
          <span class="text-[11px] text-emerald-600 font-bold mt-1 inline-block">
            Down 0.4% from prior quarter
          </span>
        </div>
        <div class="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
          <Users class="w-5 h-5" />
        </div>
      </div>
    </div>

    <!-- Chart Canvas: Acquisition Cost vs Lifetime Value by Channel -->
    <div class="depth-card rounded-2xl p-6 md:p-8">
      <div class="flex items-center justify-between pb-6 border-b border-slate-100">
        <div>
          <h3 class="text-lg font-bold text-slate-900 tracking-tight">Channel Unit Economics: CAC vs LTV</h3>
          <p class="text-xs text-slate-500 font-medium">Evaluation across top acquisition channels.</p>
        </div>
      </div>
      <div class="h-80 w-full mt-4">
        <Bar :data="barChartData" :options="barChartOptions" />
      </div>
    </div>

    <!-- Cohort Retention Heatmap Table -->
    <div class="depth-card rounded-2xl p-6 md:p-8">
      <div class="pb-6 border-b border-slate-100">
        <h3 class="text-lg font-bold text-slate-900 tracking-tight">Customer Cohort Retention Heatmap</h3>
        <p class="text-xs text-slate-500 font-medium">Percentage of customer accounts remaining subscribed over time.</p>
      </div>

      <div class="overflow-x-auto mt-4 -mx-6 md:-mx-8">
        <table class="w-full text-left text-xs text-slate-700">
          <thead class="text-[11px] uppercase tracking-wider text-slate-500 font-bold border-y border-slate-200 bg-slate-50/90">
            <tr>
              <th class="py-3 px-6 md:px-8">Cohort</th>
              <th class="py-3 px-4">New Customers</th>
              <th class="py-3 px-4">Month 0</th>
              <th class="py-3 px-4">Month 1</th>
              <th class="py-3 px-4">Month 2</th>
              <th class="py-3 px-4">Month 3</th>
              <th class="py-3 px-6 md:px-8">Month 6</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-sans">
            <tr v-for="c in cohorts" :key="c.cohort" class="hover:bg-slate-50/70 transition">
              <td class="py-3.5 px-6 md:px-8 font-bold text-slate-900">{{ c.cohort }}</td>
              <td class="py-3.5 px-4 font-mono font-semibold text-slate-600">{{ c.users }}</td>
              <td class="py-3.5 px-4">
                <span class="px-2 py-0.5 rounded font-mono font-bold bg-indigo-100 text-indigo-800">{{ c.m0 }}</span>
              </td>
              <td class="py-3.5 px-4">
                <span class="px-2 py-0.5 rounded font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">{{ c.m1 }}</span>
              </td>
              <td class="py-3.5 px-4">
                <span class="px-2 py-0.5 rounded font-mono font-bold bg-indigo-50/60 text-indigo-600">{{ c.m2 }}</span>
              </td>
              <td class="py-3.5 px-4">
                <span class="px-2 py-0.5 rounded font-mono font-bold bg-indigo-50/40 text-slate-600">{{ c.m3 }}</span>
              </td>
              <td class="py-3.5 px-6 md:px-8">
                <span class="px-2 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-600">{{ c.m6 }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
