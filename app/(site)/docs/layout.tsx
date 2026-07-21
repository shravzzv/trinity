export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <article className='prose prose-neutral dark:prose-invert prose-pre:rounded-xl prose-pre:border max-w-none'>
      {children}
    </article>
  )
}
