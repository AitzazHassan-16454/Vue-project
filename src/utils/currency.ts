export type CurrencyCode = 'USD' | 'EUR' | 'GBP'

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
}

/**
 * Format a numeric amount into a localized currency string.
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'USD',
  options: {
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    compact?: boolean
  } = {}
): string {
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    compact = false,
  } = options

  if (compact) {
    const symbol = CURRENCY_SYMBOLS[currency] || '$'
    const abs = Math.abs(amount)
    if (abs >= 1_000_000) {
      return `${symbol}${(amount / 1_000_000).toFixed(1)}M`
    }
    if (abs >= 1_000) {
      return `${symbol}${(amount / 1_000).toFixed(1)}k`
    }
    return `${symbol}${amount.toFixed(0)}`
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)
}

export function getCurrencySymbol(currency: CurrencyCode = 'USD'): string {
  return CURRENCY_SYMBOLS[currency] || '$'
}
