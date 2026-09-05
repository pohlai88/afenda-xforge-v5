"use client";

import type { Member } from "@xforge/contracts/member/types";
import type { OrganizationUnitWithCount } from "@xforge/contracts/unit/types";
import { Button } from "@xforge/design/blocks/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@xforge/design/blocks/dialog";
import { Field, FieldLabel } from "@xforge/design/components/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@xforge/design/components/select";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { moveMembers } from "../actions";

interface MoveMembersDialogProps {
  members: readonly Member[];
  onDone: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  orgSlug: string;
  units: readonly OrganizationUnitWithCount[];
}

/** "N people from <unit>" lines, grouped — what will actually change. */
const impactLines = (
  members: readonly Member[],
  unitNames: ReadonlyMap<string, string>,
  targetId: string
): string[] => {
  const from = new Map<string, number>();
  let already = 0;
  for (const member of members) {
    if (member.unitId === targetId) {
      already += 1;
      continue;
    }
    const label =
      member.unitId === null
        ? "from no unit"
        : `from ${unitNames.get(member.unitId) ?? "another unit"}`;
    from.set(label, (from.get(label) ?? 0) + 1);
  }
  const lines = [...from.entries()].map(
    ([label, count]) =>
      `${count} ${count === 1 ? "person moves" : "people move"} ${label}`
  );
  if (already > 0) {
    lines.push(
      `${already} already there — no change for ${already === 1 ? "them" : "those"}`
    );
  }
  return lines;
};

/**
 * The bulk change commits only after its impact is understandable — never a
 * bare "Are you sure?". The preview derives from the same data the table
 * shows; the server re-validates everything through the contract.
 */
export const MoveMembersDialog = ({
  members,
  onDone,
  onOpenChange,
  open,
  orgSlug,
  units,
}: MoveMembersDialogProps) => {
  const [pending, startTransition] = useTransition();
  const [targetId, setTargetId] = useState<string | null>(null);
  const unitNames = new Map(
    units.map((unit) => [unit.id as string, unit.name])
  );
  const unitItems = Object.fromEntries(
    units.map((unit) => [unit.id as string, unit.name])
  );
  const target = targetId ?? units[0]?.id;
  const lines = target ? impactLines(members, unitNames, target) : [];
  const moving = members.filter((member) => member.unitId !== target).length;

  const onCancel = () => onOpenChange(false);

  const onConfirm = () => {
    if (!target) {
      return;
    }
    startTransition(async () => {
      const result = await moveMembers({
        memberIds: members.map((member) => member.id),
        orgSlug,
        unitId: target,
      });
      if (result.ok) {
        toast.success(
          `Moved ${result.data.length} ${result.data.length === 1 ? "person" : "people"} to ${unitNames.get(target) ?? "the unit"}`
        );
        onDone();
      } else {
        toast.error(result.error.message);
      }
    });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Move {members.length} {members.length === 1 ? "person" : "people"}
          </DialogTitle>
          <DialogDescription>
            Everyone selected becomes a member of the chosen unit.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="move-target">Target unit</FieldLabel>
            <Select
              items={unitItems}
              onValueChange={setTargetId}
              value={target ?? null}
            >
              <SelectTrigger id="move-target">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div>
            <p className="font-medium text-sm">Impact</p>
            <ul className="mt-1 flex flex-col gap-0.5 text-muted-foreground text-sm">
              {lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button disabled={pending || moving === 0} onClick={onConfirm}>
            {pending
              ? "Moving…"
              : `Apply ${moving} ${moving === 1 ? "change" : "changes"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
