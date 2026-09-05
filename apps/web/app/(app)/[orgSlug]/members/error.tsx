"use client";

import { Button } from "@xforge/design/blocks/common-button";

// Unexpected failures only: expected outcomes never throw (they are
// ActionResults or notFound()). Whatever reaches here is operational.
export default function MembersError({
  error,
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="font-semibold text-2xl tracking-tight">
        Members could not be loaded
      </h1>
      <p className="max-w-md text-muted-foreground">
        Something failed while fetching this list. Try again; if it keeps
        happening, the reference is{" "}
        <code className="font-mono text-xs">
          {error.digest ?? "unavailable"}
        </code>
        .
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
