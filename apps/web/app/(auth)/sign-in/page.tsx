import { Button } from "@xforge/design/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@xforge/design/components/card";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Authentication arrives with Better Auth (architecture §5.5). Until
            then, the demo workspace is open.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/acme">Continue to the demo workspace</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
