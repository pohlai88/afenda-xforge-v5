"use client";

import { cn } from "@xforge/design/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SidebarNavItem {
  href: string;
  label: string;
}

export const SidebarNav = ({
  items,
}: Readonly<{ items: readonly SidebarNavItem[] }>) => {
  const pathname = usePathname();
  return (
    <nav aria-label="Workspace">
      <ul className="flex gap-1 md:flex-col">
        {items.map((item) => {
          const isCurrent = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm transition-colors",
                  isCurrent
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
