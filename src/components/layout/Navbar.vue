<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
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
import { useSettingsStore } from '@/stores/settingsStore'

defineProps<{
  isMobileOpen?: boolean
}>()

const emit = defineEmits<{
  (e: 'toggleMobile'): void
  (e: 'toggleAiDrawer'): void
  (e: 'togglePalette'): void
}>()

const route = useRoute()
const settingsStore = useSettingsStore()

// Dark Mode Toggle
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

const userInitials = computed(() => {
  return settingsStore.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'AH'
})

function handleGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    emit('togglePalette')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<template>
  <header class="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-3 sm:px-4 md:px-8 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors duration-200">
    <!-- Left: Mobile menu button + Page title -->
    <div class="flex items-center gap-2.5 sm:gap-4 min-w-0">
      <button
        type="button"
        @click="emit('toggleMobile')"
        class="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors cursor-pointer shrink-0"
        aria-label="Toggle navigation"
      >
        <Menu class="w-5 h-5" />
      </button>

      <div class="min-w-0">
        <h1 class="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate">
          {{ pageTitle }}
        </h1>
        <p class="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
          Nexus Cloud Financial & Performance Workspace
        </p>
      </div>
    </div>

    <!-- Center/Right: Search Bar & Actions -->
    <div class="flex items-center gap-1.5 sm:gap-2.5 md:gap-3.5 shrink-0">
      <!-- Desktop Search Input Trigger (⌘K) -->
      <button
        type="button"
        @click="emit('togglePalette')"
        class="relative hidden sm:flex items-center w-48 md:w-64 lg:w-72 pl-9 pr-10 py-1.5 text-xs text-left rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-500 focus:outline-none transition-all shadow-2xs cursor-pointer"
      >
        <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <span class="truncate">Search commands, metrics...</span>
        <kbd class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-600 shadow-2xs">
          ⌘K
        </kbd>
      </button>

      <!-- Mobile Search Icon Button -->
      <button
        type="button"
        @click="emit('togglePalette')"
        class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 shadow-2xs sm:hidden cursor-pointer"
        title="Search (⌘K)"
        aria-label="Open search"
      >
        <Search class="w-4 h-4" />
      </button>

      <!-- AI Copilot Button -->
      <button
        type="button"
        @click="emit('toggleAiDrawer')"
        class="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0"
        aria-label="Open AI Copilot"
      >
        <Sparkles class="w-3.5 h-3.5 text-indigo-200" />
        <span class="hidden md:inline">AI Copilot</span>
      </button>

      <!-- Theme Switcher -->
      <button
        type="button"
        @click="toggleDark()"
        class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer shrink-0"
        :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        aria-label="Toggle color theme"
      >
        <Sun v-if="isDark" class="w-4 h-4 text-amber-400" />
        <Moon v-else class="w-4 h-4 text-slate-600" />
      </button>

      <!-- Notifications Bell -->
      <button
        type="button"
        class="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer shrink-0"
        title="Notifications"
        aria-label="View notifications"
      >
        <Bell class="w-4 h-4" />
        <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900"></span>
      </button>

      <!-- User Profile Badge -->
      <div class="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-slate-200 dark:border-slate-800 shrink-0">
        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-[11px] sm:text-xs font-bold text-white shadow-sm shrink-0">
          {{ userInitials }}
        </div>
        <div class="hidden lg:block text-left">
          <div class="text-xs font-semibold text-slate-900 dark:text-white">{{ settingsStore.name }}</div>
          <div class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{{ settingsStore.role }}</div>
        </div>
      </div>
    </div>
  </header>
</template>
