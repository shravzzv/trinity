import { formatDuration } from '@/lib/time'

describe('formatDuration', () => {
  it('should format zero milliseconds', () => {
    expect(formatDuration(0)).toBe('00:00:00')
  })

  it('should format seconds', () => {
    expect(formatDuration(5000)).toBe('00:00:05')
  })

  it('should format minutes and seconds', () => {
    expect(formatDuration(65_000)).toBe('00:01:05')
  })

  it('should format hours, minutes and seconds', () => {
    expect(formatDuration(3_661_000)).toBe('01:01:01')
  })

  it('should floor partial seconds', () => {
    expect(formatDuration(1_999)).toBe('00:00:01')
  })

  it('should clamp negative durations to zero', () => {
    expect(formatDuration(-1000)).toBe('00:00:00')
  })

  it('should support durations longer than 24 hours', () => {
    expect(formatDuration(90_061_000)).toBe('25:01:01')
  })
})
