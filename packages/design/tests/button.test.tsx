import { render, screen } from "@testing-library/react";
import { Button, buttonVariants } from "@xforge/design/blocks/button";
import { describe, expect, it } from "vitest";

describe("Button", () => {
  it("renders an accessible button", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("composes a non-button tag through render with button semantics", () => {
    render(
      <Button nativeButton={false} render={<span />}>
        Act
      </Button>
    );

    expect(screen.getByRole("button", { name: "Act" })).toHaveAttribute(
      "data-slot",
      "button"
    );
  });

  it("dresses a real anchor as a button, keeping link semantics", () => {
    // AF-CMP-COMMON-BUTTON-004: the Button never wraps a link; navigation
    // wears the block's classes on the anchor itself.
    render(
      <a className={buttonVariants({ variant: "outline" })} href="/docs">
        Docs
      </a>
    );

    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveClass("af-interactive", "no-underline");
  });
});
