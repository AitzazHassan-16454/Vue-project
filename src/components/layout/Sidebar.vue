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
  X,
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
      'fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-all duration-300 ease-in-out md:translate-x-0',
      'bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-[1px_0_3px_rgba(0,0,0,0.02)]',
      isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    ]"
  >
    <!-- Brand Header -->
    <div class="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
      <RouterLink to="/" class="flex items-center gap-3 group" @click="emit('closeMobile')">
        <div class="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
          <Zap class="w-5 h-5 text-white" />
        </div>
        <div class="flex flex-col">
          <span class="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
            Nexus <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/80 uppercase">PRO</span>
          </span>
          <span class="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Analytics Suite</span>
        </div>
      </RouterLink>

      <!-- Explicit Mobile Close Button -->
      <button
        type="button"
        @click="emit('closeMobile')"
        class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden cursor-pointer"
        aria-label="Close sidebar"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 px-3.5 py-6 space-y-1.5 overflow-y-auto">
      <div class="px-3 pb-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        Workspace
      </div>
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        @click="emit('closeMobile')"
        :class="[
          'flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative cursor-pointer',
          currentPath === item.path
            ? 'bg-indigo-50/90 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold shadow-2xs border border-indigo-100 dark:border-indigo-900/60'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
        ]"
      >
        <component
          :is="item.icon"
          :class="[
            'w-4 h-4 transition-transform duration-200 group-hover:scale-110',
            currentPath === item.path ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
          ]"
        />
        <span>{{ item.name }}</span>

        <ChevronRight
          v-if="currentPath === item.path"
          class="w-4 h-4 ml-auto text-indigo-600 dark:text-indigo-400"
        />
      </RouterLink>
    </nav>

    <!-- Bottom Pro Info Card -->
    <div class="p-4 m-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 shadow-2xs shrink-0">
      <div class="flex items-center gap-2 mb-1.5">
        <Sparkles class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        <span class="text-xs font-bold text-slate-900 dark:text-white">AI Engine Active</span>
      </div>
      <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
        Real-time anomaly detection and ledger intelligence enabled.
      </p>
      <div class="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/70 dark:border-slate-700/60">
        <span class="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          Operational
        </span>
        <span class="font-mono text-slate-400 dark:text-slate-500">v1.0.0</span>
      </div>
    </div>
  </aside>
</template>
