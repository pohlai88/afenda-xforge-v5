import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { acmeMembers } from "@xforge/contracts/fixtures/members";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemberRowActions } from "@/features/members/components/member-row-actions";

const mocks = vi.hoisted(() => ({
  removeMember: vi.fn(),
  toast: { error: vi.fn(), success: vi.fn() },
  updateMemberRole: vi.fn(),
}));

vi.mock("@/features/members/actions", () => ({
  removeMember: (input: unknown) => mocks.removeMember(input),
  updateMemberRole: (input: unknown) => mocks.updateMemberRole(input),
}));
vi.mock("sonner", () => ({ toast: mocks.toast }));

const ada = acmeMembers.find((member) => member.email === "ada@acme.example");
if (!ada) {
  throw new Error("fixture missing: ada@acme.example");
}

describe("MemberRowActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("removes only through the confirm dialog, with the slug from props", async () => {
    mocks.removeMember.mockResolvedValue({ data: undefined, ok: true });
    const user = userEvent.setup();
    render(<MemberRowActions member={ada} orgSlug="acme" />);
    await user.click(
      screen.getByRole("button", { name: `Actions for ${ada.name}` })
    );
    await user.click(
      await screen.findByRole("menuitem", { name: "Remove from workspace…" })
    );
    // The menu item only opens the dialog; the act is not yet done (§6.3).
    await screen.findByRole("alertdialog", { name: `Remove ${ada.name}?` });
    expect(mocks.removeMember).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Remove" }));
    await vi.waitFor(() =>
      expect(mocks.removeMember).toHaveBeenCalledWith({
        memberId: ada.id,
        orgSlug: "acme",
      })
    );
    expect(mocks.toast.success).toHaveBeenCalledWith(`Removed ${ada.name}`);
  });

  it("cancelling the confirm dialog removes nobody", async () => {
    const user = userEvent.setup();
    render(<MemberRowActions member={ada} orgSlug="acme" />);
    await user.click(
      screen.getByRole("button", { name: `Actions for ${ada.name}` })
    );
    await user.click(
      await screen.findByRole("menuitem", { name: "Remove from workspace…" })
    );
    await screen.findByRole("alertdialog", { name: `Remove ${ada.name}?` });
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(
      screen.queryByRole("alertdialog", { name: `Remove ${ada.name}?` })
    ).toBeNull();
    expect(mocks.removeMember).not.toHaveBeenCalled();
  });

  it("surfaces an expected failure as a toast, not a crash", async () => {
    mocks.updateMemberRole.mockResolvedValue({
      error: {
        code: "INVARIANT",
        message: "An organization must keep at least one active owner",
      },
      ok: false,
    });
    const user = userEvent.setup();
    render(<MemberRowActions member={ada} orgSlug="acme" />);
    await user.click(
      screen.getByRole("button", { name: `Actions for ${ada.name}` })
    );
    await user.click(
      await screen.findByRole("menuitem", { name: "Make admin" })
    );
    await vi.waitFor(() =>
      expect(mocks.toast.error).toHaveBeenCalledWith(
        "An organization must keep at least one active owner"
      )
    );
  });
});
