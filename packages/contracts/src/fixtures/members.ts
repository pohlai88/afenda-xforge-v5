import { memberIdSchema } from "../ids";
import type { Member, MemberRole, MemberStatus } from "../member/types";
import { organizations } from "./organizations";
import { dayAfterEpoch, id } from "./seed";
import { acmeUnits, glitchUnits, northwindUnits, orbitUnits } from "./units";

type Seed = readonly [
  name: string,
  email: string,
  role: MemberRole,
  status: MemberStatus,
  title: string | null,
  unitId: Member["unitId"],
];

let counter = 0;

const make = (
  organizationId: Member["organizationId"],
  seeds: readonly Seed[]
) =>
  seeds.map(([name, email, role, status, title, unitId]): Member => {
    counter += 1;
    return {
      email,
      id: memberIdSchema.parse(id("mem", counter)),
      joinedAt: dayAfterEpoch(counter),
      name,
      organizationId,
      role,
      status,
      title,
      unitId,
    };
  });

const [acmeGroup, acmeOperations, acmeSupport, acmeFinance] = acmeUnits.map(
  (unit) => unit.id
);
const [northwindHq] = northwindUnits.map((unit) => unit.id);
const [orbitLab] = orbitUnits.map((unit) => unit.id);
const [glitchWorks] = glitchUnits.map((unit) => unit.id);

// Synthetic people on the reserved .example TLD — never real data. Hedy and
// Dorothy are deliberately unassigned: the workspace surfaces that fact.
export const acmeMembers: readonly Member[] = make(organizations.acme.id, [
  [
    "Ada Lovelace",
    "ada@acme.example",
    "owner",
    "active",
    "Chief Executive",
    acmeGroup ?? null,
  ],
  [
    "Grace Hopper",
    "grace@acme.example",
    "owner",
    "active",
    "Chief Operating Officer",
    acmeOperations ?? null,
  ],
  [
    "Katherine Johnson",
    "katherine@acme.example",
    "admin",
    "active",
    "Operations Manager",
    acmeOperations ?? null,
  ],
  [
    "Margaret Hamilton",
    "margaret@acme.example",
    "admin",
    "active",
    "Finance Manager",
    acmeFinance ?? null,
  ],
  [
    "Radia Perlman",
    "radia@acme.example",
    "member",
    "active",
    "Support Engineer",
    acmeSupport ?? null,
  ],
  [
    "Barbara Liskov",
    "barbara@acme.example",
    "member",
    "active",
    "Accountant",
    acmeFinance ?? null,
  ],
  [
    "Frances Allen",
    "frances@acme.example",
    "member",
    "active",
    "Support Engineer",
    acmeSupport ?? null,
  ],
  ["Hedy Lamarr", "hedy@acme.example", "member", "invited", null, null],
]);

export const northwindMembers: readonly Member[] = make(
  organizations.northwind.id,
  [
    [
      "Annie Easley",
      "annie@northwind.example",
      "owner",
      "active",
      "Managing Director",
      northwindHq ?? null,
    ],
    [
      "Mary Jackson",
      "mary@northwind.example",
      "member",
      "active",
      "Trader",
      northwindHq ?? null,
    ],
    [
      "Dorothy Vaughan",
      "dorothy@northwind.example",
      "member",
      "active",
      null,
      null,
    ],
  ]
);

export const orbitMembers: readonly Member[] = make(organizations.orbit.id, [
  [
    "Lynn Conway",
    "lynn@orbit.example",
    "owner",
    "active",
    "Director",
    orbitLab ?? null,
  ],
  [
    "Sophie Wilson",
    "sophie@orbit.example",
    "owner",
    "active",
    "Principal Engineer",
    orbitLab ?? null,
  ],
  [
    "Ruth Teitelbaum",
    "ruth@orbit.example",
    "member",
    "active",
    "Engineer",
    orbitLab ?? null,
  ],
]);

export const glitchMembers: readonly Member[] = make(organizations.glitch.id, [
  [
    "Evelyn Boyd Granville",
    "evelyn@glitch.example",
    "owner",
    "active",
    "Director",
    glitchWorks ?? null,
  ],
  [
    "Jean Bartik",
    "jean@glitch.example",
    "member",
    "active",
    "Analyst",
    glitchWorks ?? null,
  ],
]);

export const memberList: readonly Member[] = [
  ...acmeMembers,
  ...northwindMembers,
  ...orbitMembers,
  ...glitchMembers,
];
