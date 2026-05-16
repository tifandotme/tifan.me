"use client"

import HCaptcha from "@hcaptcha/react-hcaptcha"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Icon } from "../../_components/icon"
import { cn } from "../../_lib/utils"

const STORAGE_KEY = "email-unlocked"

const EMAIL = process.env["NEXT_PUBLIC_EMAIL"]
const HCAPTCHA_SITE_KEY = process.env["NEXT_PUBLIC_HCAPTCHA_SITE_KEY"]
if (!EMAIL || !HCAPTCHA_SITE_KEY) {
  throw new Error(
    "NEXT_PUBLIC_EMAIL or NEXT_PUBLIC_HCAPTCHA_SITE_KEY is not set",
  )
}

type EmailVisibilityState = {
  isHidden: boolean
  isLoading: boolean
  isRendered: boolean
}

export function ToggleableEmail() {
  const [state, setState] = useState<EmailVisibilityState>({
    isHidden: process.env.NODE_ENV !== "development",
    isLoading: false,
    isRendered: false,
  })

  const captchaRef = useRef<HCaptcha | null>(null)

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      setState((prev) => ({
        ...prev,
        isRendered: true,
        isHidden: localStorage.getItem(STORAGE_KEY) !== "true",
      }))
    }
  }, [])

  useEffect(() => {
    if (state.isLoading) {
      document.body.style.cursor = "wait"
    } else {
      document.body.style.removeProperty("cursor")
    }
  }, [state.isLoading])

  const handleCaptchaClick = () => {
    if (state.isHidden) {
      setState((prev) => ({ ...prev, isLoading: true }))
      captchaRef.current?.execute()
    }
  }

  const handleCaptchaVerify = () => {
    localStorage.setItem(STORAGE_KEY, "true")
    setState((prev) => ({ ...prev, isHidden: false }))
  }

  const handleCaptchaOpen = () => {
    setState((prev) => ({ ...prev, isLoading: false }))
  }

  return (
    <button
      type="button"
      className={cn(
        "inline",
        state.isHidden &&
          "mx-0.5 bg-muted-darker/20 px-1 text-foreground/70 select-none hover:cursor-pointer hover:bg-muted-darker/30",
        state.isLoading && "pointer-events-none",
      )}
      onClick={handleCaptchaClick}
    >
      {state.isHidden ? (
        <>
          <Icon
            id="eye-closed"
            className="align-center mr-1.5 inline size-[1em] -translate-y-px group-hover:hidden"
          />
          <span>show email</span>
        </>
      ) : (
        <a className="font-bold hover:underline" href={`mailto:${EMAIL!}`}>
          {EMAIL!}
        </a>
      )}

      {state.isRendered &&
        createPortal(
          <HCaptcha
            ref={captchaRef}
            cleanup
            size="invisible"
            sitekey={HCAPTCHA_SITE_KEY!}
            onOpen={handleCaptchaOpen}
            onVerify={handleCaptchaVerify}
          />,
          document.body,
        )}
    </button>
  )
}
