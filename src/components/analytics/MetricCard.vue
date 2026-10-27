<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight, ArrowDownRight } from '@lucide/vue'

const props = defineProps<{
  title: string
  value: string
  change: string
  isPositive: boolean
  description: string
  accentColor: 'blue' | 'emerald' | 'violet' | 'amber'
  sparklineData: number[]
}>()

const accentGradients = {
  blue: {
    iconBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/60',
    stroke: '#2563eb',
  },
  emerald: {
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60',
    stroke: '#059669',
  },
  violet: {
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-800/60',
    stroke: '#4f46e5',
  },
  amber: {
    iconBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60',
    stroke: '#d97706',
  },
}

const config = computed(() => accentGradients[props.accentColor])

// Generate SVG points for mini sparkline
const sparklinePoints = computed(() => {
  const min = Math.min(...props.sparklineData)
  const max = Math.max(...props.sparklineData)
  const range = max - min || 1
  const width = 110
  const height = 36

  return props.sparklineData
    .map((val, idx) => {
      const x = (idx / (props.sparklineData.length - 1)) * width
      const y = height - ((val - min) / range) * (height - 8) - 4
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
})
</script>

<template>
  <div class="depth-card depth-card-hover rounded-2xl p-6 flex flex-col justify-between">
    <div>
      <!-- Top Row: Title + Icon -->
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{{ title }}</span>
        <div :class="['w-9 h-9 rounded-xl flex items-center justify-center border shadow-2xs', config.iconBg]">
          <slot name="icon" />
        </div>
      </div>

      <!-- Middle: Big Value + Mini Sparkline -->
      <div class="flex items-end justify-between mt-1 mb-2">
        <div>
          <div class="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
            {{ value }}
          </div>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">{{ description }}</p>
        </div>

        <!-- Mini Sparkline SVG -->
        <div class="w-24 h-10 flex items-center justify-end">
          <svg viewBox="0 0 110 36" class="w-full h-full overflow-visible">
            <polyline
              fill="none"
              :stroke="config.stroke"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              :points="sparklinePoints"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Bottom: Trend Badge -->
    <div class="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
      <span
        :class="[
          'inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-lg border text-[11px]',
          isPositive
            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/70 dark:border-emerald-800/70'
            : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200/70 dark:border-rose-800/70'
        ]"
      >
        <ArrowUpRight v-if="isPositive" class="w-3.5 h-3.5" />
        <ArrowDownRight v-else class="w-3.5 h-3.5" />
        {{ change }}
      </span>
      <span class="text-[11px] text-slate-400 dark:text-slate-500 font-medium">vs last month</span>
    </div>
  </div>
</template>
