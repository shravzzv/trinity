import {
  formatDuration,
  copyTime,
  replaceTime,
  replaceTimeFromInputValue,
  formatRelativeDay,
} from '@/lib/time'

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

describe('replaceTime', () => {
  it('should replace the time components of a date', () => {
    const date = new Date(2026, 5, 20, 10, 30, 45)
    const result = replaceTime(date, 18, 0, 0)

    expect(result).toEqual(new Date(2026, 5, 20, 18, 0, 0))
  })

  it('should not mutate the original date', () => {
    const original = new Date(2026, 5, 20, 10, 30, 45)
    replaceTime(original, 18, 0, 0)

    expect(original).toEqual(new Date(2026, 5, 20, 10, 30, 45))
  })
})

describe('replaceTimeFromInputValue', () => {
  it('should replace the time from a HH:mm input value', () => {
    const date = new Date(2026, 5, 20, 10, 30, 45)
    const result = replaceTimeFromInputValue(date, '18:15')

    expect(result).toEqual(new Date(2026, 5, 20, 18, 15, 0))
  })

  it('should replace the time from a HH:mm:ss input value', () => {
    const date = new Date(2026, 5, 20, 10, 30, 45)
    const result = replaceTimeFromInputValue(date, '18:15:30')

    expect(result).toEqual(new Date(2026, 5, 20, 18, 15, 30))
  })

  it('should not mutate the original date', () => {
    const original = new Date(2026, 5, 20, 10, 30, 45)
    replaceTimeFromInputValue(original, '18:15')

    expect(original).toEqual(new Date(2026, 5, 20, 10, 30, 45))
  })
})

describe('copyTime', () => {
  it('should copy the time from the source date', () => {
    const targetDate = new Date(2026, 5, 20, 0, 0, 0)
    const sourceDate = new Date(2026, 5, 22, 18, 15, 30)

    const result = copyTime(targetDate, sourceDate)

    expect(result).toEqual(new Date(2026, 5, 20, 18, 15, 30))
  })

  it('should preserve the target date components', () => {
    const targetDate = new Date(2026, 5, 20, 0, 0, 0)
    const sourceDate = new Date(2030, 0, 1, 18, 15, 30)

    const result = copyTime(targetDate, sourceDate)

    expect(result.getFullYear()).toBe(2026)
    expect(result.getMonth()).toBe(5)
    expect(result.getDate()).toBe(20)
  })

  it('should not mutate the target date', () => {
    const targetDate = new Date(2026, 5, 20, 0, 0, 0)
    const sourceDate = new Date(2026, 5, 22, 18, 15, 30)

    copyTime(targetDate, sourceDate)

    expect(targetDate).toEqual(new Date(2026, 5, 20, 0, 0, 0))
  })

  it('should not mutate the source date', () => {
    const targetDate = new Date(2026, 5, 20, 0, 0, 0)
    const sourceDate = new Date(2026, 5, 22, 18, 15, 30)

    copyTime(targetDate, sourceDate)

    expect(sourceDate).toEqual(new Date(2026, 5, 22, 18, 15, 30))
  })
})

describe('formatRelativeDay', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-15T12:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('returns today for the current day', () => {
    expect(formatRelativeDay(new Date('2026-01-15T12:00:00Z'))).toBe('today')
  })

  it('returns tomorrow for the next calendar day', () => {
    expect(formatRelativeDay(new Date('2026-01-16T00:00:00Z'))).toBe('tomorrow')
  })

  it('returns yesterday for the previous calendar day', () => {
    expect(formatRelativeDay(new Date('2026-01-14T12:00:00Z'))).toBe(
      'yesterday',
    )
  })

  it('returns "in x days" for future dates', () => {
    expect(formatRelativeDay(new Date('2026-01-18T12:00:00Z'))).toBe(
      'in 3 days',
    )
  })

  it('returns "x days ago" for past dates', () => {
    expect(formatRelativeDay(new Date('2026-01-12T12:00:00Z'))).toBe(
      '3 days ago',
    )
  })
})
