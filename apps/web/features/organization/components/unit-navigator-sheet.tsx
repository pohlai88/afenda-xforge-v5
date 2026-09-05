"use client";

import type { MemberFilter } from "@xforge/contracts/member/types";
import type { OrganizationUnitWithCount } from "@xforge/contracts/unit/types";
import { Button } from "@xforge/design/blocks/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@xforge/design/components/sheet";
import { PanelLeft } from "lucide-react";
import { useState } from "react";
import type { WorkspaceView } from "../filter";
import { UnitNavigator } from "./unit-navigator";

/**
 * Under the desktop breakpoint the navigator becomes a sheet — the spatial
 * model changes, the capability does not. Navigating closes it.
 */
export const UnitNavigatorSheet = ({
  activeUnitId,
  filter,
  orgSlug,
  units,
  view,
}: Readonly<{
  activeUnitId: string | undefined;
  filter: MemberFilter;
  orgSlug: string;
  units: readonly OrganizationUnitWithCount[];
  view: WorkspaceView;
}>) => {
  const [open, setOpen] = useState(false);
  const onNavigate = () => setOpen(false);
  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger render={<Button size="sm" variant="outline" />}>
        <PanelLeft aria-hidden />
        Structure
      </SheetTrigger>
      <SheetContent className="overflow-y-auto" side="left">
        <SheetHeader>
          <SheetTitle>Organization structure</SheetTitle>
          <SheetDescription>
            Pick a scope for the current workspace.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          <UnitNavigator
            activeUnitId={activeUnitId}
            filter={filter}
            onNavigate={onNavigate}
            orgSlug={orgSlug}
            units={units}
            view={view}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
