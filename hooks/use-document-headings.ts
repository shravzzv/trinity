'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export interface Heading {
  id: string
  name: string
  level: number
}

const HEADING_SELECTOR =
  'article h1, article h2, article h3, article h4, article h5, article h6'

export function useDocumentHeadings() {
  const pathname = usePathname()

  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    ;(() => {
      setHeadings([])
      setActiveId('')
    })()

    let observer: IntersectionObserver | undefined

    const frame = requestAnimationFrame(() => {
      const elements = Array.from(
        document.querySelectorAll<HTMLElement>(HEADING_SELECTOR),
      ).filter((element) => element.id)

      setHeadings(
        elements.map((element) => ({
          id: element.id,
          name: element.textContent?.trim() ?? '',
          level: Number(element.tagName.slice(1)),
        })),
      )

      observer = new IntersectionObserver(
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

      elements.forEach((element) => observer?.observe(element))
    })

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [pathname])

  return {
    headings,
    activeId,
  }
}
