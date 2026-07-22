import DocsContent from '@/components/docs-content'
import DocsSidebar from '@/components/docs-sidebar'
import DocsTOC from '@/components/docs-toc'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <DocsSidebar />
      <DocsContent>{children}</DocsContent>
      <aside className='hidden lg:block'>
        <DocsTOC />
      </aside>
    </SidebarProvider>
  )
}
