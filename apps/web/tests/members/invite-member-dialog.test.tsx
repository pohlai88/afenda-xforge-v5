import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InviteMemberDialog } from "@/features/members/components/invite-member-dialog";

const mocks = vi.hoisted(() => ({
  inviteMember: vi.fn(),
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock("@/features/members/actions", () => ({
  inviteMember: (_previous: unknown, formData: FormData) =>
    mocks.inviteMember(formData),
}));
vi.mock("sonner", () => ({ toast: mocks.toast }));

describe("InviteMemberDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("associates a field error with its input", async () => {
    mocks.inviteMember.mockResolvedValue({
      error: {
        code: "CONFLICT",
        fields: { email: ["A member with this email already exists"] },
        message: "A member with this email already exists",
      },
      ok: false,
    });
    const user = userEvent.setup();
    render(<InviteMemberDialog orgSlug="acme" />);
    await user.click(screen.getByRole("button", { name: "Invite member" }));
    const dialog = await screen.findByRole("dialog", {
      name: "Invite a member",
    });
    await user.type(screen.getByLabelText("Name"), "Ada Again");
    await user.type(screen.getByLabelText("Email"), "ada@acme.example");
    await user.click(screen.getByRole("button", { name: "Send invite" }));

    const message = await screen.findByText(
      "A member with this email already exists"
    );
    const email = screen.getByLabelText("Email");
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAttribute(
      "aria-describedby",
      message.closest("[id]")?.id
    );
    expect(dialog).toBeInTheDocument();
    const submitted = mocks.inviteMember.mock.calls[0]?.[0] as FormData;
    expect(submitted.get("orgSlug")).toBe("acme");
    expect(submitted.get("email")).toBe("ada@acme.example");
  });

  it("closes and toasts on success", async () => {
    mocks.inviteMember.mockResolvedValue({
      data: { name: "Nia Imara" },
      ok: true,
    });
    const user = userEvent.setup();
    render(<InviteMemberDialog orgSlug="acme" />);
    await user.click(screen.getByRole("button", { name: "Invite member" }));
    await user.type(await screen.findByLabelText("Name"), "Nia Imara");
    await user.type(screen.getByLabelText("Email"), "nia@acme.example");
    await user.click(screen.getByRole("button", { name: "Send invite" }));
    await vi.waitFor(() =>
      expect(mocks.toast.success).toHaveBeenCalledWith("Invited Nia Imara")
    );
    await vi.waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });
});
