"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cn } from "cn";
import { AVATAR_MANIFEST } from "./avatar-manifest";

/**
 * The Avatar block — AF-CMP-AVATAR. Defined, not rendered: every class comes
 * from ./avatar-manifest.ts, the contract is ./avatar-contract.ts, and R15
 * holds the three equal. Image load and error handling come from Base UI:
 * the fallback shows until the image resolves, and again if it fails.
 */

// Slots are key references into the definition, so a typo fails the compile
// and the render never restates identity as a free literal.
const SLOT = {
  fallback: "avatar-fallback",
  image: "avatar-image",
  root: "avatar",
} as const satisfies Record<string, keyof typeof AVATAR_MANIFEST.parts>;

const classesOf = (slot: keyof typeof AVATAR_MANIFEST.parts): string =>
  AVATAR_MANIFEST.parts[slot].base.join(" ");

/**
 * Base UI also accepts a function of component state for className; the block
 * does not — every class it draws lives in the manifest, where Tailwind's
 * scanner and R15 both read it.
 */
type PartProps<P> = Omit<P, "className"> & { className?: string };

function Avatar({
  className,
  ...props
}: PartProps<AvatarPrimitive.Root.Props>) {
  return (
    <AvatarPrimitive.Root
      className={cn(classesOf(SLOT.root), className)}
      data-slot={SLOT.root}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: PartProps<AvatarPrimitive.Image.Props>) {
  return (
    <AvatarPrimitive.Image
      className={cn(classesOf(SLOT.image), className)}
      data-slot={SLOT.image}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: PartProps<AvatarPrimitive.Fallback.Props>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(classesOf(SLOT.fallback), className)}
      data-slot={SLOT.fallback}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };
