"use client";

import type {
  MemberFilter,
  MemberRole,
  MemberStatus,
} from "@xforge/contracts/member/types";
import { Input } from "@xforge/design/components/input";
import { Label } from "@xforge/design/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@xforge/design/components/select";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import {
  type WorkspaceView,
  workspacePath,
  workspaceQueryString,
} from "../filter";

const ANY = "any";
const DEBOUNCE_MS = 300;
const roles: readonly MemberRole[] = ["owner", "admin", "member"];
const statuses: readonly MemberStatus[] = ["active", "invited"];
const roleItems = {
  [ANY]: "Any role",
  admin: "admin",
  member: "member",
  owner: "owner",
};
const statusItems = {
  [ANY]: "Any status",
  active: "active",
  invited: "invited",
};

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable);

/**
 * Writes the filter into the URL — the URL is the state store for shareable
 * views. Scope (`unit`) and the open inspector survive a filter change.
 */
export const WorkspaceFilters = ({
  filter,
  memberId,
  orgSlug,
  view,
}: Readonly<{
  filter: MemberFilter;
  memberId: string | undefined;
  orgSlug: string;
  view: WorkspaceView;
}>) => {
  const router = useRouter();
  const [query, setQuery] = useState(filter.query ?? "");
  const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => clearTimeout(debounce.current), []);

  // The `/` hotkey focuses workspace search — an enhancement, never a trap.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "/" &&
        !(event.ctrlKey || event.metaKey || event.altKey) &&
        !isTypingTarget(event.target)
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const navigate = (next: Partial<MemberFilter>) => {
    router.replace(
      `${workspacePath(orgSlug)}${workspaceQueryString({
        filter: { ...filter, ...next, page: 1 },
        memberId,
        view,
      })}`
    );
  };

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setQuery(value);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(
      () => navigate({ query: value || undefined }),
      DEBOUNCE_MS
    );
  };

  const onRoleChange = (value: string | null) =>
    navigate({
      role: !value || value === ANY ? undefined : (value as MemberRole),
    });

  const onStatusChange = (value: string | null) =>
    navigate({
      status: !value || value === ANY ? undefined : (value as MemberStatus),
    });

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="workspace-query">Search</Label>
        <Input
          className="w-64"
          id="workspace-query"
          onChange={onQueryChange}
          placeholder="Name, email or title"
          ref={searchRef}
          type="search"
          value={query}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="workspace-role">Role</Label>
        <Select
          items={roleItems}
          onValueChange={onRoleChange}
          value={filter.role ?? ANY}
        >
          <SelectTrigger className="w-36" id="workspace-role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>Any role</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="workspace-status">Status</Label>
        <Select
          items={statusItems}
          onValueChange={onStatusChange}
          value={filter.status ?? ANY}
        >
          <SelectTrigger className="w-36" id="workspace-status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>Any status</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
