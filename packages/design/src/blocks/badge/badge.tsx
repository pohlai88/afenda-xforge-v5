import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { classMap } from "../manifest";
import { BADGE_MANIFEST } from "./badge-manifest";

/**
 * The Badge block — AF-CMP-BADGE. Defined, not rendered: every class comes
 * from ./badge-manifest.ts, the contract is ./badge-contract.ts, and R15
 * holds the three equal. Read-only by contract: no state layer, no hover,
 * no focus of its own. There is no primitive behind a badge, so the render
 * is useRender + mergeProps (the styled-part pattern), and the slot rides
 * useRender's state, which Base UI serialises onto the element.
 */

// The slot is a key reference into the definition, so a typo fails the
// compile and the render never restates identity as a free literal.
const SLOT = "badge" satisfies keyof typeof BADGE_MANIFEST.parts;
const part = BADGE_MANIFEST.parts[SLOT];

const badgeVariants = cva(part.base.join(" "), {
  defaultVariants: {
    variant: "neutral",
  },
  variants: {
    variant: classMap(part.variants),
  },
});

interface BadgeProps
  extends Omit<useRender.ComponentProps<"span">, "className">,
    VariantProps<typeof badgeVariants> {
  /**
   * Base UI also accepts a function of component state here; the block does
   * not. Every class it draws comes from the manifest, where Tailwind's
   * scanner and R15 both read it.
   */
  className?: string;
}

function Badge({
  className,
  render,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ className, variant })),
      },
      props
    ),
    render,
    state: {
      slot: SLOT,
    },
  });
}

export type { BadgeProps };
export { Badge, badgeVariants };
