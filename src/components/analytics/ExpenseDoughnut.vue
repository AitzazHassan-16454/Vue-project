<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  type ChartOptions,
  type ChartData,
} from 'chart.js'
import { Doughnut, Pie, PolarArea } from 'vue-chartjs'
import { PieChart, CircleDot, Compass } from '@lucide/vue'
import { useDark } from '@vueuse/core'
import { useSettingsStore } from '@/stores/settingsStore'
import { formatCurrency } from '@/utils/currency'

ChartJS.register(Tooltip, Legend, ArcElement, RadialLinearScale)

const settingsStore = useSettingsStore()
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
  initialValue: 'light',
})

type ExpenseChartStyle = 'doughnut' | 'pie' | 'polar'
const activeStyle = ref<ExpenseChartStyle>('doughnut')

const styleOptions = [
  { id: 'doughnut', label: 'Ring', icon: CircleDot },
  { id: 'pie', label: 'Pie', icon: PieChart },
  { id: 'polar', label: 'Polar', icon: Compass },
] as const

const categories = [
  { name: 'Cloud Infrastructure', rawAmount: 6420, percent: '40.6%', color: '#4f46e5', bgClass: 'bg-indigo-600' },
  { name: 'AI & Inference Tokens', rawAmount: 4150, percent: '26.3%', color: '#06b6d4', bgClass: 'bg-cyan-500' },
  { name: 'Engineering & Payroll', rawAmount: 3200, percent: '20.3%', color: '#10b981', bgClass: 'bg-emerald-500' },
  { name: 'Growth & Marketing', rawAmount: 2030, percent: '12.8%', color: '#f59e0b', bgClass: 'bg-amber-500' },
]

const totalBurn = computed(() => categories.reduce((sum, c) => sum + c.rawAmount, 0))

const sharedData = computed(() => ({
  labels: categories.map((c) => c.name),
  datasets: [
    {
      data: categories.map((c) => c.rawAmount),
      backgroundColor: isDark.value
        ? ['#6366f1', '#06b6d4', '#10b981', '#f59e0b']
        : ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b'],
      borderWidth: 2.5,
      borderColor: isDark.value ? '#0f172a' : '#ffffff',
      hoverOffset: 6,
    },
  ],
}))

const doughnutData = computed<ChartData<'doughnut'>>(() => sharedData.value as unknown as ChartData<'doughnut'>)
const pieData = computed<ChartData<'pie'>>(() => sharedData.value as unknown as ChartData<'pie'>)
const polarData = computed<ChartData<'polarArea'>>(() => sharedData.value as unknown as ChartData<'polarArea'>)

const doughnutOptions = computed<ChartOptions<'doughnut'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '74%',
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: isDark.value ? '#1e293b' : '#0f172a',
      titleColor: '#f8fafc',
      bodyColor: '#cbd5e1',
      borderColor: isDark.value ? '#334155' : '#1e293b',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 10,
      callbacks: {
        label: (context) => {
          const item = categories[context.dataIndex]
          const formatted = formatCurrency(context.parsed, settingsStore.currency, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })
          return ` ${formatted} (${item ? item.percent : ''})`
        },
      },
    },
  },
}))

const pieOptions = computed<ChartOptions<'pie'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: isDark.value ? '#1e293b' : '#0f172a',
      titleColor: '#f8fafc',
      bodyColor: '#cbd5e1',
      borderColor: isDark.value ? '#334155' : '#1e293b',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 10,
      callbacks: {
        label: (context) => {
          const item = categories[context.dataIndex]
          const formatted = formatCurrency(context.parsed, settingsStore.currency, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })
          return ` ${formatted} (${item ? item.percent : ''})`
        },
      },
    },
  },
}))

const polarOptions = computed<ChartOptions<'polarArea'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: isDark.value ? '#1e293b' : '#0f172a',
      titleColor: '#f8fafc',
      bodyColor: '#cbd5e1',
      borderColor: isDark.value ? '#334155' : '#1e293b',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 10,
      callbacks: {
        label: (context) => {
          const item = categories[context.dataIndex]
          const formatted = formatCurrency(context.parsed.r, settingsStore.currency, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })
          return ` ${formatted} (${item ? item.percent : ''})`
        },
      },
    },
  },
  scales: {
    r: {
      grid: { color: isDark.value ? '#1e293b' : '#f1f5f9' },
      ticks: { display: false },
      pointLabels: { display: false },
    },
  },
}))
</script>

<template>
  <div class="depth-card rounded-2xl p-6 md:p-8 flex flex-col justify-between">
    <!-- Header with User Style Switcher -->
    <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <PieChart class="w-4 h-4" />
        </div>
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white tracking-tight">Expense Allocations</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Monthly budget split</p>
        </div>
      </div>

      <!-- Graph Style Selector -->
      <div class="flex items-center p-1 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700">
        <button
          v-for="st in styleOptions"
          :key="st.id"
          type="button"
          @click="activeStyle = st.id"
          :class="[
            'flex items-center gap-1 px-2 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer',
            activeStyle === st.id
              ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          ]"
          :title="`Switch to ${st.label}`"
        >
          <component :is="st.icon" class="w-3 h-3" />
          <span>{{ st.label }}</span>
        </button>
      </div>
    </div>

    <!-- Canvas Container with Dynamic Chart Style Component -->
    <div class="relative h-56 my-4 flex items-center justify-center">
      <!-- 1. Doughnut Style (with center stat) -->
      <template v-if="activeStyle === 'doughnut'">
        <Doughnut :data="doughnutData" :options="doughnutOptions" />
        <div class="absolute flex flex-col items-center justify-center pointer-events-none">
          <span class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Burn Rate</span>
          <span class="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {{ formatCurrency(totalBurn, settingsStore.currency, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}
          </span>
          <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">-4.1% vs budget</span>
        </div>
      </template>

      <!-- 2. Solid Pie Style -->
      <template v-else-if="activeStyle === 'pie'">
        <Pie :data="pieData" :options="pieOptions" />
      </template>

      <!-- 3. Polar Area Style -->
      <template v-else>
        <PolarArea :data="polarData" :options="polarOptions" />
      </template>
    </div>

    <!-- Category Legend List -->
    <div class="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
      <div
        v-for="cat in categories"
        :key="cat.name"
        class="flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
      >
        <div class="flex items-center gap-2.5">
          <span :class="['w-2.5 h-2.5 rounded-full', cat.bgClass]"></span>
          <span class="text-slate-700 dark:text-slate-300 font-medium">{{ cat.name }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-mono font-bold text-slate-900 dark:text-white">
            {{ formatCurrency(cat.rawAmount, settingsStore.currency, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}
          </span>
          <span class="text-[10px] text-slate-400 dark:text-slate-500 font-mono w-10 text-right font-medium">{{ cat.percent }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
