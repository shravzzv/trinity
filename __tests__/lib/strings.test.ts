import { pluralize } from '@/lib/strings'

describe('pluralize', () => {
  it('should return the singular form when value is 1', () => {
    expect(pluralize(1, 'hour')).toBe('1 hour')
  })

  it('should return the plural form when value is greater than 1', () => {
    expect(pluralize(16, 'hour')).toBe('16 hours')
  })

  it('should return the plural form when value is 0', () => {
    expect(pluralize(0, 'hour')).toBe('0 hours')
  })

  it('should support custom plural forms', () => {
    expect(pluralize(1, 'person')).toBe('1 person')
    expect(pluralize(2, 'person', 'people')).toBe('2 people')
  })
})
