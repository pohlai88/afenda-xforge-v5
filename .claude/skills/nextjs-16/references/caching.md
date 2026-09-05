# Caching in Next 16

Source: `nextjs.org/docs/app/getting-started/caching`,
`.../api-reference/config/next-config-js/cacheComponents` (version 16.3.4,
lastUpdated 2026-06-22), `.../guides/caching-without-cache-components`.

## There are two models, and this repo is on the older one

`apps/web/next.config.ts` does not set `cacheComponents`. Everything below about
`use cache` is therefore **unavailable here** until that flag is turned on, which is a
deliberate change, not a fix.

Without the flag, caching is the previous model: `fetch` options, `unstable_cache`, and
route segment configs. The docs now file that under "Caching (Previous Model)".

## What `cacheComponents: true` changes (16.0.0)

```ts
// next.config.ts
const nextConfig: NextConfig = { cacheComponents: true }
```

- One flag replaces three. It "controls the `ppr`, `useCache`, and `dynamicIO` flags as a
  single, unified configuration."
- **Partial Prerendering becomes the default** in the App Router. `experimental.ppr` and the
  `experimental_ppr` segment export are **removed** — not deprecated, removed. Recalling them
  is the clearest sign of 14/15-era memory.
- Data fetching is **dynamic by default**; you opt into caching per page, component or
  function with `use cache`. A static shell is prerendered and served immediately while
  dynamic content streams in.
- **Requires the Node.js runtime.** `runtime = 'edge'` is deprecated and must be migrated.
- Unlocks `use cache`, `cacheLife`, `cacheTag`, and the `use cache: private` and
  `use cache: remote` variants.

## The navigation behaviour change nobody expects

With `cacheComponents` on, Next uses React's `<Activity>` for client-side navigation. The
previous route is **not unmounted** — it is set to `"hidden"`. So:

- component state survives navigating away and back
- effects are cleaned up when hidden and **recreated** when visible again
- a heuristic keeps only a few recent routes hidden; older ones leave the DOM

This breaks any pattern that assumed unmount-on-navigate — dropdowns, dialogs, and tests that
relied on teardown. If this repo ever enables the flag, that is the change to look for first,
not the caching.

## Migrating from experimental flags

`experimental.useCache` and `experimental.dynamicIO` migrate via the Version 16 upgrade guide.
Route segment configs migrate via "Migrating to Cache Components".
