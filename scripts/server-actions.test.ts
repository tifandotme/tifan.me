import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { afterEach, test, vi } from "vite-plus/test"
import { fetchStargazersCount } from "../app/(home)/projects/github.ts"
import { fetchViews } from "../app/_components/redis.ts"

/* eslint-disable no-await-in-loop -- Cases share a fetch stub and must run sequentially. */

afterEach(() => {
  vi.restoreAllMocks()
})

test("count actions decode API responses and fall back on failures", async () => {
  const originalEnv = { ...process.env }
  process.env["UPSTASH_REDIS_REST_URL"] = "https://redis.example.test"
  process.env["UPSTASH_REDIS_REST_TOKEN"] = "test-redis-token"
  process.env["GITHUB_ACCESS_TOKEN"] = "test-github-token"

  let response = () => Response.json({ result: "37", stargazers_count: 89 })
  vi.spyOn(globalThis, "fetch").mockImplementation(async () => response())
  vi.spyOn(console, "error").mockImplementation(() => {})

  try {
    assert.equal(await fetchViews("post"), 37)
    assert.equal(
      await fetchStargazersCount("https://github.com/owner/repo"),
      89,
    )

    response = () => Response.json({ result: 38 })
    assert.equal(await fetchViews("post", true), 38)
    response = () => Response.json({ result: null })
    assert.equal(await fetchViews("missing"), null)
    response = () => Response.json({ result: "0", stargazers_count: 0 })
    assert.equal(await fetchViews("post"), 0)
    assert.equal(await fetchStargazersCount("https://github.com/owner/repo"), 0)

    for (const invalid of [
      "not-a-count",
      -1,
      1.5,
      true,
      {},
      Number.MAX_SAFE_INTEGER + 1,
    ]) {
      response = () =>
        Response.json({ result: invalid, stargazers_count: invalid })
      assert.equal(
        await fetchViews("post"),
        null,
        `invalid views: ${JSON.stringify(invalid)}`,
      )
      assert.equal(
        await fetchStargazersCount("https://github.com/owner/repo"),
        0,
      )
    }

    response = () => Response.json({ stargazers_count: "89" })
    assert.equal(await fetchViews("post"), null)
    assert.equal(await fetchStargazersCount("https://github.com/owner/repo"), 0)
    assert.equal(await fetchStargazersCount("not-a-url"), 0)

    for (const failure of [
      () =>
        Response.json({ result: "37", stargazers_count: 89 }, { status: 503 }),
      () => new Response("invalid json"),
      () => {
        throw new Error("network unavailable")
      },
    ]) {
      response = failure
      assert.equal(await fetchViews("post"), null)
      assert.equal(
        await fetchStargazersCount("https://github.com/owner/repo"),
        0,
      )
    }
  } finally {
    process.env = originalEnv
  }
})

test("missing or empty configuration returns fallbacks without fetching", () => {
  for (const value of [undefined, ""]) {
    const env = { ...process.env }
    for (const key of [
      "UPSTASH_REDIS_REST_URL",
      "UPSTASH_REDIS_REST_TOKEN",
      "GITHUB_ACCESS_TOKEN",
    ]) {
      if (value === undefined) delete env[key]
      else env[key] = value
    }
    execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "--eval",
        `
      import assert from "node:assert/strict";
      import { fetchViews } from ${JSON.stringify(new URL("../app/_components/redis.ts", import.meta.url).href)};
      import { fetchStargazersCount } from ${JSON.stringify(new URL("../app/(home)/projects/github.ts", import.meta.url).href)};
      let fetched = false;
      globalThis.fetch = async () => { fetched = true; throw new Error("unexpected fetch"); };
      console.error = () => {};
      assert.equal(await fetchViews("post"), null);
      assert.equal(await fetchStargazersCount("https://github.com/owner/repo"), 0);
      assert.equal(fetched, false);
    `,
      ],
      { env },
    )
  }
})
