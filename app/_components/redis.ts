"use server"

const URL = process.env["KV_REST_API_URL"]
const TOKEN = process.env["KV_REST_API_TOKEN"]
if (!URL || !TOKEN) {
  throw new Error("KV_REST_API_URL or KV_REST_API_TOKEN is not set")
}

export async function fetchViews(slug: string, increment = false) {
  try {
    const res = await fetch(URL!, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN!}`,
      },
      body: JSON.stringify(
        increment ? ["HINCRBY", "views", slug, 1] : ["HGET", "views", slug],
      ),
      next: {
        revalidate: 0,
      },
    })

    if (!res.ok) {
      throw new Error("Failed to fetch Upstash API")
    }

    const result = (await res.json()).result as string | null
    return result === null ? null : Number(result)
  } catch (err) {
    console.error(err instanceof Error ? err.message : "An error occured")
    return null
  }
}
