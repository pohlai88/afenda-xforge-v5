import { Skeleton } from "@xforge/design/components/skeleton";

const rows = ["a", "b", "c", "d", "e", "f"];

export default function OrganizationLoading() {
  return (
    <output aria-label="Loading organization workspace" className="block">
      <Skeleton className="mb-6 h-8 w-48" />
      <Skeleton className="mb-4 h-9 w-64" />
      <div className="flex gap-6">
        <div className="hidden w-56 shrink-0 flex-col gap-2 lg:flex">
          {rows.slice(0, 4).map((row) => (
            <Skeleton className="h-7 w-full" key={row} />
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {rows.map((row) => (
            <Skeleton className="h-10 w-full" key={row} />
          ))}
        </div>
      </div>
    </output>
  );
}
