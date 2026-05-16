import { evaluate } from "@mdx-js/mdx"
import fs from "node:fs"
import path from "node:path"
import React from "react"
import * as devJsx from "react/jsx-dev-runtime"
import * as prodJsx from "react/jsx-runtime"
import { VFile } from "vfile"
import { matter } from "vfile-matter"
import { components } from "./mdx/components"
import { mdxOptions } from "./mdx/options"
import { slugify } from "./utils"

const development = process.env.NODE_ENV !== "production"

const runtime = development
  ? {
      Fragment: devJsx.Fragment,
      jsxDEV: devJsx.jsxDEV,
      development: true as const,
    }
  : {
      Fragment: prodJsx.Fragment,
      jsx: prodJsx.jsx,
      jsxs: prodJsx.jsxs,
      development: false as const,
    }

/**
 * Extract headings from a raw MDX source.
 */
function extractHeadings(source: string) {
  const lines = source.split("\n")

  let isInsideCodeBlock = false
  const matches = lines.filter((line) => {
    if (line.startsWith("```")) isInsideCodeBlock = !isInsideCodeBlock
    if (isInsideCodeBlock) return false
    return /^\s*##\s.*/.test(line)
  })

  return matches.map((line) => {
    const text = line.replace(/^(\s*##\s*)/, "")
    return {
      text,
      slug: slugify(text),
    }
  })
}

/**
 * Return paths to all MDX files in a directory and its subdirectories.
 */
function findMDXFiles(dir: string): string[] {
  const contentPath = path.join(process.cwd(), dir)

  try {
    if (!fs.existsSync(contentPath)) {
      return []
    }

    return fs
      .readdirSync(contentPath, {
        recursive: true,
        encoding: "utf-8",
      })
      .filter(
        (file) =>
          path.extname(file) === ".mdx" &&
          !file.split("/").pop()!.startsWith("_"),
      )
      .map((file) => path.join(dir, file))
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error)
    return []
  }
}

/**
 * Parse an MDX file and return its frontmatter, content, and headings.
 */
async function parseMDXFile(file: string) {
  const source = fs.readFileSync(path.join(process.cwd(), file), "utf-8")

  const headings = extractHeadings(source)

  const vfile = new VFile(source)
  matter(vfile, { strip: true })
  const frontmatter = (vfile.data["matter"] ?? {}) as Frontmatter

  const { default: MDXContent } = await evaluate(vfile, {
    ...mdxOptions,
    ...runtime,
  })

  const content = React.createElement(MDXContent, { components })

  return { frontmatter, content, headings }
}

export async function getAllPosts() {
  const files = findMDXFiles("content")

  return Promise.all(
    files.map(async (file) => {
      const { frontmatter, content, headings } = await parseMDXFile(file)
      const slug = slugify(
        file
          .split("/")
          .pop()!
          .replace(/\.mdx$/, ""),
      )

      await validate(frontmatter, file)

      return {
        ...frontmatter,
        content,
        headings,
        slug,
        url: "/blog/" + slug,
      }
    }),
  ).then((posts) =>
    posts.sort((a, b) => Intl.Collator().compare(b.publishedAt, a.publishedAt)),
  )
}

export async function getPostBySlug(slug: string) {
  return getAllPosts().then((posts) => posts.find((post) => post.slug === slug))
}

/* ========================== SCHEMA AND VALIDAION ========================== */

type Frontmatter = {
  title: string
  description: string
  /**
   * Format: `YYYY-MM-DD`
   */
  publishedAt: `${number}-${number}-${number}`
  lang: "en" | "id"
}

/**
 * Validate frontmatter properties of a blog post. Throws an error if a required
 * property is missing or invalid.
 * @param frontmatter - frontmatter object compiled from MDX file.
 * @param file - path to the MDX file. Used for error message.
 */
async function validate(frontmatter: Frontmatter, file: string) {
  const requiredProperties: (keyof Frontmatter)[] = [
    "title",
    "description",
    "publishedAt",
    "lang",
  ]

  for (const prop of requiredProperties) {
    if (!frontmatter[prop]) {
      throw new Error(`Missing frontmatter property: ${prop} in ${file}`)
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(frontmatter.publishedAt)) {
    throw new Error(
      `Invalid date format for publishedAt in ${file}. Expected YYYY-MM-DD`,
    )
  }

  if (isNaN(new Date(frontmatter.publishedAt).getTime())) {
    throw new Error(`Invalid date value for publishedAt in ${file}`)
  }

  if (!["en", "id"].includes(frontmatter.lang)) {
    throw new Error(
      `Invalid language '${frontmatter.lang}' in ${file}. Expected 'en' or 'id'`,
    )
  }
}
