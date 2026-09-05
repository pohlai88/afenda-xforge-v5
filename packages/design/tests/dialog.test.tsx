import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@xforge/design/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@xforge/design/components/dialog";
import { describe, expect, it, vi } from "vitest";

const Example = () => (
  <Dialog>
    <DialogTrigger render={<Button />}>Open</DialogTrigger>
    <DialogContent>
      <DialogTitle>Example dialog</DialogTitle>
      <DialogDescription>A body with one field.</DialogDescription>
      <input aria-label="First field" />
    </DialogContent>
  </Dialog>
);

describe("Dialog keyboard contract", () => {
  it("moves focus inside on open, closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);
    const dialog = await screen.findByRole("dialog", {
      name: "Example dialog",
    });
    expect(dialog).toHaveAccessibleDescription("A body with one field.");
    expect(dialog.contains(document.activeElement)).toBe(true);
    await user.keyboard("{Escape}");
    await vi.waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
    expect(trigger).toHaveFocus();
  });
});
