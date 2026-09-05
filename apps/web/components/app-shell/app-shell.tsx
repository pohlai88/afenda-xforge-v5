import type { Organization } from "@xforge/contracts/organization/types";
import type { ReactNode } from "react";
import { SidebarNav } from "./sidebar-nav";

export const AppShell = ({
  children,
  organization,
}: Readonly<{ children: ReactNode; organization: Organization }>) => {
  const base = `/${organization.slug}`;
  return (
    <div className="flex min-h-svh">
      <aside className="flex w-60 shrink-0 flex-col gap-6 border-border border-r bg-sidebar p-4">
        <div>
          <p className="font-mono text-muted-foreground text-xs uppercase tracking-wider">
            Workspace
          </p>
          <p className="truncate font-medium">{organization.name}</p>
        </div>
        <SidebarNav
          items={[
            { href: base, label: "Overview" },
            { href: `${base}/members`, label: "Members" },
          ]}
        />
      </aside>
      <main className="min-w-0 flex-1 p-8">{children}</main>
    </div>
  );
};
