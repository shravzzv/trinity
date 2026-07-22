import { docs } from '@/constants/docs'
import { notFound } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const Doc = docs[slug as keyof typeof docs]

  if (!Doc) return notFound()

  return <Doc />
}
