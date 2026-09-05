import type { Member } from "@xforge/contracts/member/types";
import { Avatar, AvatarFallback } from "@xforge/design/components/avatar";
import { Badge } from "@xforge/design/components/badge";
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
              <Badge
                variant={member.role === "owner" ? "default" : "secondary"}
              >
                {member.role}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={member.status === "active" ? "outline" : "secondary"}
              >
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
