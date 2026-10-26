<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement,
  type ChartOptions,
  type ChartData,
} from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import { PieChart } from '@lucide/vue'

ChartJS.register(Tooltip, Legend, ArcElement)

const categories = [
  { name: 'Cloud Infrastructure', amount: '$6,420', percent: '40.6%', color: '#4f46e5', bgClass: 'bg-indigo-600' },
  { name: 'AI & Inference Tokens', amount: '$4,150', percent: '26.3%', color: '#06b6d4', bgClass: 'bg-cyan-500' },
  { name: 'Engineering & Payroll', amount: '$3,200', percent: '20.3%', color: '#10b981', bgClass: 'bg-emerald-500' },
  { name: 'Growth & Marketing', amount: '$2,030', percent: '12.8%', color: '#f59e0b', bgClass: 'bg-amber-500' },
]

const chartData = computed<ChartData<'doughnut'>>(() => ({
  labels: categories.map((c) => c.name),
  datasets: [
    {
      data: [6420, 4150, 3200, 2030],
      backgroundColor: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b'],
      borderWidth: 3,
      borderColor: '#ffffff',
      hoverOffset: 6,
    },
  ],
}))

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '74%',
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0f172a',
      titleColor: '#f8fafc',
      bodyColor: '#cbd5e1',
      borderColor: '#1e293b',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 10,
      callbacks: {
        label: (context) => {
          const item = categories[context.dataIndex]
          return ` $${context.parsed.toLocaleString()} (${item ? item.percent : ''})`
        },
      },
    },
  },
}
</script>

<template>
  <div class="depth-card rounded-2xl p-6 md:p-8 flex flex-col justify-between">
    <!-- Header -->
    <div class="flex items-center justify-between pb-4 border-b border-slate-100">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
          <PieChart class="w-4 h-4" />
        </div>
        <div>
          <h3 class="text-base font-bold text-slate-900 tracking-tight">Expense Breakdown</h3>
          <p class="text-xs text-slate-500 font-medium">Monthly budget allocations</p>
        </div>
      </div>
      <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60">
        $15.8k Burn
      </span>
    </div>

    <!-- Doughnut Canvas with Center Stat -->
    <div class="relative h-56 my-4 flex items-center justify-center">
      <Doughnut :data="chartData" :options="chartOptions" />
      <div class="absolute flex flex-col items-center justify-center pointer-events-none">
        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Burn Rate</span>
        <span class="text-2xl font-black text-slate-900 font-mono">$15,800</span>
        <span class="text-[10px] text-emerald-600 font-bold">-4.1% vs budget</span>
      </div>
    </div>

    <!-- Category Legend List -->
    <div class="space-y-2.5 pt-4 border-t border-slate-100">
      <div
        v-for="cat in categories"
        :key="cat.name"
        class="flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-slate-50 transition"
      >
        <div class="flex items-center gap-2.5">
          <span :class="['w-2.5 h-2.5 rounded-full', cat.bgClass]"></span>
          <span class="text-slate-700 font-medium">{{ cat.name }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-mono font-bold text-slate-900">{{ cat.amount }}</span>
          <span class="text-[10px] text-slate-400 font-mono w-10 text-right font-medium">{{ cat.percent }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
