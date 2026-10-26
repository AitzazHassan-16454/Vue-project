<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  BarChart3,
  CreditCard,
  Settings,
  Sparkles,
  Zap,
  ChevronRight,
} from '@lucide/vue'

defineProps<{
  isMobileOpen?: boolean
}>()

const emit = defineEmits<{
  (e: 'closeMobile'): void
}>()

const route = useRoute()

const navItems = [
  { name: 'Overview', path: '/', icon: LayoutDashboard },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Transactions', path: '/transactions', icon: CreditCard },
  { name: 'Settings', path: '/settings', icon: Settings },
]

const currentPath = computed(() => route.path)
</script>

<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0',
      'bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 text-slate-300',
      isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    ]"
  >
    <!-- Brand Header -->
    <div class="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
      <RouterLink to="/" class="flex items-center gap-3 group" @click="emit('closeMobile')">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
          <Zap class="w-5 h-5 text-white" />
        </div>
        <div class="flex flex-col">
          <span class="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
            Nexus <span class="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">PRO</span>
          </span>
          <span class="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Analytics Suite</span>
        </div>
      </RouterLink>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
      <div class="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        Workspace
      </div>
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        @click="emit('closeMobile')"
        :class="[
          'flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative',
          currentPath === item.path
            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        ]"
      >
        <component
          :is="item.icon"
          :class="[
            'w-4 h-4 transition-transform duration-200 group-hover:scale-110',
            currentPath === item.path ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
          ]"
        />
        <span>{{ item.name }}</span>

        <ChevronRight
          v-if="currentPath === item.path"
          class="w-4 h-4 ml-auto text-white/80"
        />
      </RouterLink>
    </nav>

    <!-- Bottom Pro Info Card -->
    <div class="p-4 m-3 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-800/30 border border-slate-700/60">
      <div class="flex items-center gap-2 mb-2">
        <Sparkles class="w-4 h-4 text-cyan-400" />
        <span class="text-xs font-semibold text-white">AI Insights Active</span>
      </div>
      <p class="text-[11px] text-slate-400 mb-3 leading-relaxed">
        Live anomaly detection and real-time ledger intelligence enabled.
      </p>
      <div class="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-700/50">
        <span class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Operational
        </span>
        <span class="font-mono text-slate-400">v1.0.0</span>
      </div>
    </div>
  </aside>
</template>
