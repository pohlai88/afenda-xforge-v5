import { Button } from "@xforge/design/components/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="font-semibold text-2xl tracking-tight">Page not found</h1>
      <p className="max-w-md text-muted-foreground">
        There is nothing at this address.
      </p>
      <Button render={<Link href="/" />} variant="outline">
        Back to the start
      </Button>
    </div>
  );
}
