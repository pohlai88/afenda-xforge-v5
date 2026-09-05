"use client";

import { Button } from "@xforge/design/blocks/button";
import { X } from "lucide-react";

/**
 * The floating bar for multi-object actions. It exists only while something
 * is selected — never a permanent toolbar (the digest's rule, verbatim).
 */
export const BulkActionBar = ({
  count,
  onClear,
  onMove,
}: Readonly<{ count: number; onClear: () => void; onMove: () => void }>) => (
  <div className="fixed inset-x-0 bottom-4 flex justify-center px-4">
    <div className="flex items-center gap-3 rounded-lg border border-border bg-popover px-4 py-2 shadow-lg">
      <p className="text-sm tabular-nums">
        <span className="font-medium">{count}</span> selected
      </p>
      <Button onClick={onMove} size="sm" variant="outline">
        Move to unit…
      </Button>
      <Button
        aria-label="Clear selection"
        onClick={onClear}
        size="icon-sm"
        variant="ghost"
      >
        <X />
      </Button>
    </div>
  </div>
);
