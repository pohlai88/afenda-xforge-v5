"use client";

import { Button } from "@xforge/design/blocks/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@xforge/design/blocks/dialog";
import { Field, FieldError, FieldLabel } from "@xforge/design/components/field";
import { Input } from "@xforge/design/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@xforge/design/components/select";
import { useActionState, useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { inviteMember } from "../actions";

const roles = ["member", "admin", "owner"] as const;
const roleItems = { admin: "admin", member: "member", owner: "owner" };

const errorsFor = (fields: Record<string, string[]> | undefined, key: string) =>
  fields?.[key]?.map((message) => ({ message }));

export const InviteMemberDialog = ({
  orgSlug,
}: Readonly<{ orgSlug: string }>) => {
  const [open, setOpen] = useState(false);
  const [result, formAction, pending] = useActionState(inviteMember, null);
  const submitLabelId = useId();

  useEffect(() => {
    if (result?.ok) {
      toast.success(`Invited ${result.data.name}`);
      setOpen(false);
    }
  }, [result]);

  const failure = result && !result.ok ? result.error : undefined;
  const nameErrors = errorsFor(failure?.fields, "name");
  const emailErrors = errorsFor(failure?.fields, "email");
  const formMessage = failure && !failure.fields ? failure.message : undefined;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={<Button />}>Invite member</DialogTrigger>
      <DialogContent>
        <form action={formAction} className="flex flex-col gap-5">
          <input name="orgSlug" type="hidden" value={orgSlug} />
          <DialogHeader>
            <DialogTitle>Invite a member</DialogTitle>
            <DialogDescription>
              They appear as invited until they accept.
            </DialogDescription>
          </DialogHeader>
          <Field data-invalid={Boolean(nameErrors)}>
            <FieldLabel htmlFor="invite-name">Name</FieldLabel>
            <Input
              aria-describedby={nameErrors ? "invite-name-error" : undefined}
              aria-invalid={Boolean(nameErrors)}
              autoComplete="off"
              id="invite-name"
              name="name"
              required
            />
            {nameErrors ? (
              <FieldError errors={nameErrors} id="invite-name-error" />
            ) : null}
          </Field>
          <Field data-invalid={Boolean(emailErrors)}>
            <FieldLabel htmlFor="invite-email">Email</FieldLabel>
            <Input
              aria-describedby={emailErrors ? "invite-email-error" : undefined}
              aria-invalid={Boolean(emailErrors)}
              autoComplete="off"
              id="invite-email"
              name="email"
              required
              type="email"
            />
            {emailErrors ? (
              <FieldError errors={emailErrors} id="invite-email-error" />
            ) : null}
          </Field>
          <Field>
            <FieldLabel htmlFor="invite-role">Role</FieldLabel>
            <Select defaultValue="member" items={roleItems} name="role">
              <SelectTrigger id="invite-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
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
          <DialogFooter>
            {/* The handbook's loading pattern: focus survives the pending
                submit, and the changing text is the explicit accessible
                name (descendant-text changes are not reliably announced). */}
            <Button
              aria-labelledby={submitLabelId}
              disabled={pending}
              focusableWhenDisabled
              type="submit"
            >
              <span id={submitLabelId}>
                {pending ? "Inviting…" : "Send invite"}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
