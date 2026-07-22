import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

const links = [
  { href: '#introduction', name: 'Introduction' },
  { href: '#introduction3', name: 'What is trinity?' },
  {
    href: '#introduction2',
    name: 'Could there be really long lines in this component?',
  },
  { href: '#other', name: 'Other' },
  { href: '#other2', name: 'Other link' },
]

export default function DocsTOC() {
  return (
    <aside className='lg:sticky lg:top-16 lg:w-64 lg:px-4 lg:py-1'>
      <Card className='rounded-2xl border-0 shadow-none ring-transparent lg:border lg:shadow-lg dark:border-0 dark:shadow-none dark:ring-transparent'>
        <CardHeader className='hidden lg:block'>
          <CardTitle>On this page</CardTitle>
        </CardHeader>

        <CardContent className='max-h-[calc(100svh-12rem)] overflow-y-auto'>
          <nav className='flex flex-col gap-2'>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='block rounded-md text-sm hover:font-medium hover:underline'
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </CardContent>
      </Card>
    </aside>
  )
}
