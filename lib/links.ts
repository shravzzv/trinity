/**
 * Utility functions for working with application URLs and links.
 *
 * This module provides helpers for constructing and resolving
 * internal and external URLs in a consistent, environment-aware
 * manner across the application.
 */

/**
 * Resolves the absolute base URL for the application.
 * The function determines the URL based on the following priority:
 * 1. `NEXT_PUBLIC_SITE_URL` environment variable (Production/Manual override)
 * 2. `NEXT_PUBLIC_VERCEL_URL` environment variable (Automatically set by Vercel for previews)
 * 3. Default to `http://localhost:3000/` for local development
 *
 * @example
 * // If NEXT_PUBLIC_SITE_URL is "myapp.com"
 * const url = getSiteURL(); // returns "https://myapp.com/"
 */
export const getSiteURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.VERCEL_URL ??
    'http://localhost:3000/'

  url = url.startsWith('http') ? url : `https://${url}`
  url = url.endsWith('/') ? url : `${url}/`

  return url
}
