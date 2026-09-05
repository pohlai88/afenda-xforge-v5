"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "cn";
import { XIcon } from "lucide-react";
import type * as React from "react";
import { Button } from "../common-button";
import { DIALOG_MANIFEST } from "./manifest";

/**
 * The Dialog block — AF-CMP-DIALOG. Defined, not rendered: every class comes
 * from ./manifest.ts, the contract lives in foundation/10-components/dialog.ts,
 * and R15 holds the three equal. Focus trap, Escape, initial focus, focus
 * return and the title/description aria wiring come from Base UI; enter and
 * exit ride af-motion-popup / af-motion-veil at the overlay motion role. The
 * close affordance is anatomy — always stamped, no showCloseButton.
 */

// Slots are key references into the definition, so a typo fails the compile
// and the render never restates identity as a free literal.
const SLOT = {
  close: "dialog-close",
  content: "dialog-content",
  description: "dialog-description",
  footer: "dialog-footer",
  header: "dialog-header",
  overlay: "dialog-overlay",
  title: "dialog-title",
  trigger: "dialog-trigger",
} as const satisfies Record<string, keyof typeof DIALOG_MANIFEST.parts>;

const classesOf = (slot: keyof typeof DIALOG_MANIFEST.parts): string =>
  DIALOG_MANIFEST.parts[slot].base.join(" ");

/**
 * Base UI also accepts a function of component state for className; the block
 * does not — every class it draws lives in the manifest, where Tailwind's
 * scanner and R15 both read it.
 */
type PartProps<P> = Omit<P, "className"> & { className?: string };

function Dialog(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root {...props} />;
}

function DialogTrigger({
  className,
  ...props
}: PartProps<DialogPrimitive.Trigger.Props>) {
  return (
    <DialogPrimitive.Trigger
      className={cn(classesOf(SLOT.trigger), className)}
      data-slot={SLOT.trigger}
      {...props}
    />
  );
}

function DialogClose({
  className,
  ...props
}: PartProps<DialogPrimitive.Close.Props>) {
  return (
    <DialogPrimitive.Close
      className={className}
      data-slot={SLOT.close}
      {...props}
    />
  );
}

function DialogContent({
  children,
  className,
  ...props
}: PartProps<DialogPrimitive.Popup.Props>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop
        className={classesOf(SLOT.overlay)}
        data-motion-role="overlay"
        data-slot={SLOT.overlay}
      />
      <DialogPrimitive.Popup
        className={cn(classesOf(SLOT.content), className)}
        data-motion-role="overlay"
        data-slot={SLOT.content}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          data-slot={SLOT.close}
          render={
            <Button
              aria-label="Close"
              className={classesOf(SLOT.close)}
              size="icon-sm"
              variant="ghost"
            />
          }
        >
          <XIcon />
        </DialogPrimitive.Close>
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(classesOf(SLOT.header), className)}
      data-slot={SLOT.header}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(classesOf(SLOT.footer), className)}
      data-slot={SLOT.footer}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: PartProps<DialogPrimitive.Title.Props>) {
  return (
    <DialogPrimitive.Title
      className={cn(classesOf(SLOT.title), className)}
      data-slot={SLOT.title}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: PartProps<DialogPrimitive.Description.Props>) {
  return (
    <DialogPrimitive.Description
      className={cn(classesOf(SLOT.description), className)}
      data-slot={SLOT.description}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
