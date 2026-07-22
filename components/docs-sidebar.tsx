'use client'

import Link from 'next/link'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar'
import { docsLinks } from '@/constants/docs'
import { usePathname } from 'next/navigation'

export default function DocsSidebar() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar className='sticky top-16 h-[calc(100svh-4rem)]' variant='floating'>
      <SidebarHeader>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/docs'}
                onClick={() => setOpenMobile(false)}
              >
                <Link href='/docs' className='text-xl font-semibold'>
                  Trinity Docs
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {docsLinks.map((link) => {
              const isActive = pathname.startsWith(link.href)

              return (
                <SidebarMenuItem key={link.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    onClick={() => setOpenMobile(false)}
                  >
                    <Link href={link.href}>
                      <span>{link.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
