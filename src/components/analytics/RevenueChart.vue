<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  type ChartOptions,
  type ChartData,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { TrendingUp } from '@lucide/vue'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
)

type TimeRange = '7D' | '30D' | '90D' | '12M'
const activeRange = ref<TimeRange>('30D')

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

const chartData = computed<ChartData<'line'>>(() => {
  return {
    labels: currentData.value.labels,
    datasets: [
      {
        label: 'Gross Inflow',
        data: currentData.value.revenue,
        borderColor: '#4f46e5', // Royal Indigo
        backgroundColor: (context) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 280)
          gradient.addColorStop(0, 'rgba(79, 70, 229, 0.16)')
          gradient.addColorStop(0.8, 'rgba(79, 70, 229, 0.02)')
          gradient.addColorStop(1, 'rgba(79, 70, 229, 0)')
          return gradient
        },
        fill: true,
        tension: 0.38,
        borderWidth: 2.5,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#4f46e5',
        pointBorderWidth: 2.5,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Operating Expenses',
        data: currentData.value.expenses,
        borderColor: '#94a3b8', // Subtle slate
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.38,
        borderWidth: 2,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#94a3b8',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  }
})

const chartOptions: ChartOptions<'line'> = {
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
      backgroundColor: '#0f172a',
      titleColor: '#f8fafc',
      bodyColor: '#cbd5e1',
      borderColor: '#1e293b',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 12,
      boxPadding: 6,
      callbacks: {
        label: (context) => {
          let label = context.dataset.label || ''
          if (label) label += ': '
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            }).format(context.parsed.y)
          }
          return label
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: '#f1f5f9',
      },
      ticks: {
        color: '#64748b',
        font: { size: 11, family: 'system-ui', weight: 500 },
      },
    },
    y: {
      grid: {
        color: '#f1f5f9',
      },
      ticks: {
        color: '#64748b',
        font: { size: 11, family: 'system-ui', weight: 500 },
        callback: (value) => `$${Number(value) / 1000}k`,
      },
    },
  },
}
</script>

<template>
  <div class="depth-card rounded-2xl p-6 md:p-8 flex flex-col justify-between">
    <!-- Header Controls -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
          <h3 class="text-lg font-bold text-slate-900 tracking-tight">Revenue Dynamics & Cash Flow</h3>
        </div>
        <p class="text-xs text-slate-500 font-medium">
          Tracking gross customer inflow against operational overhead.
        </p>
      </div>

      <!-- Timeframe Toggle Pills -->
      <div class="flex items-center p-1 rounded-xl bg-slate-100/80 border border-slate-200/80 self-start sm:self-auto">
        <button
          v-for="range in (['7D', '30D', '90D', '12M'] as TimeRange[])"
          :key="range"
          type="button"
          @click="activeRange = range"
          :class="[
            'px-3 py-1 text-xs font-bold rounded-lg transition-all',
            activeRange === range
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          {{ range }}
        </button>
      </div>
    </div>

    <!-- Quick Stats Ribbon -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6 p-4 rounded-xl bg-slate-50/90 border border-slate-200/60">
      <div>
        <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Period Inflow</div>
        <div class="text-xl font-black text-slate-900 font-mono mt-0.5">
          ${{ totalRevenue.toLocaleString() }}
        </div>
      </div>
      <div>
        <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Net Margin</div>
        <div class="text-xl font-black text-emerald-600 font-mono mt-0.5">
          +${{ netProfit.toLocaleString() }}
        </div>
      </div>
      <div class="col-span-2 sm:col-span-1">
        <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Runway Projection</div>
        <div class="text-xl font-black text-indigo-600 font-mono mt-0.5">
          26 Months
        </div>
      </div>
    </div>

    <!-- Chart Canvas Container -->
    <div class="h-72 w-full mt-2">
      <Line :data="chartData" :options="chartOptions" />
    </div>

    <!-- Legend Footer -->
    <div class="flex items-center justify-center gap-6 pt-4 mt-2 border-t border-slate-100 text-xs text-slate-600 font-medium">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
        <span class="text-slate-700 font-semibold">Gross Inflow</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-0.5 border-b-2 border-dashed border-slate-400"></span>
        <span class="text-slate-600">Operating Expenses</span>
      </div>
    </div>
  </div>
</template>
