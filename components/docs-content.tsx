interface DocsContentProps {
  children: React.ReactNode
}

export default function DocsContent({ children }: DocsContentProps) {
  return (
    <article className='prose prose-neutral dark:prose-invert prose-pre:rounded-xl prose-pre:border max-w-none'>
      {children}
    </article>
  )
}
