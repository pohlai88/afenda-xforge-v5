import { render, screen } from "@testing-library/react";
import { Button } from "@xforge/design/components/button";
import { describe, expect, it } from "vitest";

describe("Button", () => {
  it("renders an accessible button", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("renders its child element when asChild is set", () => {
    render(
      <Button asChild>
        <a href="/docs">Docs</a>
      </Button>
    );

    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "data-slot",
      "button"
    );
  });
});
