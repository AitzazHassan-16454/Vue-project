<script setup lang="ts">
import { BarChart3, TrendingUp, Calendar, Filter } from '@lucide/vue'
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl md:text-2xl font-bold text-white tracking-tight">Financial & Growth Analytics</h2>
        <p class="text-xs md:text-sm text-slate-400">Detailed metric breakdowns, retention, and cash runway projections.</p>
      </div>

      <div class="flex items-center gap-2.5">
        <button type="button" class="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 text-slate-200 border border-slate-700/60 hover:bg-slate-700 transition">
          <Calendar class="w-3.5 h-3.5 text-slate-400" />
          <span>Last 30 Days</span>
        </button>
        <button type="button" class="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 text-slate-200 border border-slate-700/60 hover:bg-slate-700 transition">
          <Filter class="w-3.5 h-3.5 text-slate-400" />
          <span>Filter</span>
        </button>
      </div>
    </div>

    <!-- Analytics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 min-h-[300px] flex flex-col justify-between">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 class="text-sm font-semibold text-white flex items-center gap-2">
            <BarChart3 class="w-4 h-4 text-blue-400" />
            Gross Volume & MRR Expansion
          </h3>
          <span class="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">+22.4% YoY</span>
        </div>
        <div class="flex-1 flex flex-col items-center justify-center py-10 text-slate-400">
          <p class="text-xs text-slate-400 text-center">Chart visualization pipeline configured for Phase 4.</p>
        </div>
      </div>

      <div class="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 min-h-[300px] flex flex-col justify-between">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 class="text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp class="w-4 h-4 text-indigo-400" />
            Customer Acquisition Cost vs LTV
          </h3>
          <span class="text-xs text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">Ratio 4.2x</span>
        </div>
        <div class="flex-1 flex flex-col items-center justify-center py-10 text-slate-400">
          <p class="text-xs text-slate-400 text-center">LTV to CAC cohort dynamics chart placeholder.</p>
        </div>
      </div>
    </div>
  </div>
</template>
