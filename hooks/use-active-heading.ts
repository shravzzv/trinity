'use client'

import { useEffect, useState } from 'react'

export function useActiveHeading() {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const headings = document.querySelectorAll<HTMLElement>(
      'h1, h2, h3, h4, h5, h6',
    )
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      {
        rootMargin: '0px 0px -70% 0px',
      },
    )

    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  return activeId
}
