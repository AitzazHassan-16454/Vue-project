<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from 'chart.js'
import { PolarArea } from 'vue-chartjs'
import { Globe, Radio } from '@lucide/vue'
import { useDark } from '@vueuse/core'
import { useSettingsStore } from '@/stores/settingsStore'
import { formatCurrency } from '@/utils/currency'

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend)

const settingsStore = useSettingsStore()
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
  initialValue: 'light',
})

const regions = [
  { name: 'North America', nodes: 'us-east-1, us-west-2', rawAmount: 22195, share: '46%', latency: '14ms', color: '#4f46e5', dot: 'bg-indigo-600' },
  { name: 'Europe & UK', nodes: 'eu-central-1, eu-west-1', rawAmount: 13510, share: '28%', latency: '26ms', color: '#06b6d4', dot: 'bg-cyan-500' },
  { name: 'Asia-Pacific', nodes: 'ap-northeast-1, ap-southeast-1', rawAmount: 7720, share: '16%', latency: '68ms', color: '#10b981', dot: 'bg-emerald-500' },
  { name: 'Latin America', nodes: 'sa-east-1', rawAmount: 2895, share: '6%', latency: '82ms', color: '#f59e0b', dot: 'bg-amber-500' },
  { name: 'Middle East', nodes: 'me-central-1', rawAmount: 1930, share: '4%', latency: '74ms', color: '#ec4899', dot: 'bg-pink-500' },
]

const totalRegionalVolume = computed(() => regions.reduce((sum, r) => sum + r.rawAmount, 0))

const chartData = computed<ChartData<'polarArea'>>(() => ({
  labels: regions.map((r) => r.name),
  datasets: [
    {
      data: regions.map((r) => r.rawAmount),
      backgroundColor: isDark.value
        ? [
            'rgba(99, 102, 241, 0.75)',
            'rgba(6, 182, 212, 0.75)',
            'rgba(16, 185, 129, 0.75)',
            'rgba(245, 158, 11, 0.75)',
            'rgba(236, 72, 153, 0.75)',
          ]
        : [
            'rgba(79, 70, 229, 0.82)',
            'rgba(6, 182, 212, 0.82)',
            'rgba(16, 185, 129, 0.82)',
            'rgba(245, 158, 11, 0.82)',
            'rgba(236, 72, 153, 0.82)',
          ],
      borderColor: isDark.value ? '#0f172a' : '#ffffff',
      borderWidth: 2,
    },
  ],
}))

const chartOptions = computed<ChartOptions<'polarArea'>>(() => {
  const dark = isDark.value
  const gridColor = dark ? '#1e293b' : '#f1f5f9'
  const textColor = dark ? '#94a3b8' : '#64748b'

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: dark ? '#1e293b' : '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: dark ? '#334155' : '#1e293b',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => {
            const reg = regions[ctx.dataIndex]
            const formatted = formatCurrency(ctx.parsed.r, settingsStore.currency, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
            return ` ${formatted} (${reg ? reg.share : ''})`
          },
        },
      },
    },
    scales: {
      r: {
        grid: { color: gridColor },
        ticks: { display: false },
        pointLabels: { display: false },
      },
    },
  }
})
</script>

<template>
  <div class="depth-card rounded-2xl p-6 md:p-8 flex flex-col justify-between">
    <!-- Header -->
    <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900/60 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
          <Globe class="w-4 h-4" />
        </div>
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white tracking-tight">Geographic Revenue Inflow</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Multi-cluster payment routing</p>
        </div>
      </div>

      <span class="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
        <Radio class="w-3 h-3 animate-pulse" />
        5 Edge Zones
      </span>
    </div>

    <!-- Polar Area Canvas -->
    <div class="relative h-60 my-4 flex items-center justify-center">
      <PolarArea :data="chartData" :options="chartOptions" />
    </div>

    <!-- Regional Breakdown List -->
    <div class="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
      <div
        v-for="reg in regions"
        :key="reg.name"
        class="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
      >
        <div class="flex items-center gap-2.5">
          <span :class="['w-2.5 h-2.5 rounded-full', reg.dot]"></span>
          <div>
            <span class="text-slate-800 dark:text-slate-200 font-semibold">{{ reg.name }}</span>
            <span class="hidden sm:inline text-[10px] text-slate-400 dark:text-slate-500 ml-1.5">({{ reg.latency }})</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-mono font-bold text-slate-900 dark:text-white">
            {{ formatCurrency(reg.rawAmount, settingsStore.currency, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}
          </span>
          <span class="text-[10px] text-slate-400 dark:text-slate-500 font-mono w-8 text-right font-medium">{{ reg.share }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
