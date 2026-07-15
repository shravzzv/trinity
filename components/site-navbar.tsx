import { siteLinks } from '@/constants/navigation'
import Link from 'next/link'

export default function SiteNavbar() {
  return (
    <nav>
      <Link href='/'>Trinity</Link>

      <div>
        {siteLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.name}
          </Link>
        ))}
      </div>

      <div>
        <Link href='/signin'>Sign in</Link>
        <Link href='/home'>Get started</Link>
      </div>
    </nav>
  )
}
