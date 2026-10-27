import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

describe('ConfirmModal.vue', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('does not render dialog content when isOpen is false', () => {
    const wrapper = mount(ConfirmModal, {
      props: {
        isOpen: false,
        title: 'Delete Item',
        message: 'Are you sure?',
      },
      attachTo: document.body,
    })
    expect(document.body.querySelector('[role="dialog"]')).toBeNull()
    wrapper.unmount()
  })

  it('renders modal content and triggers confirm when clicked', async () => {
    const wrapper = mount(ConfirmModal, {
      props: {
        isOpen: true,
        title: 'Delete Item',
        message: 'Are you sure?',
        confirmText: 'Yes, Delete',
      },
      attachTo: document.body,
    })

    const dialog = document.body.querySelector('[role="dialog"]')
    expect(dialog).not.toBeNull()
    expect(document.body.textContent).toContain('Delete Item')
    expect(document.body.textContent).toContain('Are you sure?')

    const buttons = Array.from(document.body.querySelectorAll('button'))
    const confirmBtn = buttons.find((b) => b.textContent?.includes('Yes, Delete'))
    expect(confirmBtn).toBeDefined()
    confirmBtn?.click()

    expect(wrapper.emitted('confirm')).toBeTruthy()
    wrapper.unmount()
  })

  it('emits close event when close button or cancel button is clicked', async () => {
    const wrapper = mount(ConfirmModal, {
      props: {
        isOpen: true,
        title: 'Warning Dialog',
        message: 'Confirm action',
        cancelText: 'Abort',
      },
      attachTo: document.body,
    })

    const buttons = Array.from(document.body.querySelectorAll('button'))
    const cancelBtn = buttons.find((b) => b.textContent?.includes('Abort'))
    expect(cancelBtn).toBeDefined()
    cancelBtn?.click()

    expect(wrapper.emitted('close')).toBeTruthy()
    wrapper.unmount()
  })
})
