<script setup lang="ts">
import { Settings, Shield, Bell, Cloud, Key } from '@lucide/vue'
</script>

<template>
  <div class="space-y-6 max-w-4xl">
    <div>
      <h2 class="text-xl md:text-2xl font-bold text-white tracking-tight">Platform Settings</h2>
      <p class="text-xs md:text-sm text-slate-400">Manage security preferences, API webhooks, and team workspace rules.</p>
    </div>

    <div class="space-y-4">
      <!-- General Settings Item -->
      <div class="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between">
        <div class="flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Shield class="w-5 h-5" />
          </div>
          <div>
            <h4 class="text-sm font-semibold text-white">Two-Factor Authentication</h4>
            <p class="text-xs text-slate-400">Enforce hardware key and authenticator app verification.</p>
          </div>
        </div>
        <span class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Enabled
        </span>
      </div>

      <!-- Cloud Sync Item -->
      <div class="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between">
        <div class="flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Cloud class="w-5 h-5" />
          </div>
          <div>
            <h4 class="text-sm font-semibold text-white">Continuous Deployment</h4>
            <p class="text-xs text-slate-400">Auto-deploy changes on push to GitHub main branch.</p>
          </div>
        </div>
        <span class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
          Active
        </span>
      </div>

      <!-- API Keys Item -->
      <div class="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between">
        <div class="flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Key class="w-5 h-5" />
          </div>
          <div>
            <h4 class="text-sm font-semibold text-white">Payment Gateway Webhooks</h4>
            <p class="text-xs text-slate-400">Stripe and PayPal real-time event listeners.</p>
          </div>
        </div>
        <span class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60">
          Configured
        </span>
      </div>
    </div>
  </div>
</template>
