# The client/server boundary

Source: `nextjs.org/docs/app/getting-started/server-and-client-components` (version 16.3.4,
lastUpdated 2026-08-25), `.../api-reference/directives/use-client`.

## Which side

**Client Component** when you need state or event handlers (`onClick`, `onChange`), lifecycle
logic (`useEffect`), browser-only APIs (`localStorage`, `window`, `navigator`), or custom
hooks.

**Server Component** when you need to fetch close to the source, use secrets without exposing
them, cut JavaScript sent to the browser, or stream progressively for FCP.

In this repository the second list is mostly moot today — there is no server data layer yet —
so the working rule is narrower: **`'use client'` when the component has state, an
event handler, an effect or a browser API, and not otherwise.** In the v5 scaffold the one file that
carries it (`components/theme-provider.tsx`) qualifies on that test; re-check as screens land.

## `'use client'` is a boundary, not a label

It marks where the server graph ends and the client graph begins. Everything imported *below*
it is client code. So placing it high is expensive and placing it at the leaf is cheap — this
is the whole of bundle discipline in the App Router.

The pattern that keeps it low: a Server Component fetches, then passes the result as props to
a small client leaf that handles interactivity.

## Context providers must be client, and wrap from a server parent

React context is **not supported in Server Components**. The shape is a client component
taking `children`, imported into a server `layout`:

```tsx
// app/theme-provider.tsx
'use client'
export const ThemeContext = createContext({})
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
}
```

`components/theme-provider.tsx` is exactly this shape. Because `children` is passed through rather than
imported, the server subtree inside the provider **stays server** — the provider does not
drag the tree across the boundary.

## Environment poisoning

Modules are shared between both graphs, so server-only code can be imported into the client by
accident — a `fetch` carrying `process.env.API_KEY` reaching a client bundle leaks the key.
When this repository gains real secrets, that is the failure mode to guard, and it is a lint
and package-boundary problem, not a code-review problem.

Today the equivalent hazard is smaller and still real: anything imported from a `'use client'`
file is client code, whatever it was written for.
