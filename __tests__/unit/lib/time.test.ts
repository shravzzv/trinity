import { formatHours } from '@/lib/time'

describe('formatHours', () => {
  it('should format a singular hour', () => {
    expect(formatHours(1)).toBe('1 hour')
  })

  it('should format plural hours', () => {
    expect(formatHours(16)).toBe('16 hours')
  })
})
