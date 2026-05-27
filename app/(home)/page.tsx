import { Icon } from "../_components/icon"
import { getAllPosts } from "../_lib/blog"
import { Posts } from "./posts"

const EXTERNAL_LINKS = [
  { href: "https://www.linkedin.com/in/tifandotme", label: "LinkedIn" },
  { href: "https://github.com/tifandotme", label: "GitHub" },
  { href: "https://x.com/tifandotme", label: "X" },
] as const

export default async function HomePage() {
  const posts = await getAllPosts()

  return (
    <>
      <article className="container-md mb-20 space-y-5 text-[105%]">
        <h1 className="font-heading text-4xl tracking-wide">
          Tifan Dwi Avianto
        </h1>
        <p>
          I love building <em>polished</em> user interfaces and <em>elegant</em>{" "}
          software systems. I share lessons from my learning experiences to help
          fellow developers level up.
        </p>
        <ul className="flex flex-wrap gap-3" aria-label="External links">
          {EXTERNAL_LINKS.map((link) => (
            <li key={link.href}>
              <a
                className="-my-1.5 inline-flex min-w-9 items-center gap-px py-1.5 text-muted hover:underline hover:underline-offset-1"
                href={link.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {link.label}
                <Icon id="external" className="size-4 text-muted-darker/80" />
              </a>
            </li>
          ))}
        </ul>
      </article>

      <Posts posts={posts} />
    </>
  )
}
