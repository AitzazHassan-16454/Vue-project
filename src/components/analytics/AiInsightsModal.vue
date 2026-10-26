<script setup lang="ts">
import { ref } from 'vue'
import {
  Sparkles,
  X,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
} from '@lucide/vue'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isAnalyzing = ref(false)

const insights = ref([
  {
    id: 1,
    type: 'opportunity',
    icon: Lightbulb,
    iconColor: 'text-amber-600 bg-amber-50 border-amber-200',
    title: 'Enterprise Upgrade Opportunity',
    body: 'Acme Cloud Platform reached 94% of allocated cluster capacity. Our telemetry predicts they will exceed limits in 5 days.',
    action: 'Send Custom Upgrade Proposal',
  },
  {
    id: 2,
    type: 'savings',
    icon: TrendingUp,
    iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    title: 'Cloud Optimization: Save $1,280/mo',
    body: 'GPU inference utilization drops by 68% between 02:00 and 06:00 UTC. Enabling auto-scaling downscales will preserve margin.',
    action: 'Enable Dynamic Node Downscaling',
  },
  {
    id: 3,
    type: 'warning',
    icon: AlertTriangle,
    iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    title: 'Stripe Gateway Latency Alert',
    body: 'Payment authorization latency increased to 840ms on EU-West routes. Fallback to Adyen recommended.',
    action: 'Activate Gateway Redundancy',
  },
])

function runAnalysis() {
  isAnalyzing.value = true
  setTimeout(() => {
    isAnalyzing.value = false
  }, 1200)
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-hidden">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      @click="emit('close')"
    ></div>

    <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
      <div class="w-screen max-w-md bg-white border-l border-slate-200 p-6 md:p-8 flex flex-col justify-between shadow-2xl relative z-10 text-slate-800">
        <!-- Header -->
        <div>
          <div class="flex items-center justify-between pb-6 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
                <Sparkles class="w-5 h-5 text-indigo-100" />
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900 tracking-tight">Nexus AI Copilot</h3>
                <p class="text-xs text-slate-500 font-medium">Contextual Telemetry & Financial Engine</p>
              </div>
            </div>

            <button
              type="button"
              @click="emit('close')"
              class="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Overall Financial Health Summary Card -->
          <div class="my-6 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100/90">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-indigo-800">Financial Health Score</span>
              <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                98 / 100 • Optimal
              </span>
            </div>
            <p class="text-xs text-slate-700 leading-relaxed font-normal">
              Revenue run rate is accelerating at <span class="text-emerald-700 font-bold">+14.2%</span>. Current runway stands at <strong class="text-slate-900 font-bold">26.4 months</strong> with low default risk across active accounts.
            </p>
          </div>

          <!-- Actionable Insights List -->
          <div class="space-y-4">
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              High-Impact Recommendations
            </div>

            <div
              v-for="item in insights"
              :key="item.id"
              class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 transition"
            >
              <div class="flex items-start gap-3">
                <div :class="['w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border', item.iconColor]">
                  <component :is="item.icon" class="w-4 h-4" />
                </div>
                <div class="flex-1">
                  <h4 class="text-xs font-bold text-slate-900">{{ item.title }}</h4>
                  <p class="text-[11px] text-slate-600 mt-1 leading-relaxed">{{ item.body }}</p>
                  <button
                    type="button"
                    class="mt-3 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
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
        <div class="pt-6 border-t border-slate-100">
          <button
            type="button"
            @click="runAnalysis"
            :disabled="isAnalyzing"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
          >
            <RefreshCw :class="['w-4 h-4', isAnalyzing && 'animate-spin']" />
            <span>{{ isAnalyzing ? 'Evaluating Telemetry...' : 'Re-Run Anomaly Detection' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
