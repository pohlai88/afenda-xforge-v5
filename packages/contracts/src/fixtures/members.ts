import { memberIdSchema } from "../ids";
import type { Member, MemberRole, MemberStatus } from "../member/types";
import { organizations } from "./organizations";
import { dayAfterEpoch, id } from "./seed";

type Seed = readonly [
  name: string,
  email: string,
  role: MemberRole,
  status: MemberStatus,
];

let counter = 0;

const make = (
  organizationId: Member["organizationId"],
  seeds: readonly Seed[]
) =>
  seeds.map(([name, email, role, status]): Member => {
    counter += 1;
    return {
      email,
      id: memberIdSchema.parse(id("mem", counter)),
      joinedAt: dayAfterEpoch(counter),
      name,
      organizationId,
      role,
      status,
    };
  });

// Synthetic people on the reserved .example TLD — never real data.
export const acmeMembers: readonly Member[] = make(organizations.acme.id, [
  ["Ada Lovelace", "ada@acme.example", "owner", "active"],
  ["Grace Hopper", "grace@acme.example", "owner", "active"],
  ["Katherine Johnson", "katherine@acme.example", "admin", "active"],
  ["Margaret Hamilton", "margaret@acme.example", "admin", "active"],
  ["Radia Perlman", "radia@acme.example", "member", "active"],
  ["Barbara Liskov", "barbara@acme.example", "member", "active"],
  ["Frances Allen", "frances@acme.example", "member", "active"],
  ["Hedy Lamarr", "hedy@acme.example", "member", "invited"],
]);

export const northwindMembers: readonly Member[] = make(
  organizations.northwind.id,
  [
    ["Annie Easley", "annie@northwind.example", "owner", "active"],
    ["Mary Jackson", "mary@northwind.example", "member", "active"],
    ["Dorothy Vaughan", "dorothy@northwind.example", "member", "active"],
  ]
);

export const memberList: readonly Member[] = [
  ...acmeMembers,
  ...northwindMembers,
];
