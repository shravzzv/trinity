import { SidebarTrigger } from './ui/sidebar'

interface DocsContentProps {
  children: React.ReactNode
}

export default function DocsContent({ children }: DocsContentProps) {
  return (
    <section className='mx-auto max-w-4xl px-2'>
      <div className='bg-background sticky top-16 py-2 md:hidden'>
        <SidebarTrigger size='icon-lg' />
      </div>

      <article className='prose prose-neutral dark:prose-invert prose-pre:rounded-xl prose-pre:border max-w-none md:py-8'>
        {children}
      </article>
    </section>
  )
}
