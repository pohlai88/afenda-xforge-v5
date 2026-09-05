import type { Organization } from "@xforge/contracts/organization/types";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarNav } from "./sidebar-nav";

/** One DOM for every width: a top bar under `md`, a sidebar from `md` up. */
export const AppShell = ({
  children,
  organization,
}: Readonly<{ children: ReactNode; organization: Organization }>) => {
  const base = `/${organization.slug}`;
  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      <aside className="flex items-center gap-4 border-border border-b bg-sidebar px-4 py-3 md:w-60 md:shrink-0 md:flex-col md:items-stretch md:gap-6 md:border-r md:border-b-0 md:p-4">
        <div className="min-w-0">
          <p className="hidden font-mono text-muted-foreground text-xs uppercase tracking-wider md:block">
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
        <div className="ml-auto md:mt-auto md:ml-0">
          <ThemeToggle />
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
};
