import type { MDXComponents } from 'mdx/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const components: MDXComponents = {
  h2: ({ className, ...props }) => (
    <h2 className={cn('scroll-mt-32', className)} {...props} />
  ),

  h3: ({ className, ...props }) => (
    <h3 className={cn('scroll-mt-32', className)} {...props} />
  ),

  h4: ({ className, ...props }) => (
    <h4 className={cn('scroll-mt-32', className)} {...props} />
  ),

  h5: ({ className, ...props }) => (
    <h5 className={cn('scroll-mt-32', className)} {...props} />
  ),

  h6: ({ className, ...props }) => (
    <h6 className={cn('scroll-mt-32', className)} {...props} />
  ),

  a: ({ href = '', ...props }) => {
    const isInternal = href.startsWith('/') || href.startsWith('#')
    if (isInternal) return <Link href={href} {...props} />

    return (
      <a href={href} target='_blank' rel='noopener noreferrer' {...props} />
    )
  },
} satisfies MDXComponents

export function useMDXComponents(): MDXComponents {
  return components
}
