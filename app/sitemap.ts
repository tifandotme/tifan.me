import type { MetadataRoute } from "next"
import { getAllPosts } from "./_lib/blog"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/about", "/projects"].map((route) => ({
    url: `https://tifan.me${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }))

  const posts = await getAllPosts().then((all) =>
    all.map((post) => ({
      url: post.url,
      lastModified: post.publishedAt,
    })),
  )

  return [...routes, ...posts]
}
