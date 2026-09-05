import type { Metadata } from "next";
import { PageHeader } from "@/components/app-shell/page-header";

export const metadata: Metadata = {
  title: "Members",
};

// Placeholder until the read slice lands (plan phase 3B).
export default function MembersPage() {
  return (
    <>
      <PageHeader description="People in this workspace" title="Members" />
      <p className="text-muted-foreground text-sm">
        The members list arrives with the next slice.
      </p>
    </>
  );
}
