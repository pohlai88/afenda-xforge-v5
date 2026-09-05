import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "@/components/theme-toggle";

const theme = vi.hoisted(() => ({
  resolvedTheme: "light" as "dark" | "light",
  setTheme: vi.fn(),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: theme.resolvedTheme,
    setTheme: theme.setTheme,
  }),
}));

afterEach(() => {
  cleanup();
  theme.setTheme.mockClear();
});

describe("ThemeToggle", () => {
  it("is a named button that switches to the other theme", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole("button", { name: "Toggle theme" }));
    expect(theme.setTheme).toHaveBeenCalledWith("dark");
  });

  it("switches back to light from dark", async () => {
    theme.resolvedTheme = "dark";
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole("button", { name: "Toggle theme" }));
    expect(theme.setTheme).toHaveBeenCalledWith("light");
  });
});
