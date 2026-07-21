import DocsContent from '@/components/docs-content'
import DocsSidebar from '@/components/docs-sidebar'
import DocsTOC from '@/components/docs-toc'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <DocsSidebar />
      <DocsContent>{children}</DocsContent>
      <DocsTOC />
    </>
  )
}
