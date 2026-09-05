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
import { usePathname, useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { memberListQueryString } from "../filter";

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

/** Writes the filter into the URL — the URL is the state store for shareable views. */
export const MembersFilters = ({
  filter,
}: Readonly<{ filter: MemberFilter }>) => {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(filter.query ?? "");
  const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(debounce.current), []);

  const navigate = (next: Partial<MemberFilter>) => {
    router.replace(
      `${pathname}${memberListQueryString({ ...filter, ...next, page: 1 })}`
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
    <div className="mb-4 flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="members-query">Search</Label>
        <Input
          className="w-64"
          id="members-query"
          onChange={onQueryChange}
          placeholder="Name or email"
          type="search"
          value={query}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="members-role">Role</Label>
        <Select
          items={roleItems}
          onValueChange={onRoleChange}
          value={filter.role ?? ANY}
        >
          <SelectTrigger className="w-40" id="members-role">
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
        <Label htmlFor="members-status">Status</Label>
        <Select
          items={statusItems}
          onValueChange={onStatusChange}
          value={filter.status ?? ANY}
        >
          <SelectTrigger className="w-40" id="members-status">
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
