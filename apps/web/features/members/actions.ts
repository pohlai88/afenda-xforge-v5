"use server";

import { memberIdSchema, organizationSlugSchema } from "@xforge/contracts/ids";
import {
  inviteMemberInputSchema,
  memberRoleSchema,
} from "@xforge/contracts/member/schema";
import type { Member } from "@xforge/contracts/member/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { type ActionResult, toActionResult } from "@/lib/actions/result";
import { getDomainSources } from "@/lib/data";

// Tenant scope comes from the URL slug and is resolved here, on the server.
// The client never supplies an organization id.
const scoped = z.object({ orgSlug: organizationSlugSchema });
const inviteInput = scoped.extend(inviteMemberInputSchema.shape);
const memberInput = scoped.extend({ memberId: memberIdSchema });
const roleInput = memberInput.extend({ role: memberRoleSchema });

/** Members show on two screens of the same domain; both revalidate together. */
const revalidateMemberScreens = (slug: string) => {
  revalidatePath(`/${slug}/members`);
  revalidatePath(`/${slug}/organization`);
};

export const inviteMember = async (
  _previous: ActionResult<Member> | null,
  formData: FormData
): Promise<ActionResult<Member>> =>
  toActionResult(async () => {
    const input = inviteInput.parse(Object.fromEntries(formData));
    const sources = getDomainSources();
    const organization = await sources.organizations.getBySlug(input.orgSlug);
    const member = await sources.members.invite(organization.id, {
      email: input.email,
      name: input.name,
      role: input.role,
    });
    revalidateMemberScreens(organization.slug);
    return member;
  });

export const updateMemberRole = async (
  input: unknown
): Promise<ActionResult<Member>> =>
  toActionResult(async () => {
    const parsed = roleInput.parse(input);
    const sources = getDomainSources();
    const organization = await sources.organizations.getBySlug(parsed.orgSlug);
    const member = await sources.members.updateRole(
      organization.id,
      parsed.memberId,
      {
        role: parsed.role,
      }
    );
    revalidateMemberScreens(organization.slug);
    return member;
  });

export const removeMember = async (
  input: unknown
): Promise<ActionResult<void>> =>
  toActionResult(async () => {
    const parsed = memberInput.parse(input);
    const sources = getDomainSources();
    const organization = await sources.organizations.getBySlug(parsed.orgSlug);
    await sources.members.remove(organization.id, parsed.memberId);
    revalidateMemberScreens(organization.slug);
  });
