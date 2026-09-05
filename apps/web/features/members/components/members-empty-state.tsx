import { InviteMemberDialog } from "./invite-member-dialog";

export const MembersEmptyState = ({
  orgSlug,
}: Readonly<{ orgSlug: string }>) => (
  <div className="flex flex-col items-center gap-4 rounded-lg border border-border border-dashed p-10 text-center">
    <div>
      <h2 className="font-medium">No members yet</h2>
      <p className="mt-1 text-muted-foreground text-sm">
        Invite the first person to this workspace to get started.
      </p>
    </div>
    <InviteMemberDialog orgSlug={orgSlug} />
  </div>
);
