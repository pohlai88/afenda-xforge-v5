import { Button } from "@xforge/design/components/button";
import Link from "next/link";

// Catches notFound() from the [orgSlug] layout (a segment's own not-found
// only covers its children). Never echoes the slug: "does not exist" and "exists but not yours" must
// read the same once authentication arrives.
export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="font-semibold text-2xl tracking-tight">
        Workspace unavailable
      </h1>
      <p className="max-w-md text-muted-foreground">
        The workspace you asked for does not exist or is not available to you.
      </p>
      <Button render={<Link href="/" />} variant="outline">
        Back to the start
      </Button>
    </div>
  );
}
