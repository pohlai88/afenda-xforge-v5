import { buttonVariants } from "@xforge/design/blocks/common-button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  description: "A multi-tenant workspace, built surface-first.",
  title: "Home",
};

export default function Page() {
  return (
    <div className="flex min-h-svh items-center p-8">
      <div className="flex max-w-xl flex-col gap-6">
        <h1 className="font-semibold text-4xl tracking-tight">Afenda xForge</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          The surface is built first, against a typed contract; the backend is
          built to satisfy it. Open the demo workspace to see the first screens
          running on fixtures.
        </p>
        <div className="flex gap-3">
          <Link className={buttonVariants({ size: "lg" })} href="/acme">
            Open demo workspace
          </Link>
          <Link
            className={buttonVariants({ size: "lg", variant: "outline" })}
            href="/sign-in"
          >
            Sign in
          </Link>
        </div>
        <p className="font-mono text-muted-foreground text-xs">
          (Press <kbd>d</kbd> to toggle dark mode)
        </p>
      </div>
    </div>
  );
}
