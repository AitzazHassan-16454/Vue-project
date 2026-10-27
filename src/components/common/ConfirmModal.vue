<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { AlertTriangle, Info, AlertCircle, X } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'info'
    isLoading?: boolean
  }>(),
  {
    confirmText: 'Confirm Action',
    cancelText: 'Cancel',
    variant: 'danger',
    isLoading: false,
  }
)

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'close'): void
}>()

const variantConfig = computed(() => {
  switch (props.variant) {
    case 'danger':
      return {
        icon: AlertTriangle,
        iconBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/60',
        confirmBtn: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/30',
      }
    case 'warning':
      return {
        icon: AlertCircle,
        iconBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
        confirmBtn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm shadow-amber-600/30',
      }
    case 'info':
    default:
      return {
        icon: Info,
        iconBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60',
        confirmBtn: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/30',
      }
  }
})

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-xs transition-opacity"
        @click="emit('close')"
      ></div>

      <!-- Modal Card with Prominent Dark Depth Shadow -->
      <div
        class="depth-modal bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 relative z-10 transform transition-all animate-in fade-in zoom-in-95 duration-150"
      >
        <!-- Top: Icon + Close button -->
        <div class="flex items-start justify-between">
          <div
            :class="[
              'w-11 h-11 rounded-2xl flex items-center justify-center border shadow-2xs',
              variantConfig.iconBg
            ]"
          >
            <component :is="variantConfig.icon" class="w-5 h-5" />
          </div>

          <button
            type="button"
            @click="emit('close')"
            class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Content -->
        <div class="mt-4">
          <h3 class="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            {{ title }}
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1.5 leading-relaxed">
            {{ message }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            @click="emit('close')"
            :disabled="isLoading"
            class="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50"
          >
            {{ cancelText }}
          </button>

          <button
            type="button"
            @click="emit('confirm')"
            :disabled="isLoading"
            :class="[
              'px-4 py-2 text-xs font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50',
              variantConfig.confirmBtn
            ]"
          >
            <span v-if="isLoading" class="flex items-center gap-1.5">
              <span class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Processing...
            </span>
            <span v-else>{{ confirmText }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
