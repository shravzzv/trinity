import { getSiteURL } from '@/lib/links'

describe('getSiteURL', () => {
  const originalSiteURL = process.env.NEXT_PUBLIC_SITE_URL
  const originalVercelURL = process.env.NEXT_PUBLIC_VERCEL_URL

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    delete process.env.NEXT_PUBLIC_VERCEL_URL
  })

  afterAll(() => {
    process.env.NEXT_PUBLIC_SITE_URL = originalSiteURL
    process.env.NEXT_PUBLIC_VERCEL_URL = originalVercelURL
  })

  it('uses NEXT_PUBLIC_SITE_URL when defined', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://trinity.app'

    expect(getSiteURL()).toBe('https://trinity.app/')
  })

  it('falls back to NEXT_PUBLIC_VERCEL_URL', () => {
    process.env.NEXT_PUBLIC_VERCEL_URL = 'trinity.vercel.app'

    expect(getSiteURL()).toBe('https://trinity.vercel.app/')
  })

  it('falls back to localhost when no environment variables are set', () => {
    expect(getSiteURL()).toBe('http://localhost:3000/')
  })

  it('adds https:// when the URL has no protocol', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'example.com'

    expect(getSiteURL()).toBe('https://example.com/')
  })

  it('preserves an existing http:// protocol', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'http://example.com'

    expect(getSiteURL()).toBe('http://example.com/')
  })

  it('preserves an existing https:// protocol', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com'

    expect(getSiteURL()).toBe('https://example.com/')
  })

  it('adds a trailing slash when missing', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com'

    expect(getSiteURL()).toBe('https://example.com/')
  })

  it('does not duplicate a trailing slash', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com/'

    expect(getSiteURL()).toBe('https://example.com/')
  })
})
