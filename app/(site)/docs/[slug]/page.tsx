import { docsLinks } from '@/constants/docs'
import { notFound } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const exists = docsLinks.some((item) => item.slug === slug)
  if (!exists) return notFound()

  return <div>My Post: {slug}</div>
}
