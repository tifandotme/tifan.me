"use client"

import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog"
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/react/drawer"
import { cn } from "cn"
import { useEffect, useState } from "react"
import { Icon } from "../../_components/icon"
import { useMediaQuery } from "../../_hooks/use-media-query"

interface TableOfContentsProps {
  headings: { text: string; slug: string }[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)", {
    initializeWithValue: false,
  })

  useEffect(() => {
    setIsOpen(false)
  }, [isDesktop])

  const triggerClass =
    "no-js -mx-1 inline-flex h-auto items-center justify-center gap-0 rounded-none border-0 bg-transparent px-4 py-3 text-base leading-none font-normal text-muted hover:bg-transparent hover:text-foreground"
  const backdropClass = "bg-black/50 dark:bg-black/70"
  const triggerLabel = (
    <>
      <Icon id="list" className="mr-2 size-5" />
      Table of Contents
    </>
  )
  const links = headings.map((heading) => (
    <li key={heading.slug}>
      <a
        className="flex cursor-default items-center px-3 py-2.5 leading-6 text-balance hover:bg-muted-darker/10 focus:bg-muted-darker/10 max-md:justify-center max-md:text-center"
        href={`#${heading.slug}`}
        onClick={() => setIsOpen(false)}
      >
        {heading.text}
      </a>
    </li>
  ))

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className={triggerClass}>{triggerLabel}</DialogTrigger>
        <DialogBackdrop
          className={cn(
            backdropClass,
            "motion-safe:data-open:animate-dialog-overlay-show",
          )}
        />
        <DialogContent className="w-[80vw] max-w-lg gap-7 rounded-none border-border bg-background p-6 text-base text-foreground shadow-lg motion-safe:data-open:animate-dialog-content-show">
          <DialogTitle className="text-lg leading-none font-bold tracking-tight">
            Table of Contents
          </DialogTitle>
          <ul className="-mx-3 overflow-y-auto">{links}</ul>
          <DialogClose className="absolute top-6 right-5 -m-2.5 size-auto rounded-full border-0 bg-transparent p-2.5 text-muted hover:bg-muted-darker/10">
            <Icon id="cross" className="size-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (open) setIsScrolled(false)
        setIsOpen(open)
      }}
    >
      <DrawerTrigger className={triggerClass}>{triggerLabel}</DrawerTrigger>
      <DrawerBackdrop className={backdropClass} />
      <DrawerContent
        initialFocus="content"
        className={cn(
          "max-h-[50dvh] max-w-none gap-0 rounded-t-3xl border-x-0 border-t-2 border-border bg-background p-0 pb-7 text-base text-foreground",
          isScrolled &&
            "border-muted-darker/90 bg-linear-to-t from-background from-80% to-muted-darker/50 dark:border-border dark:to-muted/10",
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "mx-auto my-3 h-1.5 w-[80px] shrink-0 rounded-full bg-muted-darker/30",
            isScrolled && "bg-background/50 dark:bg-muted-darker/50",
          )}
        />
        <DrawerTitle className="mb-7 text-center text-xl font-bold">
          Table of Contents
        </DrawerTitle>
        <ul
          className="min-h-0 overflow-y-auto px-3"
          onScroll={(event) => setIsScrolled(event.currentTarget.scrollTop > 0)}
        >
          {links}
        </ul>
      </DrawerContent>
    </Drawer>
  )
}
