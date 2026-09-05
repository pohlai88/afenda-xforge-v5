import type { Member } from "@xforge/contracts/member/types";
import type { OrganizationUnitWithCount } from "@xforge/contracts/unit/types";
import { Avatar, AvatarFallback } from "@xforge/design/blocks/avatar";
import { Badge } from "@xforge/design/blocks/badge";
import { Button, buttonVariants } from "@xforge/design/blocks/button";
import { Separator } from "@xforge/design/components/separator";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import Link from "next/link";
import { EditMemberSheet } from "./edit-member-sheet";

const joined = new Intl.DateTimeFormat("en", {
  dateStyle: "long",
  timeZone: "UTC",
});

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

const iconLink = buttonVariants({ size: "icon-sm", variant: "ghost" });

interface InspectorProps {
  closeHref: string;
  member: Member;
  nextHref: string | undefined;
  orgSlug: string;
  prevHref: string | undefined;
  unitName: string | undefined;
  units: readonly OrganizationUnitWithCount[];
}

const Row = ({
  label,
  value,
}: Readonly<{ label: string; value: string | undefined }>) => (
  <div className="flex flex-col gap-0.5">
    <dt className="text-muted-foreground text-xs">{label}</dt>
    <dd className={value ? "text-sm" : "text-muted-foreground text-sm"}>
      {value ?? "—"}
    </dd>
  </div>
);

/**
 * Inspecting never navigates away: this panel rides beside the table, its
 * subject lives in the URL (`?member=`), and prev/next walk the current page
 * without losing scope, filters or selection.
 */
export const MemberInspector = ({
  closeHref,
  member,
  nextHref,
  orgSlug,
  prevHref,
  unitName,
  units,
}: InspectorProps) => (
  <aside
    aria-label={`Details for ${member.name}`}
    className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4"
  >
    <div className="flex items-start justify-between gap-2">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar>
          <AvatarFallback>{initials(member.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h2 className="truncate font-medium">{member.name}</h2>
          <p className="truncate text-muted-foreground text-xs">
            {member.email}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center">
        {prevHref ? (
          <Link
            aria-label="Previous member"
            className={iconLink}
            href={prevHref}
          >
            <ChevronUp />
          </Link>
        ) : (
          <Button
            aria-label="Previous member"
            disabled
            size="icon-sm"
            variant="ghost"
          >
            <ChevronUp />
          </Button>
        )}
        {nextHref ? (
          <Link aria-label="Next member" className={iconLink} href={nextHref}>
            <ChevronDown />
          </Link>
        ) : (
          <Button
            aria-label="Next member"
            disabled
            size="icon-sm"
            variant="ghost"
          >
            <ChevronDown />
          </Button>
        )}
        <Link
          aria-label="Close inspector"
          className={iconLink}
          href={closeHref}
        >
          <X />
        </Link>
      </div>
    </div>
    <div className="flex gap-2">
      <Badge variant={member.status === "active" ? "positive" : "informative"}>
        {member.status}
      </Badge>
      <Badge variant={member.role === "owner" ? "primary" : "neutral"}>
        {member.role}
      </Badge>
    </div>
    <Separator />
    <dl className="flex flex-col gap-3">
      <Row label="Title" value={member.title ?? undefined} />
      <Row label="Unit" value={unitName} />
      <Row label="Joined" value={joined.format(new Date(member.joinedAt))} />
    </dl>
    <Separator />
    <div>
      <EditMemberSheet
        key={member.id}
        member={member}
        orgSlug={orgSlug}
        units={units}
      />
    </div>
  </aside>
);
