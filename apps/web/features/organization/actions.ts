"use server";

import { memberIdSchema, organizationSlugSchema } from "@xforge/contracts/ids";
import {
  moveMembersInputSchema,
  updateMemberInputSchema,
} from "@xforge/contracts/member/schema";
import type { Member } from "@xforge/contracts/member/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { type ActionResult, toActionResult } from "@/lib/actions/result";
import { getDomainSources } from "@/lib/data";
import { UNASSIGNED_UNIT } from "./constants";

// Tenant scope comes from the URL slug and is resolved here, on the server.
// The client never supplies an organization id.
const scoped = z.object({ orgSlug: organizationSlugSchema });

const updateInput = scoped.extend({
  memberId: memberIdSchema,
  name: updateMemberInputSchema.shape.name,
  title: z
    .string()
    .trim()
    .max(80)
    .transform((value) => (value === "" ? null : value))
    .pipe(updateMemberInputSchema.shape.title),
  unitId: z
    .string()
    .transform((value) => (value === UNASSIGNED_UNIT ? null : value))
    .pipe(updateMemberInputSchema.shape.unitId),
});

const moveInput = scoped.extend(moveMembersInputSchema.shape);

/** Both screens of the domain read this data; both revalidate together. */
const revalidateMemberScreens = (slug: string) => {
  revalidatePath(`/${slug}/organization`);
  revalidatePath(`/${slug}/members`);
};

export const updateMember = async (
  _previous: ActionResult<Member> | null,
  formData: FormData
): Promise<ActionResult<Member>> =>
  toActionResult(async () => {
    const input = updateInput.parse(Object.fromEntries(formData));
    const sources = getDomainSources();
    const organization = await sources.organizations.getBySlug(input.orgSlug);
    const member = await sources.members.update(
      organization.id,
      input.memberId,
      { name: input.name, title: input.title, unitId: input.unitId }
    );
    revalidateMemberScreens(organization.slug);
    return member;
  });

export const moveMembers = async (
  input: unknown
): Promise<ActionResult<Member[]>> =>
  toActionResult(async () => {
    const parsed = moveInput.parse(input);
    const sources = getDomainSources();
    const organization = await sources.organizations.getBySlug(parsed.orgSlug);
    const moved = await sources.members.move(organization.id, {
      memberIds: parsed.memberIds,
      unitId: parsed.unitId,
    });
    revalidateMemberScreens(organization.slug);
    return moved;
  });
