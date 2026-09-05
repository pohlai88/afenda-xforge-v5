# notFound()

Source: `nextjs.org/docs/app/api-reference/functions/not-found` (version 16.3.4,
lastUpdated 2026-07-24). Introduced v13.0.0 — this API is stable, unlike caching.

Not used anywhere in the v5 scaffold yet; the notes below are for the first route that needs it.

## No `return`, and TypeScript knows

Calling it is enough; it throws. Its return type is `never`, so a check before it **stays
narrowed after** it:

```tsx
const user = await fetchUser(id)
if (!user) {
  notFound()
}
return <Profile user={user} />   // user is defined here
```

`return notFound()` is not wrong, just noise, and it obscures the narrowing.

## The trap: try/catch swallows it

It travels up the stack like any exception. **A `try/catch` around the call suppresses it and
the not-found UI never renders.** If you must catch errors near the call, use
`unstable_rethrow` to let the interrupt through first.

This is the failure that looks like nothing happening.

## The status code cannot be fixed after streaming starts

Calling `notFound()` inside a `<Suspense>` boundary — the idiomatic place, so the shell and
loading UI stay visible — means the response has **already begun streaming as a 200**, and the
status cannot change. You get a soft 404: correct UI, wrong status. The `noindex` tag keeps it
out of search results.

To return a real `404`, the resource must be checked **before the response streams**. Under
Cache Components every dynamic route streams a static shell first, so that check belongs in
`proxy` instead.

Put the existence check in the data-access function, awaited by the component that needs it —
not in the route, where it blocks the whole page.

## The boundary

Add `not-found.tsx` beside the route. Without one, the nearest parent boundary renders,
falling back to Next's default 404.
