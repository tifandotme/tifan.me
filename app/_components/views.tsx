"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "../_lib/utils"
import { Icon } from "./icon"
import { fetchViews } from "./redis"

interface ViewsProps extends React.HTMLAttributes<HTMLSpanElement> {
  slug: string
  increment?: boolean
}

export function Views({
  slug,
  increment = false,
  className,
  ...props
}: ViewsProps) {
  const [views, setViews] = useState<number | null | undefined>(undefined)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const cachedViews = sessionStorage.getItem("views-" + slug)
    if (cachedViews !== null) {
      if (increment) {
        setViews(Number(cachedViews) + 1)
      } else {
        setViews(Number(cachedViews))
        return
      }
    }

    fetchViews(slug, increment).then((next) => {
      setViews(next)
      if (next !== null) {
        sessionStorage.setItem("views-" + slug, String(next))
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!views || !increment) return
    ref.current?.animate(
      {
        filter: "brightness(140%)",
        offset: 0.1,
      },
      {
        duration: 1200,
        easing: "ease-in-out",
        iterations: 1,
      },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [views])

  // in the unlikely event that a fetch to Upstash fails, do not render anything
  if (views === null) return null

  return (
    <span
      className={cn(
        "relative inline-flex items-center align-middle leading-none print:hidden",
        className,
      )}
      title="Views"
      {...props}
    >
      <Icon id="eye-open" className="absolute left-0 size-[1em]" />
      {views === undefined ? (
        <LoadingDots className="ml-[1.5em]" />
      ) : (
        <span className="ml-[1.3em]" ref={ref}>
          {views}
        </span>
      )}
    </span>
  )
}

function LoadingDots({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center [--loading-dots-size:4px]",
        className,
      )}
      {...props}
    >
      <span className="mx-px inline-block size-[var(--loading-dots-size)] animate-[opacity-pulse_0.7s_ease-in-out_infinite] rounded-full bg-current" />
      <span className="mx-px inline-block size-[var(--loading-dots-size)] animate-[opacity-pulse_0.7s_ease-in-out_0.2s_infinite] rounded-full bg-current" />
      <span className="mx-px inline-block size-[var(--loading-dots-size)] animate-[opacity-pulse_0.7s_ease-in-out_0.4s_infinite] rounded-full bg-current" />
    </span>
  )
}
