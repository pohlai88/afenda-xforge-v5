"use client";

import type { Member, MemberRole } from "@xforge/contracts/member/types";
import { Button } from "@xforge/design/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@xforge/design/components/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import type { ActionResult } from "@/lib/actions/result";
import { removeMember, updateMemberRole } from "../actions";

const roles: readonly MemberRole[] = ["owner", "admin", "member"];

const report = (result: ActionResult<unknown>, done: string) => {
  if (result.ok) {
    toast.success(done);
  } else {
    toast.error(result.error.message);
  }
};

const RoleItem = ({
  onPick,
  role,
}: Readonly<{ onPick: (role: MemberRole) => void; role: MemberRole }>) => {
  const onSelect = () => onPick(role);
  return <DropdownMenuItem onSelect={onSelect}>Make {role}</DropdownMenuItem>;
};

export const MemberRowActions = ({
  member,
  orgSlug,
}: Readonly<{ member: Member; orgSlug: string }>) => {
  const [pending, startTransition] = useTransition();

  const changeRole = (role: MemberRole) =>
    startTransition(async () => {
      report(
        await updateMemberRole({ memberId: member.id, orgSlug, role }),
        `${member.name} is now ${role}`
      );
    });

  const remove = () =>
    startTransition(async () => {
      report(
        await removeMember({ memberId: member.id, orgSlug }),
        `Removed ${member.name}`
      );
    });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={`Actions for ${member.name}`}
          disabled={pending}
          size="icon-sm"
          variant="ghost"
        >
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Change role</DropdownMenuLabel>
        {roles
          .filter((role) => role !== member.role)
          .map((role) => (
            <RoleItem key={role} onPick={changeRole} role={role} />
          ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={remove} variant="destructive">
          Remove from workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
