import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { classMap } from "../manifest";
import { COMMON_BUTTON_MANIFEST } from "./manifest";

/**
 * The Button block — AF-CMP-COMMON-BUTTON. Defined, not rendered: every class
 * comes from ./manifest.ts, the contract lives in
 * foundation/10-components/common-button.ts, and R15 holds the three equal.
 * Focus, disabled and invalid presentation come from af-interactive;
 * hover is the state layer at the governed opacity.
 */
const buttonVariants = cva(COMMON_BUTTON_MANIFEST.base.join(" "), {
  defaultVariants: {
    size: "default",
    variant: "default",
  },
  variants: {
    size: classMap(COMMON_BUTTON_MANIFEST.sizes),
    variant: classMap(COMMON_BUTTON_MANIFEST.variants),
  },
});

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ className, size, variant }))}
      data-slot={COMMON_BUTTON_MANIFEST.slot}
      {...props}
    />
  );
}

export { Button, buttonVariants };
