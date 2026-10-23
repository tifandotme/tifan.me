import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { expect, test } from "vite-plus/test"
import { CopyButton } from "../app/_lib/mdx/copy"

test("copy button accepts Tailwind overrides without losing variants", () => {
  const html = renderToStaticMarkup(
    createElement(CopyButton, {
      source: "const answer = 42",
      lang: "ts",
      className: "right-3 text-foreground text-sm",
    }),
  )
  const classes = html.match(/<button[^>]*class="([^"]*)"/)?.[1]?.split(" ")
  expect(classes).toContain("right-3")
  expect(classes).not.toContain("right-0")
  expect(classes).toContain("text-foreground")
  expect(classes).not.toContain("text-muted-darker")
  expect(classes).toContain("text-sm")
  expect(classes).toContain("data-[copied=false]:hover:text-foreground")
  expect(classes).toContain("md:hidden")
})
