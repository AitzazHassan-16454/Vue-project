<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import {
  Search,
  LayoutDashboard,
  BarChart3,
  CreditCard,
  Settings,
  Sparkles,
  Sun,
  Moon,
  Download,
  Plus,
  ArrowRight,
  X,
} from '@lucide/vue'
import { useTransactionStore } from '@/stores/transactionStore'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'openAddTx'): void
  (e: 'openAiCopilot'): void
  (e: 'exportCsv'): void
}>()

const router = useRouter()
const txStore = useTransactionStore()
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
  initialValue: 'light',
})
const toggleDark = useToggle(isDark)

const query = ref('')
const selectedIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

interface PaletteItem {
  id: string
  title: string
  category: 'Navigation' | 'Actions' | 'Transactions'
  icon: any
  action: () => void
  meta?: string
}

const navActions: PaletteItem[] = [
  {
    id: 'nav-overview',
    title: 'Executive Overview',
    category: 'Navigation',
    icon: LayoutDashboard,
    meta: 'Go to /',
    action: () => {
      router.push('/')
      emit('close')
    },
  },
  {
    id: 'nav-analytics',
    title: 'Revenue & Metrics Analytics',
    category: 'Navigation',
    icon: BarChart3,
    meta: 'Go to /analytics',
    action: () => {
      router.push('/analytics')
      emit('close')
    },
  },
  {
    id: 'nav-transactions',
    title: 'Transaction Ledger',
    category: 'Navigation',
    icon: CreditCard,
    meta: 'Go to /transactions',
    action: () => {
      router.push('/transactions')
      emit('close')
    },
  },
  {
    id: 'nav-settings',
    title: 'Platform Settings',
    category: 'Navigation',
    icon: Settings,
    meta: 'Go to /settings',
    action: () => {
      router.push('/settings')
      emit('close')
    },
  },
]

const utilityActions: PaletteItem[] = [
  {
    id: 'act-copilot',
    title: 'Open Nexus AI Copilot',
    category: 'Actions',
    icon: Sparkles,
    meta: 'Analyze Telemetry',
    action: () => {
      emit('close')
      emit('openAiCopilot')
    },
  },
  {
    id: 'act-new-tx',
    title: 'Record New Transaction',
    category: 'Actions',
    icon: Plus,
    meta: 'Add to ledger',
    action: () => {
      emit('close')
      emit('openAddTx')
    },
  },
  {
    id: 'act-export',
    title: 'Export Transactions as CSV',
    category: 'Actions',
    icon: Download,
    meta: 'Download spreadsheet',
    action: () => {
      emit('close')
      emit('exportCsv')
    },
  },
  {
    id: 'act-theme',
    title: 'Toggle Theme (Dark / Light)',
    category: 'Actions',
    icon: isDark.value ? Sun : Moon,
    meta: 'Switch appearance',
    action: () => {
      toggleDark()
      emit('close')
    },
  },
]

const filteredItems = computed<PaletteItem[]>(() => {
  const q = query.value.trim().toLowerCase()

  if (!q) {
    return [...navActions, ...utilityActions]
  }

  // Filter static actions
  const matchedStatic = [...navActions, ...utilityActions].filter((item) =>
    item.title.toLowerCase().includes(q) || (item.meta && item.meta.toLowerCase().includes(q))
  )

  // Filter dynamic transactions
  const matchedTx: PaletteItem[] = txStore.list
    .filter(
      (tx) =>
        tx.client.toLowerCase().includes(q) ||
        tx.id.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q)
    )
    .slice(0, 5)
    .map((tx) => ({
      id: `tx-${tx.id}`,
      title: `${tx.client} (${tx.id})`,
      category: 'Transactions',
      icon: CreditCard,
      meta: `$${tx.amount.toLocaleString()} • ${tx.status}`,
      action: () => {
        router.push('/transactions')
        emit('close')
      },
    }))

  return [...matchedStatic, ...matchedTx]
})

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      query.value = ''
      selectedIndex.value = 0
      nextTick(() => {
        inputRef.value?.focus()
      })
    }
  }
)

function handleKeyDown(e: KeyboardEvent) {
  if (!props.isOpen) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (filteredItems.value.length > 0) {
      selectedIndex.value = (selectedIndex.value + 1) % filteredItems.value.length
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (filteredItems.value.length > 0) {
      selectedIndex.value =
        (selectedIndex.value - 1 + filteredItems.value.length) % filteredItems.value.length
    }
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const item = filteredItems.value[selectedIndex.value]
    if (item) {
      item.action()
    }
  } else if (e.key === 'Escape') {
    e.preventDefault()
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-20 px-3 sm:px-4 pb-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs transition-opacity"
        @click="emit('close')"
      ></div>

      <!-- Palette Box -->
      <div
        class="depth-modal bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl relative z-10 overflow-hidden"
      >
        <!-- Search bar -->
        <div class="relative flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search class="w-4 h-4 text-slate-400 dark:text-slate-500 mr-3 shrink-0" />
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            placeholder="Type a command, route, or transaction..."
            class="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />
          <button
            type="button"
            @click="emit('close')"
            class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- List items -->
        <div class="max-h-80 overflow-y-auto p-2 space-y-1">
          <div
            v-if="filteredItems.length === 0"
            class="py-8 text-center text-xs text-slate-500 dark:text-slate-400"
          >
            No matching results for "{{ query }}"
          </div>

          <button
            v-for="(item, idx) in filteredItems"
            :key="item.id"
            type="button"
            @click="item.action"
            @mouseenter="selectedIndex = idx"
            :class="[
              'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-colors',
              selectedIndex === idx
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
            ]"
          >
            <div class="flex items-center gap-2.5">
              <component
                :is="item.icon"
                :class="[
                  'w-4 h-4 shrink-0',
                  selectedIndex === idx
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-400 dark:text-slate-500'
                ]"
              />
              <div>
                <span>{{ item.title }}</span>
                <span
                  class="ml-2 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                >
                  {{ item.category }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
              <span v-if="item.meta">{{ item.meta }}</span>
              <ArrowRight
                v-if="selectedIndex === idx"
                class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400"
              />
            </div>
          </button>
        </div>

        <!-- Palette Footer -->
        <div class="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
          <div class="flex items-center gap-3">
            <span><kbd class="font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1 rounded">↑↓</kbd> Navigate</span>
            <span><kbd class="font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1 rounded">↵</kbd> Select</span>
            <span><kbd class="font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1 rounded">esc</kbd> Dismiss</span>
          </div>
          <span class="font-semibold text-indigo-600 dark:text-indigo-400">Nexus Command</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>
