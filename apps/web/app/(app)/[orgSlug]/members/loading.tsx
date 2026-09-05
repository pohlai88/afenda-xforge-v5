import { Skeleton } from "@xforge/design/components/skeleton";

const rows = ["a", "b", "c", "d", "e"];

export default function MembersLoading() {
  return (
    <output aria-label="Loading members" className="block">
      <Skeleton className="mb-6 h-8 w-40" />
      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <Skeleton className="h-10 w-full" key={row} />
        ))}
      </div>
    </output>
  );
}
