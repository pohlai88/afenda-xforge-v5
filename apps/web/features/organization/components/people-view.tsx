"use client";

import type { Member, MemberFilter } from "@xforge/contracts/member/types";
import type { OrganizationUnitWithCount } from "@xforge/contracts/unit/types";
import { Avatar, AvatarFallback } from "@xforge/design/blocks/avatar";
import { Badge, type BadgeProps } from "@xforge/design/blocks/badge";
import { Checkbox } from "@xforge/design/components/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@xforge/design/components/table";
import { cn } from "@xforge/design/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, type ReactNode, useRef, useState } from "react";
import { BulkActionBar } from "./bulk-action-bar";
import { MoveMembersDialog } from "./move-members-dialog";
import { inspectorHref, workspaceHref } from "./workspace-links";

export interface PeopleViewProps {
  filter: MemberFilter;
  inspectedMemberId: string | undefined;
  members: readonly Member[];
  orgSlug: string;
  units: readonly OrganizationUnitWithCount[];
}

const joined = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeZone: "UTC",
});

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

// Same domain vocabulary as the members screen (AF-CMP-BADGE-002): owner
// wears the identity mark, statuses wear the status variant they mean.
const roleVariant: Readonly<Record<Member["role"], BadgeProps["variant"]>> = {
  admin: "neutral",
  member: "neutral",
  owner: "primary",
};

const statusVariant: Readonly<Record<Member["status"], BadgeProps["variant"]>> =
  {
    active: "positive",
    invited: "informative",
  };

interface RowProps {
  href: string;
  index: number;
  isInspected: boolean;
  isSelected: boolean;
  member: Member;
  onFocusIndex: (index: number) => void;
  onToggle: (memberId: string) => void;
  registerLink: (index: number, element: HTMLAnchorElement | null) => void;
  unitName: string | undefined;
}

const PeopleRow = (props: RowProps) => {
  const { member } = props;
  const onCheckedChange = () => props.onToggle(member.id);
  const onFocus = () => props.onFocusIndex(props.index);
  const setLinkRef = (element: HTMLAnchorElement | null) =>
    props.registerLink(props.index, element);
  return (
    <TableRow
      className={cn(
        props.isInspected && "bg-accent",
        !props.isInspected && props.isSelected && "bg-muted"
      )}
      data-selected={props.isSelected ? "true" : undefined}
    >
      <TableCell>
        <Checkbox
          aria-label={`Select ${member.name}`}
          checked={props.isSelected}
          onCheckedChange={onCheckedChange}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{initials(member.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <Link
              className="truncate rounded-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href={props.href}
              onFocus={onFocus}
              ref={setLinkRef}
            >
              {member.name}
            </Link>
            <p className="truncate text-muted-foreground text-xs">
              {member.email}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className={cn(!member.title && "text-muted-foreground")}>
        {member.title ?? "—"}
      </TableCell>
      <TableCell className={cn(!props.unitName && "text-muted-foreground")}>
        {props.unitName ?? "Unassigned"}
      </TableCell>
      <TableCell>
        <Badge variant={roleVariant[member.role]}>{member.role}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant={statusVariant[member.status]}>{member.status}</Badge>
      </TableCell>
      <TableCell className="tabular-nums">
        {joined.format(new Date(member.joinedAt))}
      </TableCell>
    </TableRow>
  );
};

/**
 * The people workspace: rows inspect (never navigate away), selection feeds
 * the floating bulk bar, and j/k/x/Escape make long review sessions fast.
 * The inspector, scope and filters all live in the URL — this component owns
 * only what dies with the page: selection and row focus.
 */
export const PeopleView = ({
  children,
  filter,
  inspectedMemberId,
  members,
  orgSlug,
  units,
}: PeopleViewProps & { children?: ReactNode }) => {
  const router = useRouter();
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [moveOpen, setMoveOpen] = useState(false);
  const focusIndex = useRef(0);
  const links = useRef(new Map<number, HTMLAnchorElement>());

  const unitNames = new Map(
    units.map((unit) => [unit.id as string, unit.name])
  );
  // Stale ids (paged or filtered away) stay in state harmlessly; everything
  // visible-facing derives from the intersection with the current page.
  const activeSelected = members.filter((member) => selected.has(member.id));
  const allSelected =
    members.length > 0 && activeSelected.length === members.length;

  const onToggle = (memberId: string) => {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(memberId)) {
        next.delete(memberId);
      } else {
        next.add(memberId);
      }
      return next;
    });
  };

  const onToggleAll = () => {
    setSelected(
      allSelected ? new Set() : new Set(members.map((member) => member.id))
    );
  };

  const onClear = () => setSelected(new Set());

  const onMove = () => setMoveOpen(true);

  const onMoved = () => {
    setMoveOpen(false);
    setSelected(new Set());
  };

  const onFocusIndex = (index: number) => {
    focusIndex.current = index;
  };

  const registerLink = (index: number, element: HTMLAnchorElement | null) => {
    if (element) {
      links.current.set(index, element);
    } else {
      links.current.delete(index);
    }
  };

  const focusRow = (index: number) => {
    const bounded = Math.min(Math.max(index, 0), members.length - 1);
    links.current.get(bounded)?.focus();
  };

  const toggleFocusedRow = () => {
    const member = members[focusIndex.current];
    if (member) {
      onToggle(member.id);
    }
  };

  // Escape peels only the topmost layer: selection first, then the inspector.
  const onEscape = () => {
    if (selected.size > 0) {
      onClear();
    } else if (inspectedMemberId) {
      router.push(workspaceHref(orgSlug, filter, "people"));
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }
    if (event.key === "ArrowDown" || event.key === "j") {
      event.preventDefault();
      focusRow(focusIndex.current + 1);
    } else if (event.key === "ArrowUp" || event.key === "k") {
      event.preventDefault();
      focusRow(focusIndex.current - 1);
    } else if (event.key === "x") {
      event.preventDefault();
      toggleFocusedRow();
    } else if (event.key === "Escape") {
      onEscape();
    }
  };

  if (members.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No people match this scope and filter.
      </p>
    );
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: the wrapper only relays j/k/x/Escape shortcuts from the interactive rows it contains; every action stays reachable without it, so it is not itself a control.
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: same reason — a keyboard-shortcut relay, not a control.
    <div onKeyDown={onKeyDown}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                aria-label="Select everyone on this page"
                checked={allSelected}
                indeterminate={activeSelected.length > 0 && !allSelected}
                onCheckedChange={onToggleAll}
              />
            </TableHead>
            <TableHead>Member</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member, index) => (
            <PeopleRow
              href={inspectorHref(orgSlug, filter, member.id)}
              index={index}
              isInspected={member.id === inspectedMemberId}
              isSelected={selected.has(member.id)}
              key={member.id}
              member={member}
              onFocusIndex={onFocusIndex}
              onToggle={onToggle}
              registerLink={registerLink}
              unitName={
                member.unitId === null
                  ? undefined
                  : unitNames.get(member.unitId)
              }
            />
          ))}
        </TableBody>
      </Table>
      {children}
      {activeSelected.length > 0 ? (
        <BulkActionBar
          count={activeSelected.length}
          onClear={onClear}
          onMove={onMove}
        />
      ) : null}
      <MoveMembersDialog
        members={activeSelected}
        onDone={onMoved}
        onOpenChange={setMoveOpen}
        open={moveOpen}
        orgSlug={orgSlug}
        units={units}
      />
    </div>
  );
};
