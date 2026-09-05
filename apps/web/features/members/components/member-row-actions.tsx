"use client";

import type { Member, MemberRole } from "@xforge/contracts/member/types";
import { Button } from "@xforge/design/blocks/common-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
  const onClick = () => onPick(role);
  return <DropdownMenuItem onClick={onClick}>Make {role}</DropdownMenuItem>;
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
      <DropdownMenuTrigger
        render={
          <Button
            aria-label={`Actions for ${member.name}`}
            disabled={pending}
            size="icon-sm"
            variant="ghost"
          />
        }
      >
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Base UI: a group label must live inside a group. */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Change role</DropdownMenuLabel>
          {roles
            .filter((role) => role !== member.role)
            .map((role) => (
              <RoleItem key={role} onPick={changeRole} role={role} />
            ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={remove} variant="destructive">
          Remove from workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
