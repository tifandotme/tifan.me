import type { MDXRemoteProps } from "next-mdx-remote/rsc"
import Image from "next/image"
import React from "react"
import {
  EmbeddedTweet,
  TweetContainer,
  type TwitterComponents,
} from "react-tweet"
import { getTweet } from "react-tweet/api"
import {
  CloudinaryImage,
  type CloudinaryImageProps,
} from "../../_components/cloudinary-image"
import { cn } from "../utils"
import { CopyButton } from "./copy"
import { Sandpack } from "./sandpack"
import styles from "./tweet.module.css"

type MDXComponents = MDXRemoteProps["components"]

export const components: MDXComponents = {
  Image: ({
    full = false,
    caption,
    publicId,
    alt,
  }: { full: boolean; caption?: string } & Pick<
    CloudinaryImageProps,
    "publicId" | "alt"
  >) => {
    if (!publicId || !alt) {
      throw new Error("Image component requires publicId and alt props")
    }

    const fullProp = full ? { className: "col-span-full!" } : {}

    if (!caption) {
      return (
        <CloudinaryImage
          publicId={publicId}
          alt={alt}
          width={768}
          {...fullProp}
        />
      )
    }

    return (
      <figure {...fullProp}>
        <CloudinaryImage publicId={publicId} alt={alt} width={768} />
        <figcaption>{caption}</figcaption>
      </figure>
    )
  },
  /**
   * Renders an embedded tweet
   * @param props.id - Tweet ID to fetch and display
   * @returns Tweet component or null if fetch fails
   */
  Tweet: async ({ id }: { id: string }) => {
    try {
      const tweet = await getTweet(id)
      const tweetComponents: TwitterComponents = {
        AvatarImg: (props) => (
          <Image {...props} alt="Tweet Avatar" unoptimized />
        ),
        MediaImg: (props) => (
          <Image {...props} alt="Tweet Media" unoptimized fill />
        ),
      }

      return (
        <div className={cn("not-prose flex justify-center", styles["tweet"])}>
          {tweet ? (
            <EmbeddedTweet tweet={tweet} components={tweetComponents} />
          ) : (
            <TweetContainer className="flex flex-col items-center py-3">
              <p className="text-[1.0625rem]">Tweet not found</p>
            </TweetContainer>
          )}
        </div>
      )
    } catch (err) {
      console.error(err instanceof Error ? err.message : "An error occured")
      return null
    }
  },
  /**
   * Renders a Sandpack code editor instance
   * @param props - All props are passed directly to Sandpack component
   */
  Sandpack: (props: React.ComponentProps<typeof Sandpack>) => {
    return <Sandpack {...props} />
  },
  /**
   * Renders a lead paragraph with enhanced styling
   * @param props.children - Must be a paragraph element
   * @throws {Error} When children is not a paragraph element
   */
  Lead: ({ children }) => {
    if (children.type !== "p") {
      throw new Error("Lead component only accepts a paragraph as children")
    }

    return React.cloneElement(children, {
      className: cn("lead", children.props.className),
    })
  },
  /**
   * Makes child element span full width
   * @param props.children - React element to be full width
   */
  Full: ({ children }) => {
    if (!React.isValidElement<{ className?: string }>(children)) {
      return children
    }

    return React.cloneElement(children, {
      className: cn("col-span-full!", children.props.className) ?? "",
    })
  },
  pre: ({ source, lang, children, ...props }) => {
    return (
      // copy button is absolute positioned, so we need the parent to be relative
      // we also can't use `pre` as parent because the button somehow get scrolled horizontally
      // `group` is used to make sure the button is only visible when hovered
      <div className="pre-wrapper group relative">
        <CopyButton source={source} lang={lang} />
        <pre {...props}>{children}</pre>
      </div>
    )
  },
}
