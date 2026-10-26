<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
} from '@lucide/vue'

defineProps<{
  isMobileOpen?: boolean
}>()

const emit = defineEmits<{
  (e: 'toggleMobile'): void
  (e: 'toggleAiDrawer'): void
}>()

const route = useRoute()

// Dark mode state powered by @vueuse/core
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
})
const toggleDark = useToggle(isDark)

const pageTitle = computed(() => {
  return (route.meta?.title as string) || 'Executive Dashboard'
})
</script>

<template>
  <header class="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 flex items-center justify-between px-4 md:px-8">
    <!-- Left: Mobile menu button + Page title -->
    <div class="flex items-center gap-4">
      <button
        type="button"
        @click="emit('toggleMobile')"
        class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 md:hidden transition-colors"
        aria-label="Toggle navigation"
      >
        <Menu class="w-5 h-5" />
      </button>

      <div>
        <h1 class="text-base md:text-lg font-bold text-white tracking-tight">
          {{ pageTitle }}
        </h1>
        <p class="hidden sm:block text-[11px] text-slate-400">
          Nexus Cloud Financial & Performance Workspace
        </p>
      </div>
    </div>

    <!-- Center/Right: Search Bar & Actions -->
    <div class="flex items-center gap-2.5 md:gap-4">
      <!-- Search Input -->
      <div class="relative hidden sm:block w-48 md:w-64">
        <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search metrics, invoices..."
          class="w-full pl-9 pr-10 py-1.5 text-xs rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
        <kbd class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-700/60 text-slate-400 border border-slate-600/50">
          ⌘K
        </kbd>
      </div>

      <!-- AI Insights Button -->
      <button
        type="button"
        @click="emit('toggleAiDrawer')"
        class="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <Sparkles class="w-3.5 h-3.5 text-cyan-200" />
        <span class="hidden md:inline">AI Copilot</span>
      </button>

      <!-- Theme Switcher -->
      <button
        type="button"
        @click="toggleDark()"
        class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors border border-slate-700/50"
        :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      >
        <Sun v-if="isDark" class="w-4 h-4 text-amber-400" />
        <Moon v-else class="w-4 h-4 text-slate-300" />
      </button>

      <!-- Notifications Bell -->
      <button
        type="button"
        class="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors border border-slate-700/50"
        title="Notifications"
      >
        <Bell class="w-4 h-4" />
        <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-slate-900"></span>
      </button>

      <!-- User Profile Badge -->
      <div class="flex items-center gap-2 pl-2 border-l border-slate-800">
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-blue-500/20">
          AH
        </div>
        <div class="hidden lg:block text-left">
          <div class="text-xs font-semibold text-slate-200">Aitzaz Hassan</div>
          <div class="text-[10px] text-slate-400 font-medium">Founder & Lead</div>
        </div>
      </div>
    </div>
  </header>
</template>
