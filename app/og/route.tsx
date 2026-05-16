import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"
import type { SVGProps } from "react"

export const runtime = "edge"

const size = {
  width: 1920,
  height: 1080,
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const postTitle = searchParams.get("title")

  if (!postTitle) {
    return new ImageResponse(
      <div
        style={{
          background: "hsl(215 20% 65%)",
          color: "hsl(0 0% 0%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Logo
          style={{
            width: 180,
            height: 180,
          }}
        />
      </div>,
      {
        ...size,
      },
    )
  }

  return new ImageResponse(
    <div
      style={{
        background: "#94a3b8", // slate 400
        color: "hsl(240 4% 15%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "0 150px",
        gap: "120px",
      }}
    >
      <Logo
        style={{
          width: 87,
          height: 87,
        }}
      />
      <div
        style={{
          fontSize: 140,
          lineHeight: 0.85,
          letterSpacing: -2,
        }}
      >
        {postTitle}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          // Nunito Sans Condensed ExtraBold
          data: await fetch(new URL("./nunito-sans.ttf", import.meta.url)).then(
            (res) => res.arrayBuffer(),
          ),
          name: "Nunito Sans",
        },
      ],
    },
  )
}

function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 84 80"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        width="20"
        height="80"
        x="32"
        transform="matrix(1, 0, 0, 1, 1.4210854715202004e-14, 0)"
      />
      <path
        d="M 58 0 L 84 0 L 84 26 L 58 0 Z"
        style={{
          paintOrder: "stroke",
          transformOrigin: "107.721px 44.516px",
        }}
      />
      <path
        d="M 0 26 L 0 0 L 26 0 L 0 26 Z"
        style={{
          paintOrder: "stroke",
          transformOrigin: "103.578px 42.804px",
        }}
      />
    </svg>
  )
}
