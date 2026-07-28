import type { ComponentType } from 'react'

export interface BlogMetadata {
  slug: string
  title: string
  description: string
  authors: string[]
  publishedAt: string
  image: string
}

export interface BlogPost extends BlogMetadata {
  component: ComponentType
}
