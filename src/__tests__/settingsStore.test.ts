import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSettingsStore } from '@/stores/settingsStore'

describe('settingsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('loads default values properly', () => {
    const store = useSettingsStore()
    expect(store.name).toBe('Aitzaz Hassan')
    expect(store.currency).toBe('USD')
    expect(store.twoFactorEnabled).toBe(true)
  })

  it('updates settings partially', () => {
    const store = useSettingsStore()
    store.updateSettings({
      currency: 'EUR',
      twoFactorEnabled: false,
    })

    expect(store.currency).toBe('EUR')
    expect(store.twoFactorEnabled).toBe(false)
    // Preserves other values
    expect(store.name).toBe('Aitzaz Hassan')
  })

  it('resets settings to default', () => {
    const store = useSettingsStore()
    store.updateSettings({
      name: 'Custom Admin',
      currency: 'GBP',
    })

    store.resetSettings()
    expect(store.name).toBe('Aitzaz Hassan')
    expect(store.currency).toBe('USD')
  })
})
