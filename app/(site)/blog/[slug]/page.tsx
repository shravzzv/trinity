import BlogContent from '@/components/blog-content'
import { blogPosts } from '@/constants/blog'
import { notFound } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const blog = blogPosts.find((post) => post.slug === slug)
  if (!blog) return notFound()

  const { component: Component, ...metadata } = blog

  return (
    <BlogContent blog={metadata}>
      <Component />
    </BlogContent>
  )
}
