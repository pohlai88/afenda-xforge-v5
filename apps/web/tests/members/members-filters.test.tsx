import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { memberFilterSchema } from "@xforge/contracts/member/schema";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MembersFilters } from "@/features/members/components/members-filters";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/acme/members",
  useRouter: () => ({ replace }),
}));

describe("MembersFilters", () => {
  beforeEach(() => {
    replace.mockClear();
  });

  it("writes the search query into the URL after a pause", async () => {
    const user = userEvent.setup();
    render(<MembersFilters filter={memberFilterSchema.parse({})} />);
    await user.type(screen.getByRole("searchbox", { name: "Search" }), "ada");
    await vi.waitFor(() =>
      expect(replace).toHaveBeenCalledWith("/acme/members?query=ada")
    );
  });

  it("labels the role and status selects", () => {
    render(
      <MembersFilters filter={memberFilterSchema.parse({ role: "owner" })} />
    );
    expect(screen.getByRole("combobox", { name: "Role" })).toHaveTextContent(
      "owner"
    );
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveTextContent(
      "Any status"
    );
  });
});
