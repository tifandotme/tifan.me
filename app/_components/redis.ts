"use server"

import { Config, Effect, Redacted, Schema } from "effect"
import {
  FetchHttpClient,
  HttpBody,
  HttpClient,
  HttpClientResponse,
} from "effect/http"

const decodeViews = HttpClientResponse.schemaBodyJson(
  Schema.Struct({
    result: Schema.NullOr(
      Schema.Union([
        Schema.Natural,
        Schema.NumberFromString.check(
          Schema.isInt(),
          Schema.isGreaterThanOrEqualTo(0),
        ),
      ]),
    ),
  }),
)

export async function fetchViews(
  slug: string,
  increment = false,
): Promise<number | null> {
  return Effect.gen(function* () {
    const url = yield* Config.URL("UPSTASH_REDIS_REST_URL")
    const token = yield* Config.schema(
      Schema.Redacted(Schema.NonEmptyString),
      "UPSTASH_REDIS_REST_TOKEN",
    )
    const client = HttpClient.filterStatusOk(yield* HttpClient.HttpClient)
    const response = yield* client.post(url, {
      headers: {
        Authorization: `Bearer ${Redacted.value(token)}`,
      },
      body: HttpBody.text(
        JSON.stringify(
          increment ? ["HINCRBY", "views", slug, 1] : ["HGET", "views", slug],
        ),
      ),
    })
    const { result } = yield* decodeViews(response)
    return result
  }).pipe(
    Effect.provide(FetchHttpClient.layer),
    Effect.provideService(FetchHttpClient.RequestInit, {
      next: { revalidate: 0 },
    }),
    Effect.match({
      onFailure: (error) => {
        console.error(error.message)
        return null
      },
      onSuccess: (views) => views,
    }),
    Effect.runPromise,
  )
}
