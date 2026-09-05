import { isDataSourceError } from "@xforge/contracts/errors";
import { organizationSlugSchema } from "@xforge/contracts/ids";
import type { Organization } from "@xforge/contracts/organization/types";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell/app-shell";
import { getDomainSources } from "@/lib/data";

/** Resolves the tenant from the URL; anything that is not a known workspace is not-found. */
const resolveOrganization = async (orgSlug: string): Promise<Organization> => {
  const slug = organizationSlugSchema.safeParse(orgSlug);
  if (!slug.success) {
    notFound();
  }
  try {
    return await getDomainSources().organizations.getBySlug(slug.data);
  } catch (error) {
    if (isDataSourceError(error) && error.code === "NotFound") {
      notFound();
    }
    throw error;
  }
};

export default async function WorkspaceLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ orgSlug: string }> }>) {
  const { orgSlug } = await params;
  const organization = await resolveOrganization(orgSlug);
  return <AppShell organization={organization}>{children}</AppShell>;
}
