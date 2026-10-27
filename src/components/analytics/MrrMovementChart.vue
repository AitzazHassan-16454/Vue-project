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
import { Layers, ArrowUpRight } from '@lucide/vue'
import { useDark } from '@vueuse/core'
import { useSettingsStore } from '@/stores/settingsStore'
import { formatCurrency, getCurrencySymbol } from '@/utils/currency'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const settingsStore = useSettingsStore()
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
  initialValue: 'light',
})

type TimeHorizon = '6M' | '12M'
const activeHorizon = ref<TimeHorizon>('6M')

const datasetsConfig = {
  '6M': {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    newArr: [4800, 5200, 6100, 7400, 8100, 9200],
    expansionArr: [2100, 2800, 3400, 3900, 4500, 5400],
    churnArr: [-850, -920, -780, -1100, -950, -820],
  },
  '12M': {
    labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    newArr: [3200, 3600, 3900, 4100, 4500, 4700, 4800, 5200, 6100, 7400, 8100, 9200],
    expansionArr: [1400, 1600, 1800, 1900, 2000, 2100, 2100, 2800, 3400, 3900, 4500, 5400],
    churnArr: [-620, -700, -680, -720, -810, -790, -850, -920, -780, -1100, -950, -820],
  },
}

const currentHorizon = computed(() => datasetsConfig[activeHorizon.value])

const netNewAdditionThisMonth = computed(() => {
  const lastNew = currentHorizon.value.newArr.slice(-1)[0] ?? 0
  const lastExp = currentHorizon.value.expansionArr.slice(-1)[0] ?? 0
  const lastChurn = currentHorizon.value.churnArr.slice(-1)[0] ?? 0
  return lastNew + lastExp + lastChurn
})

const currencySymbol = computed(() => getCurrencySymbol(settingsStore.currency))

const chartData = computed<ChartData<'bar'>>(() => ({
  labels: currentHorizon.value.labels,
  datasets: [
    {
      label: 'New Customer ARR',
      data: currentHorizon.value.newArr,
      backgroundColor: '#10b981', // Emerald
      borderRadius: 4,
      stack: 'mrr',
    },
    {
      label: 'Expansion & Upsells',
      data: currentHorizon.value.expansionArr,
      backgroundColor: '#6366f1', // Indigo
      borderRadius: 4,
      stack: 'mrr',
    },
    {
      label: 'Contraction & Churn',
      data: currentHorizon.value.churnArr,
      backgroundColor: '#f43f5e', // Rose
      borderRadius: 4,
      stack: 'mrr',
    },
  ],
}))

const chartOptions = computed<ChartOptions<'bar'>>(() => {
  const dark = isDark.value
  const gridColor = dark ? '#1e293b' : '#f1f5f9'
  const textColor = dark ? '#94a3b8' : '#64748b'

  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: dark ? '#1e293b' : '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: dark ? '#334155' : '#1e293b',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        boxPadding: 6,
        callbacks: {
          label: (ctx) => {
            const rawVal = ctx.parsed.y ?? 0
            const formatted = formatCurrency(Math.abs(rawVal), settingsStore.currency, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
            const sign = rawVal < 0 ? '-' : '+'
            return ` ${ctx.dataset.label}: ${sign}${formatted}`
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { color: textColor, font: { weight: 500, size: 11, family: 'Inter, system-ui' } },
      },
      y: {
        stacked: true,
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          font: { family: 'Inter, system-ui', size: 11 },
          callback: (v) => `${Number(v) >= 0 ? '' : '-'}${currencySymbol.value}${Math.abs(Number(v)) / 1000}k`,
        },
      },
    },
  }
})
</script>

<template>
  <div class="depth-card rounded-2xl p-6 md:p-8 flex flex-col justify-between">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Layers class="w-4 h-4" />
        </div>
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white tracking-tight">Net MRR Movement Dynamics</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Deconstructed new bookings, account expansions, and churn</p>
        </div>
      </div>

      <!-- Time Horizon Toggle -->
      <div class="flex items-center p-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 self-start sm:self-auto">
        <button
          v-for="hz in (['6M', '12M'] as TimeHorizon[])"
          :key="hz"
          type="button"
          @click="activeHorizon = hz"
          :class="[
            'px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer',
            activeHorizon === hz
              ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          {{ hz }}
        </button>
      </div>
    </div>

    <!-- Stats summary bar -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6 p-4 rounded-xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
      <div>
        <div class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Net Growth (MoM)</div>
        <div class="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 inline-flex items-center gap-1">
          <ArrowUpRight class="w-4 h-4" />
          +{{ formatCurrency(netNewAdditionThisMonth, settingsStore.currency, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}
        </div>
      </div>
      <div>
        <div class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Account Expansion</div>
        <div class="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">
          124.6%
        </div>
      </div>
      <div class="col-span-2 sm:col-span-1">
        <div class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gross Revenue Churn</div>
        <div class="text-xl font-black text-rose-600 dark:text-rose-400 font-mono mt-0.5">
          0.82%
        </div>
      </div>
    </div>

    <!-- Chart Canvas -->
    <div class="h-64 w-full mt-2">
      <Bar :data="chartData" :options="chartOptions" />
    </div>

    <!-- Legend -->
    <div class="flex items-center justify-center gap-6 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-medium flex-wrap">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
        <span class="text-slate-700 dark:text-slate-300">New Bookings</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-sm bg-indigo-500"></span>
        <span class="text-slate-700 dark:text-slate-300">Expansion ARR</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
        <span class="text-slate-700 dark:text-slate-300">Churn / Downgrades</span>
      </div>
    </div>
  </div>
</template>
