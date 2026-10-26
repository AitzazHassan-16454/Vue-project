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

// Default to Light Mode First
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
  initialValue: 'light',
})
const toggleDark = useToggle(isDark)

const pageTitle = computed(() => {
  return (route.meta?.title as string) || 'Executive Dashboard'
})
</script>

<template>
  <header class="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-4 md:px-8 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
    <!-- Left: Mobile menu button + Page title -->
    <div class="flex items-center gap-4">
      <button
        type="button"
        @click="emit('toggleMobile')"
        class="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 md:hidden transition-colors"
        aria-label="Toggle navigation"
      >
        <Menu class="w-5 h-5" />
      </button>

      <div>
        <h1 class="text-base md:text-lg font-bold text-slate-900 tracking-tight">
          {{ pageTitle }}
        </h1>
        <p class="hidden sm:block text-[11px] text-slate-500 font-medium">
          Nexus Cloud Financial & Performance Workspace
        </p>
      </div>
    </div>

    <!-- Center/Right: Search Bar & Actions -->
    <div class="flex items-center gap-2.5 md:gap-3.5">
      <!-- Search Input -->
      <div class="relative hidden sm:block w-52 md:w-72">
        <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search metrics, clients, invoices..."
          class="w-full pl-9 pr-10 py-1.5 text-xs rounded-xl bg-slate-100/80 border border-slate-200/90 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
        />
        <kbd class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-white text-slate-500 border border-slate-200 shadow-2xs">
          ⌘K
        </kbd>
      </div>

      <!-- AI Copilot Button -->
      <button
        type="button"
        @click="emit('toggleAiDrawer')"
        class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <Sparkles class="w-3.5 h-3.5 text-indigo-200" />
        <span class="hidden md:inline">AI Copilot</span>
      </button>

      <!-- Theme Switcher -->
      <button
        type="button"
        @click="toggleDark()"
        class="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200 shadow-2xs"
        :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      >
        <Sun v-if="isDark" class="w-4 h-4 text-amber-500" />
        <Moon v-else class="w-4 h-4 text-slate-600" />
      </button>

      <!-- Notifications Bell -->
      <button
        type="button"
        class="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200 shadow-2xs"
        title="Notifications"
      >
        <Bell class="w-4 h-4" />
        <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
      </button>

      <!-- User Profile Badge -->
      <div class="flex items-center gap-2 pl-2 border-l border-slate-200">
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
          AH
        </div>
        <div class="hidden lg:block text-left">
          <div class="text-xs font-semibold text-slate-900">Aitzaz Hassan</div>
          <div class="text-[10px] text-slate-500 font-medium">Founder & Lead</div>
        </div>
      </div>
    </div>
  </header>
</template>
