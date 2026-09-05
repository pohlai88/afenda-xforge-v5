import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@xforge/design/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@xforge/design/components/dropdown-menu";
import { describe, expect, it, vi } from "vitest";

const Example = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button>Actions</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>First</DropdownMenuItem>
      <DropdownMenuItem>Second</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

describe("DropdownMenu keyboard contract", () => {
  it("opens from the keyboard, moves with arrows, closes on Escape and restores focus", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    trigger.focus();
    await user.keyboard("{Enter}");
    const menu = await screen.findByRole("menu");
    expect(menu).toBeInTheDocument();
    await vi.waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "First" })).toHaveFocus()
    );
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Second" })).toHaveFocus();
    await user.keyboard("{Escape}");
    await vi.waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument()
    );
    expect(trigger).toHaveFocus();
  });
});
