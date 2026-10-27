import { describe, it, expect } from 'vitest'
import { formatCurrency, getCurrencySymbol } from '@/utils/currency'

describe('currency utility', () => {
  it('formats standard USD values correctly', () => {
    expect(formatCurrency(14200, 'USD')).toBe('$14,200.00')
    expect(formatCurrency(48.5, 'USD')).toBe('$48.50')
  })

  it('formats EUR and GBP correctly', () => {
    expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00')
    expect(formatCurrency(2500, 'GBP')).toBe('£2,500.00')
  })

  it('handles compact format', () => {
    expect(formatCurrency(15800, 'USD', { compact: true })).toBe('$15.8k')
    expect(formatCurrency(2400000, 'USD', { compact: true })).toBe('$2.4M')
    expect(formatCurrency(500, 'EUR', { compact: true })).toBe('€500')
  })

  it('returns appropriate currency symbol', () => {
    expect(getCurrencySymbol('USD')).toBe('$')
    expect(getCurrencySymbol('EUR')).toBe('€')
    expect(getCurrencySymbol('GBP')).toBe('£')
  })
})
