"use client";

import { Button } from "@xforge/design/components/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * Visible counterpart of the `d` hotkey in theme-provider.tsx. Both icons are
 * in the markup and CSS shows the one for the active theme, so server and
 * client render identically without a mounted flag.
 */
export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const toggle = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");
  return (
    <Button
      aria-label="Toggle theme"
      onClick={toggle}
      size="icon-sm"
      title="Toggle theme (d)"
      variant="ghost"
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  );
};
