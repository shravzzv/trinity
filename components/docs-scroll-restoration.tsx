'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function DocsScrollRestoration() {
  const pathname = usePathname()
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    window.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [pathname])

  return null
}
