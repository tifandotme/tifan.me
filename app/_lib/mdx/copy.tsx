"use client"

import { cn } from "cn"
import { useState } from "react"
import { Icon } from "../../_components/icon"

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  source: string
  lang: string
}

export function CopyButton({
  source,
  lang,
  className,
  ...props
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(source)
    setIsCopied(true)

    setTimeout(() => {
      setIsCopied(false)
    }, 2500)
  }

  return (
    <>
      <button
        type="button"
        disabled={isCopied}
        onClick={copy}
        data-copied={isCopied}
        className={cn(
          "peer no-js absolute top-0 right-0 z-10 size-11 cursor-default items-center justify-center text-muted-darker group-hover:inline-flex data-[copied=false]:hover:text-foreground data-[copied=true]:inline-flex! max-md:inline-flex md:hidden print:hidden",
          className,
        )}
        title="Copy code"
        {...props}
      >
        <Icon
          id={isCopied ? "check" : "copy"}
          className={cn(
            isCopied ? "size-6" : "size-5",
            "bg-[var(--prose-pre-bg)]",
          )}
        />
      </button>

      {/* language label */}
      <span className="absolute top-0 right-2 text-right text-sm leading-7 text-muted select-none group-hover:hidden peer-data-[copied=true]:hidden max-md:hidden">
        {lang}
      </span>
    </>
  )
}
