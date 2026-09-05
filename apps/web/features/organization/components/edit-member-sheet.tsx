"use client";

import type { Member } from "@xforge/contracts/member/types";
import type { OrganizationUnitWithCount } from "@xforge/contracts/unit/types";
import { Button } from "@xforge/design/blocks/button";
import { Field, FieldError, FieldLabel } from "@xforge/design/components/field";
import { Input } from "@xforge/design/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@xforge/design/components/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@xforge/design/components/sheet";
import { useActionState, useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { updateMember } from "../actions";
import { UNASSIGNED_UNIT } from "../constants";

const errorsFor = (fields: Record<string, string[]> | undefined, key: string) =>
  fields?.[key]?.map((message) => ({ message }));

/**
 * Editing one object is a Sheet: the workspace stays mounted underneath and
 * context survives. Fields are the contract's — one zod definition validates
 * here and in the server action.
 */
export const EditMemberSheet = ({
  member,
  orgSlug,
  units,
}: Readonly<{
  member: Member;
  orgSlug: string;
  units: readonly OrganizationUnitWithCount[];
}>) => {
  const [open, setOpen] = useState(false);
  const [result, formAction, pending] = useActionState(updateMember, null);
  const submitLabelId = useId();
  const unitItems = {
    [UNASSIGNED_UNIT]: "No unit",
    ...Object.fromEntries(units.map((unit) => [unit.id as string, unit.name])),
  };

  useEffect(() => {
    if (result?.ok) {
      toast.success(`Saved ${result.data.name}`);
      setOpen(false);
    }
  }, [result]);

  const failure = result && !result.ok ? result.error : undefined;
  const nameErrors = errorsFor(failure?.fields, "name");
  const titleErrors = errorsFor(failure?.fields, "title");
  const formMessage = failure && !failure.fields ? failure.message : undefined;

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger render={<Button variant="outline" />}>Edit</SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <form action={formAction} className="flex h-full flex-col">
          <input name="orgSlug" type="hidden" value={orgSlug} />
          <input name="memberId" type="hidden" value={member.id} />
          <SheetHeader>
            <SheetTitle>Edit {member.name}</SheetTitle>
            <SheetDescription>
              Changes apply to this workspace only.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-5 p-4">
            <Field data-invalid={Boolean(nameErrors)}>
              <FieldLabel htmlFor="edit-name">Name</FieldLabel>
              <Input
                aria-describedby={nameErrors ? "edit-name-error" : undefined}
                aria-invalid={Boolean(nameErrors)}
                autoComplete="off"
                defaultValue={member.name}
                id="edit-name"
                name="name"
                required
              />
              {nameErrors ? (
                <FieldError errors={nameErrors} id="edit-name-error" />
              ) : null}
            </Field>
            <Field data-invalid={Boolean(titleErrors)}>
              <FieldLabel htmlFor="edit-title">Title</FieldLabel>
              <Input
                aria-describedby={titleErrors ? "edit-title-error" : undefined}
                aria-invalid={Boolean(titleErrors)}
                autoComplete="off"
                defaultValue={member.title ?? ""}
                id="edit-title"
                name="title"
                placeholder="No title"
              />
              {titleErrors ? (
                <FieldError errors={titleErrors} id="edit-title-error" />
              ) : null}
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-unit">Unit</FieldLabel>
              <Select
                defaultValue={member.unitId ?? UNASSIGNED_UNIT}
                items={unitItems}
                name="unitId"
              >
                <SelectTrigger id="edit-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UNASSIGNED_UNIT}>No unit</SelectItem>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            {formMessage ? (
              <p className="text-destructive text-sm" role="alert">
                {formMessage}
              </p>
            ) : null}
          </div>
          <SheetFooter>
            {/* The loading pattern: focus survives the pending submit, and
                the changing text is the explicit accessible name. */}
            <Button
              aria-labelledby={submitLabelId}
              disabled={pending}
              focusableWhenDisabled
              type="submit"
            >
              <span id={submitLabelId}>
                {pending ? "Saving…" : "Save changes"}
              </span>
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
