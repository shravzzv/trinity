import DocsPager from '@/components/docs-pager'
import { docs } from '@/constants/docs'
import { notFound } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const doc = docs.find((doc) => doc.slug === slug)
  if (!doc) return notFound()

  return (
    <>
      <doc.component />
      <DocsPager slug={slug} />
    </>
  )
}
