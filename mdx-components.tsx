import type { MDXComponents } from 'mdx/types'
import { cn } from '@/lib/utils'

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
} satisfies MDXComponents

export function useMDXComponents(): MDXComponents {
  return components
}
