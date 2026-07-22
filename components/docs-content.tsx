'use client'

import DocsTOC from './docs-toc'
import { SidebarTrigger } from './ui/sidebar'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'

interface DocsContentProps {
  children: React.ReactNode
}

export default function DocsContent({ children }: DocsContentProps) {
  const [open, setOpen] = useState(false)

  return (
    <section className='mx-auto max-w-4xl space-y-1 px-2 md:px-8'>
      <motion.div
        initial={{
          opacity: 0,
          y: -8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: -8,
        }}
        className='bg-background sticky top-16 flex items-center gap-2 py-2 lg:hidden'
      >
        <div className='md:hidden'>
          <SidebarTrigger size='icon-lg' />
        </div>

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant='outline'>On this page</Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className='max-h-[50svh] min-w-[70dvw] overflow-y-auto border-0 md:min-w-[50dvw]'>
            <DocsTOC onNavigate={() => setOpen(false)} />
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='prose prose-neutral dark:prose-invert prose-pre:rounded-xl prose-pre:border max-w-none md:py-8'
      >
        {children}
      </motion.article>
    </section>
  )
}
