import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { classMap } from "../manifest";
import { COMMON_BUTTON_MANIFEST } from "./common-button-manifest";

/**
 * The Button block — AF-CMP-COMMON-BUTTON. Defined, not rendered: every class
 * comes from ./common-button-manifest.ts, the contract is
 * ./common-button-contract.ts, and R15 holds the three equal.
 * Focus, disabled and invalid presentation come from af-interactive;
 * hover is the state layer at the governed opacity.
 */

// The slot is a key reference into the definition, so a typo fails the
// compile and the render never restates identity as a free literal.
const SLOT = "button" satisfies keyof typeof COMMON_BUTTON_MANIFEST.parts;
const part = COMMON_BUTTON_MANIFEST.parts[SLOT];

const buttonVariants = cva(part.base.join(" "), {
  defaultVariants: {
    size: "default",
    variant: "default",
  },
  variants: {
    size: classMap(part.sizes),
    variant: classMap(part.variants),
  },
});

interface ButtonProps
  extends Omit<ButtonPrimitive.Props, "className">,
    VariantProps<typeof buttonVariants> {
  /**
   * Base UI also accepts a function of component state here; the block does
   * not. Every class it draws comes from the manifest, where Tailwind's
   * scanner and R15 both read it — and clsx drops a function silently, so
   * the wider type would promise what nothing delivers.
   */
  className?: string;
}

function Button({
  className,
  size = "default",
  variant = "default",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ className, size, variant }))}
      data-slot={SLOT}
      {...props}
    />
  );
}

export type { ButtonProps };
export { Button, buttonVariants };
