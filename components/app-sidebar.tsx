'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { Home, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { open } = useSidebar()

  return (
    <Sidebar variant='inset' collapsible='icon'>
      <SidebarHeader className='gap-2'>
        <div className='flex items-center justify-between py-2'>
          {open && (
            <div className='flex items-center gap-2'>
              <Image
                src='/icons/icon-512x512.png'
                alt='Trinity'
                width={32}
                height={32}
                className='rounded-lg'
              />

              <span className='font-semibold'>Trinity</span>
            </div>
          )}

          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {links.map((link) => {
              const isActive = pathname.startsWith(link.href)

              return (
                <SidebarMenuItem key={link.name}>
                  <SidebarMenuButton
                    asChild
                    tooltip={link.name}
                    isActive={isActive}
                    className={cn(isActive && 'bg-primary/20!')}
                  >
                    <Link href={link.href}>
                      <link.icon />
                      <span>{link.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
