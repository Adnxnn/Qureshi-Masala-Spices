export function toE164Phone(value: string): string | null {
  const compact = value.replace(/[\s().-]/g, '')
  const phone = /^\d{10}$/.test(compact) ? `+91${compact}` : compact
  return /^\+[1-9]\d{7,14}$/.test(phone) ? phone : null
}
