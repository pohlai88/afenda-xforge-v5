import { organizationSlugSchema } from "@xforge/contracts/ids";
import { memberFilterSchema } from "@xforge/contracts/member/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@xforge/design/components/card";
import type { Metadata } from "next";
import { PageHeader } from "@/components/app-shell/page-header";
import { getDomainSources } from "@/lib/data";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function OverviewPage({
  params,
}: Readonly<{ params: Promise<{ orgSlug: string }> }>) {
  const { orgSlug } = await params;
  const sources = getDomainSources();
  // The layout already proved the slug resolves; reads for the screen start together.
  const organization = await sources.organizations.getBySlug(
    organizationSlugSchema.parse(orgSlug)
  );
  const [members, invited] = await Promise.all([
    sources.members.list(organization.id, memberFilterSchema.parse({})),
    sources.members.list(
      organization.id,
      memberFilterSchema.parse({ status: "invited" })
    ),
  ]);

  return (
    <>
      <PageHeader
        description={`Workspace /${organization.slug}`}
        title={organization.name}
      />
      <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>Members</CardDescription>
            <CardTitle className="text-3xl tabular-nums">
              {members.total}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            {invited.total} invited, {members.total - invited.total} active
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Created</CardDescription>
            <CardTitle className="text-3xl tabular-nums">
              {organization.createdAt.slice(0, 10)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Fixture data — the database arrives in architecture §5.5.
          </CardContent>
        </Card>
      </div>
    </>
  );
}
