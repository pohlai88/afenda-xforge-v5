import { render, screen } from "@testing-library/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@xforge/design/blocks/avatar";
import { describe, expect, it } from "vitest";

describe("Avatar", () => {
  it("shows the authored initials fallback until an image resolves", () => {
    // AF-CMP-AVATAR-002: the fallback is anatomy. jsdom never loads the
    // image, which is exactly the pre-resolve state a slow network shows.
    render(
      <Avatar>
        <AvatarImage alt="" src="/nobody.png" />
        <AvatarFallback>AT</AvatarFallback>
      </Avatar>
    );

    const fallback = screen.getByText("AT");
    expect(fallback).toHaveAttribute("data-slot", "avatar-fallback");
  });

  it("keeps a decorative disc out of the accessibility tree", () => {
    // AF-CMP-AVATAR-001: beside the visible name the disc adds nothing,
    // so nothing here may surface as an image to assistive technology.
    render(
      <Avatar>
        <AvatarFallback>AT</AvatarFallback>
      </Avatar>
    );

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
