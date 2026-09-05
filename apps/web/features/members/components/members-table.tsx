import type { Member } from "@xforge/contracts/member/types";
import { Avatar, AvatarFallback } from "@xforge/design/blocks/avatar";
import { Badge, type BadgeProps } from "@xforge/design/blocks/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@xforge/design/components/table";
import { MemberRowActions } from "./member-row-actions";

const joined = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeZone: "UTC",
});

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

// One Record per domain vocabulary (AF-CMP-BADGE do): owner wears the
// identity mark, the other roles stay neutral facts; a status wears the
// status variant whose semantic it is (AF-CMP-BADGE-002).
const roleVariant: Readonly<Record<Member["role"], BadgeProps["variant"]>> = {
  admin: "neutral",
  member: "neutral",
  owner: "primary",
};

const statusVariant: Readonly<Record<Member["status"], BadgeProps["variant"]>> =
  {
    active: "positive",
    invited: "informative",
  };

export const MembersTable = ({
  members,
  orgSlug,
}: Readonly<{ members: readonly Member[]; orgSlug: string }>) => {
  if (members.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No members match these filters.
      </p>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="w-12">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{initials(member.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-medium">{member.name}</p>
                  <p className="truncate text-muted-foreground text-xs">
                    {member.email}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={roleVariant[member.role]}>{member.role}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={statusVariant[member.status]}>
                {member.status}
              </Badge>
            </TableCell>
            <TableCell className="tabular-nums">
              {joined.format(new Date(member.joinedAt))}
            </TableCell>
            <TableCell>
              <MemberRowActions member={member} orgSlug={orgSlug} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
