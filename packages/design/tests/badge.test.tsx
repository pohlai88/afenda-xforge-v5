import { render, screen } from "@testing-library/react";
import { Badge, badgeVariants } from "@xforge/design/blocks/badge";
import { describe, expect, it } from "vitest";

// AF-CMP-BADGE-003's mechanism list: what an interactive block would compose.
const INTERACTIVE_MECHANISM = /af-interactive|state-layer/;

describe("Badge", () => {
  it("renders its text with the block's identity and variant pair", () => {
    render(<Badge variant="positive">active</Badge>);

    const badge = screen.getByText("active");
    expect(badge).toHaveAttribute("data-slot", "badge");
    expect(badge).toHaveClass("bg-positive-container");
  });

  it("stays read-only: no interactive mechanism, no state layer", () => {
    // AF-CMP-BADGE-003: an interactive chip is a different component.
    expect(badgeVariants({ variant: "neutral" })).not.toMatch(
      INTERACTIVE_MECHANISM
    );
  });

  it("changes the element through render while the classes stay the block's", () => {
    render(<Badge render={<a href="/roles" />}>owner</Badge>);

    const link = screen.getByRole("link", { name: "owner" });
    expect(link).toHaveClass("rounded-full", "type-label");
  });
});
