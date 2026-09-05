import { render, screen } from "@testing-library/react";
import { Button } from "@xforge/design/components/button";
import { describe, expect, it } from "vitest";

describe("Button", () => {
  it("renders an accessible button", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("renders the element given to render", () => {
    render(<Button render={<a href="/docs" />}>Docs</Button>);

    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "data-slot",
      "button"
    );
  });
});
