import type { ReactNode } from "react";

export const PageHeader = ({
  actions,
  description,
  title,
}: Readonly<{ actions?: ReactNode; description?: string; title: string }>) => (
  <header className="mb-6 flex items-start justify-between gap-4">
    <div>
      <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
      {description ? (
        <p className="mt-1 text-muted-foreground text-sm">{description}</p>
      ) : null}
    </div>
    {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
  </header>
);
