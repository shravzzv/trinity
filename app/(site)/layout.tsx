import SiteNavbar from '@/components/site-navbar'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <SiteNavbar />
      <main className='p-6'>{children}</main>
    </>
  )
}
