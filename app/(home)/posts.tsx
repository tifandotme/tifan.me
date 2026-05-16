"use client"

import Link from "next/link"
import { useState, memo, useMemo } from "react"
import { Icon } from "../_components/icon"
import { Views } from "../_components/views"
import type { getAllPosts } from "../_lib/blog"
import { formatDateDynamic } from "../_lib/utils"

type Post = Awaited<ReturnType<typeof getAllPosts>>[number]

interface PostsProps {
  posts: Post[]
}

export const Posts = memo(function Posts({ posts }: PostsProps) {
  const [isEnglishOnly, setIsEnglishOnly] = useState<boolean | null>(null)

  const filteredPosts = useMemo(() => {
    if (isEnglishOnly === null || isEnglishOnly === false) return posts
    return posts.filter((post) => post.lang === "en")
  }, [posts, isEnglishOnly])

  if (posts.length === 0) {
    return null
  }

  return (
    <>
      <div className="no-js container-md mb-1">
        <button
          className="-mx-2 flex cursor-default items-center gap-1 px-2 py-2.5 text-muted hover:text-foreground"
          type="button"
          role="switch"
          aria-checked={isEnglishOnly ?? false}
          onClick={() => {
            setIsEnglishOnly((prev) => !prev)
          }}
          data-umami-event="English Only toggle"
        >
          <span
            className="relative inline-flex items-center justify-center"
            aria-hidden="true"
          >
            <Icon id="box" className="size-4" />
            {isEnglishOnly && <Icon id="check" className="absolute size-3.5" />}
          </span>
          English Only
        </button>
      </div>

      <ul className="container-md">
        {filteredPosts.map((post) => (
          <li key={post.slug} className="mb-2 last:mb-0">
            <Link
              className="relative -mx-4 flex flex-col gap-2 p-4 hover:bg-muted-darker/10 active:bg-muted-darker/10 sm:-mx-3 sm:p-3"
              href={post.url}
            >
              <div className="flex flex-col justify-between md:flex-row md:items-start md:gap-2">
                <h2 className="text-[105%] leading-7 font-semibold">
                  {post.title}
                </h2>
                <span className="inline-flex items-center gap-5 leading-7 text-muted-darker md:flex-row-reverse">
                  <time
                    className="whitespace-nowrap"
                    dateTime={post.publishedAt}
                  >
                    {formatDateDynamic(post.publishedAt)}
                  </time>
                  <Views className="no-js" slug={post.slug} />
                </span>
              </div>
              <p className="text-muted">
                <em>{post.description}</em>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
})
