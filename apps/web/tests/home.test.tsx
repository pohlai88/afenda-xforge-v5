import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page from "@/app/(marketing)/page";

describe("home page", () => {
  it("names the product and links to the demo workspace", () => {
    render(<Page />);
    expect(
      screen.getByRole("heading", { name: "Afenda xForge" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Open demo workspace" })
    ).toHaveAttribute("href", "/acme");
  });
});
