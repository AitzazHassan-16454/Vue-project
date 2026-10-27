<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Filler,
  type ChartOptions,
  type ChartData,
} from 'chart.js'
import { Line, Bar } from 'vue-chartjs'
import { TrendingUp, BarChart3, Activity } from '@lucide/vue'
import { useDark } from '@vueuse/core'
import { useSettingsStore } from '@/stores/settingsStore'
import { formatCurrency, getCurrencySymbol } from '@/utils/currency'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Filler
)

const settingsStore = useSettingsStore()
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
  initialValue: 'light',
})

type TimeRange = '7D' | '30D' | '90D' | '12M'
type ChartStyle = 'spline' | 'bar' | 'stepped'

const activeRange = ref<TimeRange>('30D')
const activeStyle = ref<ChartStyle>('spline')

const styleOptions = [
  { id: 'spline', label: 'Curve Area', icon: TrendingUp },
  { id: 'bar', label: 'Grouped Bars', icon: BarChart3 },
  { id: 'stepped', label: 'Stepped Line', icon: Activity },
] as const

const chartDatasets: Record<TimeRange, { labels: string[]; revenue: number[]; expenses: number[] }> = {
  '7D': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    revenue: [6200, 7100, 6800, 8400, 9200, 8900, 10400],
    expenses: [2100, 2400, 2200, 2900, 3100, 2800, 3300],
  },
  '30D': {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    revenue: [28400, 34200, 41800, 48250],
    expenses: [11200, 13100, 14200, 15800],
  },
  '90D': {
    labels: ['August', 'September', 'October'],
    revenue: [98000, 124000, 142500],
    expenses: [39000, 44000, 49200],
  },
  '12M': {
    labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    revenue: [24000, 28000, 31000, 33000, 36000, 40000, 42000, 45000, 48000, 52000, 56000, 62000],
    expenses: [10000, 11500, 12000, 13000, 14000, 15000, 16000, 17500, 18000, 19000, 20500, 22000],
  },
}

const currentData = computed(() => chartDatasets[activeRange.value])

const totalRevenue = computed(() => {
  const arr = currentData.value.revenue
  return arr.reduce((acc, curr) => acc + curr, 0)
})

const netProfit = computed(() => {
  const rev = totalRevenue.value
  const exp = currentData.value.expenses.reduce((acc, curr) => acc + curr, 0)
  return rev - exp
})

const currencySymbol = computed(() => getCurrencySymbol(settingsStore.currency))

// Line / Spline / Stepped Chart Data
const lineChartData = computed<ChartData<'line'>>(() => {
  const isStepped = activeStyle.value === 'stepped'
  return {
    labels: currentData.value.labels,
    datasets: [
      {
        label: 'Gross Inflow',
        data: currentData.value.revenue,
        borderColor: '#6366f1',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 280)
          gradient.addColorStop(0, isDark.value ? 'rgba(99, 102, 241, 0.28)' : 'rgba(79, 70, 229, 0.16)')
          gradient.addColorStop(0.8, 'rgba(99, 102, 241, 0.02)')
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0)')
          return gradient
        },
        fill: true,
        tension: isStepped ? 0 : 0.38,
        stepped: isStepped ? 'middle' : false,
        borderWidth: 2.5,
        pointBackgroundColor: isDark.value ? '#0f172a' : '#ffffff',
        pointBorderColor: '#6366f1',
        pointBorderWidth: 2.5,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Operating Expenses',
        data: currentData.value.expenses,
        borderColor: isDark.value ? '#64748b' : '#94a3b8',
        backgroundColor: 'transparent',
        borderDash: isStepped ? undefined : [5, 5],
        tension: isStepped ? 0 : 0.38,
        stepped: isStepped ? 'middle' : false,
        borderWidth: 2,
        pointBackgroundColor: isDark.value ? '#0f172a' : '#ffffff',
        pointBorderColor: isDark.value ? '#64748b' : '#94a3b8',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  }
})

