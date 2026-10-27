import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Currency = 'USD' | 'EUR' | 'GBP'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const name = ref('Aitzaz Hassan')
    const email = ref('aitzazhassan16454@gmail.com')
    const company = ref('Nexus Technologies')
    const role = ref('Founder & Lead Architect')
    const currency = ref<Currency>('USD')
    const twoFactorEnabled = ref(true)
    const emailNotifications = ref(true)
    const webhookUrl = ref('https://api.nexus-cloud.io/v1/webhooks/live_ledger')
    const autoScaleCluster = ref(true)

    function updateSettings(payload: {
      name?: string
      email?: string
      company?: string
      role?: string
      currency?: Currency
      twoFactorEnabled?: boolean
      emailNotifications?: boolean
      webhookUrl?: string
      autoScaleCluster?: boolean
    }) {
      if (payload.name !== undefined) name.value = payload.name
      if (payload.email !== undefined) email.value = payload.email
      if (payload.company !== undefined) company.value = payload.company
      if (payload.role !== undefined) role.value = payload.role
      if (payload.currency !== undefined) currency.value = payload.currency
      if (payload.twoFactorEnabled !== undefined) twoFactorEnabled.value = payload.twoFactorEnabled
      if (payload.emailNotifications !== undefined) emailNotifications.value = payload.emailNotifications
      if (payload.webhookUrl !== undefined) webhookUrl.value = payload.webhookUrl
      if (payload.autoScaleCluster !== undefined) autoScaleCluster.value = payload.autoScaleCluster
    }

    function resetSettings() {
      name.value = 'Aitzaz Hassan'
      email.value = 'aitzazhassan16454@gmail.com'
      company.value = 'Nexus Technologies'
      role.value = 'Founder & Lead Architect'
      currency.value = 'USD'
      twoFactorEnabled.value = true
      emailNotifications.value = true
      webhookUrl.value = 'https://api.nexus-cloud.io/v1/webhooks/live_ledger'
      autoScaleCluster.value = true
    }

    return {
      name,
      email,
      company,
      role,
      currency,
      twoFactorEnabled,
      emailNotifications,
      webhookUrl,
      autoScaleCluster,
      updateSettings,
      resetSettings,
    }
  },
  {
    persist: true,
  }
)
