<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Sparkles,
  X,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  CheckCircle2,
  Cpu,
} from '@lucide/vue'
import { useTransactionStore } from '@/stores/transactionStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { formatCurrency } from '@/utils/currency'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const txStore = useTransactionStore()
const settingsStore = useSettingsStore()

const isAnalyzing = ref(false)
const analysisStep = ref('')
const lastEvaluatedAt = ref(new Date().toLocaleTimeString())

// Dynamic calculation of financial health
const healthScore = computed(() => {
  const total = txStore.list.length
  if (total === 0) return 100
  const refunds = txStore.list.filter((t) => t.status === 'Refunded').length
  const pending = txStore.list.filter((t) => t.status === 'Pending').length

  let score = 100
  score -= (refunds / total) * 35
  score -= (pending / total) * 15
  return Math.max(70, Math.round(score))
})

const healthLabel = computed(() => {
  if (healthScore.value >= 95) return 'Optimal'
  if (healthScore.value >= 85) return 'Healthy'
  return 'Review Recommended'
})

const dynamicInsights = computed(() => {
  const pendingTx = txStore.list.filter((t) => t.status === 'Pending')
  const completedTx = txStore.list.filter((t) => t.status === 'Completed')
  const highestTx = [...completedTx].sort((a, b) => b.amount - a.amount)[0]
  const pendingSum = pendingTx.reduce((sum, t) => sum + t.amount, 0)

  const items = []

  if (highestTx) {
    items.push({
      id: 1,
      type: 'opportunity',
      icon: Lightbulb,
      iconColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
      title: `Tier Upgrade: ${highestTx.client}`,
      body: `${highestTx.client} is currently your highest volume account with ${formatCurrency(highestTx.amount, settingsStore.currency)} committed under ${highestTx.category}. Telemetry indicates 92% capacity usage.`,
      action: 'Send Enterprise Expansion Proposal',
    })
  }

  if (pendingTx.length > 0) {
    items.push({
      id: 2,
      type: 'warning',
      icon: AlertTriangle,
      iconColor: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60',
      title: `Gateway Ingestion: ${formatCurrency(pendingSum, settingsStore.currency)} Pending`,
      body: `${pendingTx.length} transaction(s) awaiting gateway settlement clearance on ${settingsStore.currency} clearing routes. Fallback to secondary payment gateway recommended to avoid latency.`,
      action: 'Trigger Secondary Settlement Route',
    })
  } else {
    items.push({
      id: 2,
      type: 'savings',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60',
      title: 'Zero Settlement Bottlenecks',
      body: 'All customer invoices are settled with 0ms backlog. Clearing pipeline is operating with 100% throughput across all merchant nodes.',
      action: 'View Gateway Telemetry Logs',
    })
  }

  items.push({
    id: 3,
    type: 'savings',
    icon: TrendingUp,
    iconColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60',
    title: 'Dynamic Cluster Auto-Scaling',
    body: `Auto-scaling is currently ${settingsStore.autoScaleCluster ? 'Enabled' : 'Disabled'}. Machine learning models project a $1,280/mo saving by automatically downsizing idle GPU worker pods between 02:00 and 06:00 UTC.`,
    action: 'Optimize Off-Peak Worker Schedule',
  })

  return items
})

function runAnalysis() {
  isAnalyzing.value = true
  analysisStep.value = 'Connecting to ledger telemetry...'

  setTimeout(() => {
    analysisStep.value = 'Benchmarking churn rates against SaaS cohorts...'
  }, 400)

  setTimeout(() => {
    analysisStep.value = 'Synthesizing actionable financial recommendations...'
  }, 800)

  setTimeout(() => {
    isAnalyzing.value = false
    analysisStep.value = ''
    lastEvaluatedAt.value = new Date().toLocaleTimeString()
  }, 1250)
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-hidden">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-xs transition-opacity"
      @click="emit('close')"
    ></div>

    <div class="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
      <div class="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-5 sm:p-6 md:p-8 flex flex-col justify-between shadow-2xl relative z-10 text-slate-800 dark:text-slate-100 overflow-y-auto">
        <!-- Header -->
        <div>
          <div class="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
                <Sparkles class="w-5 h-5 text-indigo-100" />
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white tracking-tight">Nexus AI Copilot</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Contextual Telemetry & Financial Engine</p>
              </div>
            </div>

            <button
              type="button"
              @click="emit('close')"
              class="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Close copilot"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Overall Financial Health Summary Card -->
          <div class="my-6 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100/90 dark:border-indigo-900/60">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-indigo-900 dark:text-indigo-300">Financial Health Score</span>
              <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {{ healthScore }} / 100 • {{ healthLabel }}
              </span>
            </div>
            <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              Active ledger totals <span class="font-bold text-slate-900 dark:text-white">{{ formatCurrency(txStore.totalVolume, settingsStore.currency) }}</span> in settled ARR. Evaluated at <span class="font-mono text-[11px] text-slate-500 dark:text-slate-400">{{ lastEvaluatedAt }}</span>.
            </p>
          </div>

          <!-- Progress feedback banner during analysis -->
          <div
            v-if="isAnalyzing"
            class="mb-4 p-3 rounded-xl bg-indigo-600 text-white text-xs font-semibold flex items-center gap-2 shadow-md animate-pulse"
          >
            <Cpu class="w-4 h-4 shrink-0 animate-spin" />
            <span>{{ analysisStep }}</span>
          </div>

          <!-- Actionable Insights List -->
          <div class="space-y-4">
            <div class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              High-Impact Recommendations
            </div>

            <div
              v-for="item in dynamicInsights"
              :key="item.id"
              class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition"
            >
              <div class="flex items-start gap-3">
                <div :class="['w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs', item.iconColor]">
                  <component :is="item.icon" class="w-4 h-4" />
                </div>
                <div class="flex-1">
                  <h4 class="text-xs font-bold text-slate-900 dark:text-white">{{ item.title }}</h4>
                  <p class="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{{ item.body }}</p>
                  <button
                    type="button"
                    class="mt-3 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 group cursor-pointer"
                  >
                    <span>{{ item.action }}</span>
                    <span class="transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer: Re-run button -->
        <div class="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            @click="runAnalysis"
            :disabled="isAnalyzing"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw :class="['w-4 h-4', isAnalyzing && 'animate-spin']" />
            <span>{{ isAnalyzing ? 'Evaluating Telemetry...' : 'Re-Run Anomaly Detection' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
