<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'
import AiInsightsModal from '@/components/analytics/AiInsightsModal.vue'
import CommandPalette from '@/components/common/CommandPalette.vue'

const isMobileOpen = ref(false)
const isAiDrawerOpen = ref(false)
const isPaletteOpen = ref(false)

function toggleMobile() {
  isMobileOpen.value = !isMobileOpen.value
}

function closeMobile() {
  isMobileOpen.value = false
}

function toggleAiDrawer() {
  isAiDrawerOpen.value = !isAiDrawerOpen.value
}

function togglePalette() {
  isPaletteOpen.value = !isPaletteOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex relative overflow-x-hidden selection:bg-indigo-600 selection:text-white transition-colors duration-200">
    <!-- Backdrop for mobile drawer -->
    <div
      v-if="isMobileOpen"
      @click="closeMobile"
      class="fixed inset-0 z-30 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-xs md:hidden transition-opacity"
    ></div>

    <!-- Desktop & Mobile Sidebar -->
    <Sidebar
      :is-mobile-open="isMobileOpen"
      @close-mobile="closeMobile"
    />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 md:pl-64">
      <!-- Top Navigation Bar -->
      <Navbar
        :is-mobile-open="isMobileOpen"
        @toggle-mobile="toggleMobile"
        @toggle-ai-drawer="toggleAiDrawer"
        @toggle-palette="togglePalette"
      />

      <!-- Page View Router Outlet -->
      <main class="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto relative z-10">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- AI Copilot Modal/Drawer -->
    <AiInsightsModal
      :is-open="isAiDrawerOpen"
      @close="isAiDrawerOpen = false"
    />

    <!-- Global Command Palette (⌘K) -->
    <CommandPalette
      :is-open="isPaletteOpen"
      @close="isPaletteOpen = false"
      @open-ai-copilot="isAiDrawerOpen = true"
    />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
