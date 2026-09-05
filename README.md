# Afenda xForge v5

pnpm + Turborepo monorepo. See `CLAUDE.md` for commands and architecture.

- `apps/web` — Next.js app (`@xforge/web`)
- `packages/design` — shadcn/ui design system (`@xforge/design`)
- `packages/typescript-config` — shared tsconfig bases

Add a shadcn component (it lands in `packages/design/src/components`):

```bash
pnpm dlx shadcn@4.21.0 add dialog -c apps/web
```

Import it from the design package:

```tsx
import { Dialog } from "@xforge/design/components/dialog";
```
