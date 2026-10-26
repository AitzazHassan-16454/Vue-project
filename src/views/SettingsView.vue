<script setup lang="ts">
import { ref } from 'vue'
import {
  Shield,
  User,
  CreditCard,
  Key,
  Check,
  CheckCircle2,
} from '@lucide/vue'
import { useSettingsStore } from '@/stores/settingsStore'

const settingsStore = useSettingsStore()

const activeTab = ref<'general' | 'security' | 'billing' | 'webhooks'>('general')
const showSavedBanner = ref(false)

// Local form bindings
const formName = ref(settingsStore.name)
const formEmail = ref(settingsStore.email)
const formCompany = ref(settingsStore.company)
const formCurrency = ref(settingsStore.currency)
const form2FA = ref(settingsStore.twoFactorEnabled)
const formEmailNotifs = ref(settingsStore.emailNotifications)
const formWebhook = ref(settingsStore.webhookUrl)
const formAutoScale = ref(settingsStore.autoScaleCluster)

function handleSave() {
  settingsStore.updateSettings({
    name: formName.value,
    email: formEmail.value,
    company: formCompany.value,
    currency: formCurrency.value,
    twoFactorEnabled: form2FA.value,
    emailNotifications: formEmailNotifs.value,
    webhookUrl: formWebhook.value,
    autoScaleCluster: formAutoScale.value,
  })

  showSavedBanner.value = true
  setTimeout(() => {
    showSavedBanner.value = false
  }, 3000)
}
</script>

<template>
  <div class="space-y-8 pb-12 max-w-5xl">
    <!-- Header -->
    <div class="depth-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Platform Workspace & Preferences
        </h2>
        <p class="text-xs md:text-sm text-slate-500 font-medium mt-1">
          Configure security protocols, currency formatting, API gateways, and account details.
        </p>
      </div>

      <!-- Save Button -->
      <button
        type="button"
        @click="handleSave"
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition self-start md:self-auto"
      >
        <Check class="w-4 h-4" />
        <span>Save Platform Changes</span>
      </button>
    </div>

    <!-- Success Toast Banner -->
    <div
      v-if="showSavedBanner"
      class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-sm transition-all"
    >
      <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
      <span>Preferences saved successfully and persisted in browser storage!</span>
    </div>

    <!-- Interactive Navigation Tabs -->
    <div class="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
      <button
        type="button"
        @click="activeTab = 'general'"
        :class="[
          'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all',
          activeTab === 'general'
            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        ]"
      >
        <User class="w-3.5 h-3.5" />
        <span>Profile & Account</span>
      </button>

      <button
        type="button"
        @click="activeTab = 'security'"
        :class="[
          'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all',
          activeTab === 'security'
            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        ]"
      >
        <Shield class="w-3.5 h-3.5" />
        <span>Security & 2FA</span>
      </button>

      <button
        type="button"
        @click="activeTab = 'billing'"
        :class="[
          'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all',
          activeTab === 'billing'
            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        ]"
      >
        <CreditCard class="w-3.5 h-3.5" />
        <span>Currency & Invoicing</span>
      </button>

      <button
        type="button"
        @click="activeTab = 'webhooks'"
        :class="[
          'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all',
          activeTab === 'webhooks'
            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        ]"
      >
        <Key class="w-3.5 h-3.5" />
        <span>API & Webhooks</span>
      </button>
    </div>

    <!-- Tab 1: Profile & Account -->
    <div v-if="activeTab === 'general'" class="depth-card rounded-2xl p-6 md:p-8 space-y-6">
      <h3 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Account Details</h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Full Legal Name</label>
          <input
            v-model="formName"
            type="text"
            class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 font-medium"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
          <input
            v-model="formEmail"
            type="email"
            class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 font-mono"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Organization / Workspace</label>
          <input
            v-model="formCompany"
            type="text"
            class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 font-medium"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Role Designation</label>
          <input
            type="text"
            disabled
            value="Founder & Lead Architect"
            class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed font-medium"
          />
        </div>
      </div>
    </div>

    <!-- Tab 2: Security & 2FA -->
    <div v-else-if="activeTab === 'security'" class="depth-card rounded-2xl p-6 md:p-8 space-y-6">
      <h3 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Authentication Security</h3>

      <div class="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div>
          <h4 class="text-xs font-bold text-slate-900">Two-Factor Hardware Authentication</h4>
          <p class="text-[11px] text-slate-500 mt-0.5">Require an authenticator code (TOTP) or YubiKey upon login.</p>
        </div>
        <button
          type="button"
          @click="form2FA = !form2FA"
          :class="[
            'w-12 h-6 rounded-full transition-colors relative cursor-pointer',
            form2FA ? 'bg-indigo-600' : 'bg-slate-300'
          ]"
        >
          <span
            :class="[
              'w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs',
              form2FA ? 'right-0.5' : 'left-0.5'
            ]"
          ></span>
        </button>
      </div>

      <div class="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div>
          <h4 class="text-xs font-bold text-slate-900">Security Email Notifications</h4>
          <p class="text-[11px] text-slate-500 mt-0.5">Notify instantly on new session registrations from unfamiliar IPs.</p>
        </div>
        <button
          type="button"
          @click="formEmailNotifs = !formEmailNotifs"
          :class="[
            'w-12 h-6 rounded-full transition-colors relative cursor-pointer',
            formEmailNotifs ? 'bg-indigo-600' : 'bg-slate-300'
          ]"
        >
          <span
            :class="[
              'w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs',
              formEmailNotifs ? 'right-0.5' : 'left-0.5'
            ]"
          ></span>
        </button>
      </div>
    </div>

    <!-- Tab 3: Billing & Currency -->
    <div v-else-if="activeTab === 'billing'" class="depth-card rounded-2xl p-6 md:p-8 space-y-6">
      <h3 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Billing & Settlement</h3>

      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1.5">Reporting Currency Display</label>
        <select
          v-model="formCurrency"
          class="w-full sm:w-64 px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-indigo-500"
        >
          <option value="USD">USD ($) - United States Dollar</option>
          <option value="EUR">EUR (€) - European Euro</option>
          <option value="GBP">GBP (£) - British Pound Sterling</option>
        </select>
        <p class="text-[11px] text-slate-500 mt-1">Adjusts all metric totals and table ledger displays across the platform.</p>
      </div>
    </div>

    <!-- Tab 4: Webhooks -->
    <div v-else-if="activeTab === 'webhooks'" class="depth-card rounded-2xl p-6 md:p-8 space-y-6">
      <h3 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Real-time Webhook Listeners</h3>

      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1.5">Production Ingestion Endpoint</label>
        <input
          v-model="formWebhook"
          type="url"
          class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-none focus:bg-white focus:border-indigo-500"
        />
        <p class="text-[11px] text-slate-500 mt-1">Stripe, PayPal, and Adyen invoice webhooks dispatch payloads to this destination.</p>
      </div>

      <div class="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div>
          <h4 class="text-xs font-bold text-slate-900">Auto-Scale Ingestion Nodes</h4>
          <p class="text-[11px] text-slate-500 mt-0.5">Dynamically increase concurrent workers when request volume exceeds 2,000 req/sec.</p>
        </div>
        <button
          type="button"
          @click="formAutoScale = !formAutoScale"
          :class="[
            'w-12 h-6 rounded-full transition-colors relative cursor-pointer',
            formAutoScale ? 'bg-indigo-600' : 'bg-slate-300'
          ]"
        >
          <span
            :class="[
              'w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs',
              formAutoScale ? 'right-0.5' : 'left-0.5'
            ]"
          ></span>
        </button>
      </div>
    </div>
  </div>
</template>
