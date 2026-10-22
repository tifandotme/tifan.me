"use server"

import { Config, Effect, Redacted, Schema } from "effect"
import { FetchHttpClient, HttpClient, HttpClientResponse } from "effect/http"

// NOTE rate limit for authenticated user is 5000 req/hour
// https://docs.github.com/en/rest/overview/rate-limits-for-the-rest-api?apiVersion=2022-11-28#primary-rate-limit-for-authenticated-users

const decodeStargazers = HttpClientResponse.schemaBodyJson(
  Schema.Struct({ stargazers_count: Schema.Natural }),
)

export async function fetchStargazersCount(repoUrl: string): Promise<number> {
  return Effect.gen(function* () {
    const token = yield* Config.schema(
      Schema.Redacted(Schema.NonEmptyString),
      "GITHUB_ACCESS_TOKEN",
    )
    const repo = yield* Schema.decodeUnknownEffect(Schema.URLFromString)(
      repoUrl,
    )
    const client = HttpClient.filterStatusOk(yield* HttpClient.HttpClient)
    const response = yield* client.get(
      `https://api.github.com/repos${repo.pathname}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${Redacted.value(token)}`,
        },
      },
    )
    const { stargazers_count } = yield* decodeStargazers(response)
    return stargazers_count
  }).pipe(
    Effect.provide(FetchHttpClient.layer),
    Effect.provideService(FetchHttpClient.RequestInit, {
      cache: "force-cache",
      next: { revalidate: 60 * 60 * 24 },
    }),
    Effect.match({
      onFailure: (error) => {
        console.error(error.message)
        return 0
      },
      onSuccess: (stars) => stars,
    }),
    Effect.runPromise,
  )
}
