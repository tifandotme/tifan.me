import type { EvaluateOptions } from "@mdx-js/mdx"
import rehypeShiki, { type RehypeShikiOptions } from "@shikijs/rehype"
import { transformerMetaHighlight } from "@shikijs/transformers"
import rehypeAutolinkHeadings, {
  type Options as AutolinkHeadingsOptions,
} from "rehype-autolink-headings"
import rehypeExternalLinks, {
  type Options as ExternalLinksOptions,
} from "rehype-external-links"
import rehypeSlug from "rehype-slug"
import remarkGfm, { type Options as RemarkGfmOptions } from "remark-gfm"
import type { ShikiTransformer } from "shiki"

/**
 * Add source code data to `pre` elements
 * @see `./components.tsx` and `./copy.tsx`
 */
function transformerCopyButton(): ShikiTransformer {
  return {
    root() {
      this.pre.properties["source"] = this.source
        .split("\n")
        // remove transformer notations
        .map((line) => line.replace(/\s*\/\/\s*\[!.*?\]\s*$/, ""))
        .join("\n")
    },
  }
}

/**
 * Add language label data to `pre` elements
 */
function transformerLanguageLabel(): ShikiTransformer {
  return {
    root() {
      this.pre.properties["lang"] = this.options.lang
    },
  }
}

type MDXOptions = Pick<
  EvaluateOptions,
  "remarkPlugins" | "rehypePlugins" | "recmaPlugins"
>

export const mdxOptions: MDXOptions = {
  remarkPlugins: [[remarkGfm, {} satisfies RemarkGfmOptions]],
  rehypePlugins: [
    [
      rehypeShiki,
      {
        themes: {
          light: "github-light-default",
          dark: "github-dark-default",
        },
        // transformers: https://shiki.style/packages/transformers
        // if want to add line numbers: https://github.com/shikijs/shiki/issues/3#issuecomment-830564854
        transformers: [
          {
            preprocess() {
              this.options.tabindex = false
            },
          },
          transformerMetaHighlight(),
          transformerCopyButton(),
          transformerLanguageLabel(),
        ],

        defaultColor: false,
      } satisfies RehypeShikiOptions,
    ],
    [rehypeSlug], // must be before autolink headings
    [
      rehypeAutolinkHeadings,
      {
        behavior: "wrap",
        properties: {
          className: [
            // discard prose-a styles
            "font-inherit text-inherit no-underline",

            "-ml-[1em] pl-[1em] before:absolute before:-ml-[1em] before:font-mono before:font-extralight before:text-transparent md:before:content-['#'] hover:before:text-muted-darker",
          ],
          tabIndex: -1,
        },
      } satisfies AutolinkHeadingsOptions,
    ],
    [
      rehypeExternalLinks,
      {
        content: {
          type: "element",
          tagName: "svg",
          properties: {
            className: "inline ml-px size-4 text-muted-darker/80",
          },
          children: [
            {
              type: "element",
              tagName: "use",
              properties: {
                href: "/sprite.svg#external",
              },
              children: [],
            },
          ],
        },
        contentProperties: {
          className: "print:hidden",
          "aria-hidden": true,
        },
        target: "_blank",
        rel: ["nofollow", "noopener"],
      } satisfies ExternalLinksOptions,
    ],
  ],
}
