<script setup lang="ts">
import { ref } from 'vue'
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  RefreshCw,
  Server,
  Activity,
} from '@lucide/vue'

const isPinging = ref(false)
const lastPingLatency = ref('18ms')

const funnelSteps = [
  {
    step: '1. Checkout Sessions Initialized',
    volume: '12,450 req',
    rate: '100%',
    drop: '0.0%',
    color: 'from-indigo-600 to-indigo-500',
    barWidth: '100%',
    desc: 'Customer initiated invoice settlement',
  },
  {
    step: '2. Real-Time Risk & Fraud Screening',
    volume: '12,180 passed',
    rate: '97.8%',
    drop: '-2.2%',
    color: 'from-indigo-500 to-blue-500',
    barWidth: '97.8%',
    desc: 'Machine learning anomaly shield verified',
  },
  {
    step: '3. 3D Secure & Biometric Challenge',
    volume: '11,840 approved',
    rate: '95.1%',
    drop: '-2.7%',
    color: 'from-blue-500 to-cyan-500',
    barWidth: '95.1%',
    desc: 'SCA / PSD2 protocol compliant authentication',
  },
  {
    step: '4. Card Interbank Network Clearing',
    volume: '11,620 cleared',
    rate: '93.3%',
    drop: '-1.8%',
    color: 'from-cyan-500 to-teal-500',
    barWidth: '93.3%',
    desc: 'Visa, Mastercard & SEPA routing confirmed',
  },
  {
    step: '5. Settled & Reconciled Inflow',
    volume: '11,480 settled',
    rate: '92.2%',
    drop: 'Final',
    color: 'from-teal-500 to-emerald-500',
    barWidth: '92.2%',
    desc: 'Funds cleared into merchant treasury ledger',
  },
]

function pingGateway() {
  isPinging.value = true
  setTimeout(() => {
    const lat = Math.floor(14 + Math.random() * 8)
    lastPingLatency.value = `${lat}ms`
    isPinging.value = false
  }, 900)
}
</script>

<template>
  <div class="depth-card rounded-2xl p-6 md:p-8 flex flex-col justify-between">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <Activity class="w-4 h-4" />
        </div>
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white tracking-tight">Payment Pipeline & Settlement Funnel</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Conversion pass-through from checkout invocation to ledger clearance</p>
        </div>
      </div>

      <!-- Action: Ping gateway -->
      <button
        type="button"
        @click="pingGateway"
        :disabled="isPinging"
        class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
      >
        <RefreshCw :class="['w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400', isPinging && 'animate-spin']" />
        <span>{{ isPinging ? 'Pinging Nodes...' : `Edge Latency: ${lastPingLatency}` }}</span>
      </button>
    </div>

    <!-- Quick stats ribbon -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 p-4 rounded-xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
      <div>
        <div class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">End-to-End Conversion</div>
        <div class="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
          92.2% Net
        </div>
        <span class="text-[10px] text-slate-400 dark:text-slate-500 font-medium">+1.8% above fintech baseline</span>
      </div>

      <div>
        <div class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fraud Block Efficiency</div>
        <div class="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">
          99.82%
        </div>
        <span class="text-[10px] text-slate-400 dark:text-slate-500 font-medium">&lt; 0.01% dispute ratio</span>
      </div>

      <div>
        <div class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg Authorization Time</div>
        <div class="text-xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
          234 ms
        </div>
        <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Ultra-low latency routing</span>
      </div>
    </div>

    <!-- Stepped Funnel Bars -->
    <div class="space-y-4">
      <div
        v-for="(st, idx) in funnelSteps"
        :key="st.step"
        class="space-y-1.5"
      >
        <div class="flex items-center justify-between text-xs font-semibold">
          <div class="flex items-center gap-2">
            <span class="text-slate-900 dark:text-white font-bold">{{ st.step }}</span>
            <span class="text-[11px] text-slate-400 dark:text-slate-500 font-normal hidden md:inline">• {{ st.desc }}</span>
          </div>

          <div class="flex items-center gap-3">
            <span class="font-mono text-slate-900 dark:text-white font-bold">{{ st.volume }}</span>
            <span
              :class="[
                'text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border',
                idx === 4
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                  : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
              ]"
            >
              {{ st.rate }}
            </span>
          </div>
        </div>

        <!-- Progress Bar Background & Fill -->
        <div class="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
          <div
            :class="['h-full rounded-full bg-gradient-to-r transition-all duration-700', st.color]"
            :style="{ width: st.barWidth }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Funnel Footer Note -->
    <div class="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
      <div class="flex items-center gap-2">
        <ShieldCheck class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span>PCI-DSS Level 1 certified clearing pipeline</span>
      </div>
      <div class="flex items-center gap-1 font-mono text-[11px]">
        <span>Stripe</span>
        <ArrowRight class="w-3 h-3 text-slate-400" />
        <span>Adyen</span>
        <ArrowRight class="w-3 h-3 text-slate-400" />
        <span>SEPA / Wire</span>
      </div>
    </div>
  </div>
</template>
