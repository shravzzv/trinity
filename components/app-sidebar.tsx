'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { Home, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Kbd } from './ui/kbd'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const links = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { open } = useSidebar()

  return (
    <Sidebar variant='floating' collapsible='icon'>
      <SidebarHeader className='gap-2'>
        <div
          className={cn(
            open ? 'px-2' : 'px-1',
            'flex items-center justify-between py-2',
          )}
        >
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

          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger />
            </TooltipTrigger>
            <TooltipContent>
              Toggle sidebar
              <Kbd>Ctrl + B</Kbd>
            </TooltipContent>
          </Tooltip>
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
                    // className={cn(isActive && 'bg-primary/20!')}
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
    </Sidebar>
  )
}