// Bar Chart Data
const barChartData = computed<ChartData<'bar'>>(() => ({
  labels: currentData.value.labels,
  datasets: [
    {
      label: 'Gross Inflow',
      data: currentData.value.revenue,
      backgroundColor: '#6366f1',
      borderRadius: 6,
      barPercentage: 0.65,
      categoryPercentage: 0.65,
    },
    {
      label: 'Operating Expenses',
      data: currentData.value.expenses,
      backgroundColor: isDark.value ? '#475569' : '#cbd5e1',
      borderRadius: 6,
      barPercentage: 0.65,
      categoryPercentage: 0.65,
    },
  ],
}))

const chartOptions = computed(() => {
  const dark = isDark.value
  const gridColor = dark ? '#1e293b' : '#f1f5f9'
  const textColor = dark ? '#94a3b8' : '#64748b'

  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
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
          label: (context: any) => {
            let label = context.dataset.label || ''
            if (label) label += ': '
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y, settingsStore.currency, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            }
            return label
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          font: { size: 11, family: 'Inter, system-ui', weight: 500 },
        },
      },
      y: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          font: { size: 11, family: 'Inter, system-ui', weight: 500 },
          callback: (value: any) => `${currencySymbol.value}${Number(value) / 1000}k`,
        },
      },
    },
  }
})
</script>

<template>
  <div class="depth-card rounded-2xl p-6 md:p-8 flex flex-col justify-between">
    <!-- Header Controls: Title, Chart Style Switcher, and Timeframe Toggle -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Revenue Dynamics & Cash Flow</h3>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Tracking gross customer inflow against operational overhead.
        </p>
      </div>

      <!-- Controls Row: Style Selector + Timeframe Selector -->
      <div class="flex items-center gap-2.5 flex-wrap self-start lg:self-auto">
        <!-- Interactive Chart Style Switcher (User Choice) -->
        <div class="flex items-center p-1 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700">
          <button
            v-for="st in styleOptions"
            :key="st.id"
            type="button"
            @click="activeStyle = st.id"
            :class="[
              'flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer',
              activeStyle === st.id
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            ]"
            :title="`Switch to ${st.label} style`"
          >
            <component :is="st.icon" class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">{{ st.label }}</span>
          </button>
        </div>

        <!-- Timeframe Toggle Pills -->
        <div class="flex items-center p-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
          <button
            v-for="range in (['7D', '30D', '90D', '12M'] as TimeRange[])"
            :key="range"
            type="button"
            @click="activeRange = range"
            :class="[
              'px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer',
              activeRange === range
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            ]"
          >
            {{ range }}
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Stats Ribbon -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6 p-4 rounded-xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
      <div>
        <div class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Period Inflow</div>
        <div class="text-xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
          {{ formatCurrency(totalRevenue, settingsStore.currency, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}
        </div>
      </div>
      <div>
        <div class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Net Margin</div>
        <div class="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
          +{{ formatCurrency(netProfit, settingsStore.currency, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}
        </div>
      </div>
      <div class="col-span-2 sm:col-span-1">
        <div class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Runway Projection</div>
        <div class="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">
          26 Months
        </div>
      </div>
    </div>

    <!-- Dynamic Chart Canvas Container (Renders user's chosen style) -->
    <div class="h-72 w-full mt-2">
      <!-- Grouped Bars Style -->
      <Bar
        v-if="activeStyle === 'bar'"
        :key="`bar-${activeRange}`"
        :data="barChartData"
        :options="chartOptions"
      />

      <!-- Spline Area or Stepped Line Style -->
      <Line
        v-else
        :key="`line-${activeStyle}-${activeRange}`"
        :data="lineChartData"
        :options="chartOptions"
      />
    </div>

    <!-- Legend Footer -->
    <div class="flex items-center justify-center gap-6 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-medium">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
        <span class="text-slate-700 dark:text-slate-300 font-semibold">Gross Inflow</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-0.5 border-b-2 border-dashed border-slate-400"></span>
        <span class="text-slate-600 dark:text-slate-400">Operating Expenses</span>
      </div>
    </div>
  </div>
</template>
