import { docs } from '@/constants/docs'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface DocsPagerProps {
  slug: string
}

export default function DocsPager({ slug }: DocsPagerProps) {
  const index = docs.findIndex((doc) => doc.slug === slug)
  const previous = docs[index - 1]
  const next = docs[index + 1]

  return (
    <nav className='mt-16 flex justify-between gap-4 border-t pt-8'>
      {previous && (
        <Link
          href={previous.href}
          className='flex items-center gap-2 underline-offset-2'
        >
          <ArrowLeft className='size-5' />
          <span>{previous.title}</span>
        </Link>
      )}

      {next && (
        <Link
          href={next.href}
          className='flex items-center gap-2 underline-offset-2'
        >
          <span>{next.title}</span>
          <ArrowRight className='size-5' />
        </Link>
      )}
    </nav>
  )
}
