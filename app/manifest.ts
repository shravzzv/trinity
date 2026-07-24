import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Trinity',
    short_name: 'Trinity',
    description:
      'A simple, offline-first intermittent fasting tracker focused on consistency, progress, and data ownership.',
    start_url: '/home',
    display: 'standalone',
    background_color: '#10131A',
    theme_color: '#10131A',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/streak-dialog-dark.webp',
        form_factor: 'wide',
        label: 'Desktop view showing the home page',
        sizes: '560x715',
      },
      {
        src: '/screenshots/anchors-dialog-dark.webp',
        form_factor: 'wide',
        label: 'Desktop view showing the home page',
        sizes: '560x633',
      },
      {
        src: '/screenshots/fasting-plans-dark.webp',
        form_factor: 'wide',
        label: 'Desktop view showing the home page',
        sizes: '560x675',
      },
      {
        src: '/screenshots/fasting-statistics-dark.webp',
        form_factor: 'wide',
        label: 'Desktop view showing the home page',
        sizes: '705x638',
      },
      {
        src: '/screenshots/weight-statistics-dark.webp',
        form_factor: 'wide',
        label: 'Desktop view showing the home page',
        sizes: '705x638',
      },
      {
        src: '/screenshots/hero-banner-mobile-dark.webp',
        form_factor: 'narrow',
        label: 'Mobile view showing the home page in dark mode',
        sizes: '705x638',
      },
      {
        src: '/screenshots/hero-banner-mobile-light.webp',
        form_factor: 'narrow',
        label: 'Mobile view showing the home page in light mode',
        sizes: '705x638',
      },
    ],
  }
}
