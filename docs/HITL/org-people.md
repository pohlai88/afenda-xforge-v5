# Organization & Members should become Afenda’s first **operational workspace**

For the first frontend domain, I would **not** build “Organization” and “Members” as two traditional admin modules with separate list → detail → edit → save pages.

I would build one route:

> **`/organization` — Organization & People Workspace**

The design goal is:

**See → understand → select → act → verify, without leaving the page.**

That direction is strongly supported by where current enterprise products are going. Workday now combines graphical organization structures, worker-profile preview, drag/drop modeling, mass action, metrics, matrix relationships and executing organizational change from the same organization-management context. ([Workday][1]) Linear demonstrates the other half of the UX equation: selection, keyboard navigation, contextual menus, command palette and bulk actions without sending the user through multiple pages. ([Linear][2])

And this is solving a genuine market problem rather than merely making Afenda look modern. Mercer identifies fragmented HR technology and friction-heavy experiences as a major problem; Deloitte describes employees being forced across disconnected systems, portals and email; Korn Ferry's 2026 survey says 84% of leaders operate three to ten talent platforms; McKinsey likewise identifies fragmented technology and lack of a unified data backbone as a constraint on modern HR. ([Mercer][3])

---

# 1. The product concept

I would call the UX concept:

## **Organization Control Plane**

Not:

> Organization Directory

And not:

> Employee Master

Because this surface should answer four questions simultaneously:

| Question                      | Afenda surface                           |
| ----------------------------- | ---------------------------------------- |
| **How are we structured?**    | Organization tree/chart                  |
| **Who belongs where?**        | Members workspace                        |
| **What is wrong / changing?** | Insights, exceptions, effective dates    |
| **What can I do about it?**   | Contextual actions, sheets, bulk actions |

This distinction is important.

A normal HRIS says:

`Find employee → open record → navigate tab → edit → save → back → repeat.`

Afenda should feel more like:

`Find anything → inspect → act → continue.`

---

# 2. The core UX principle: one page, not one giant screen

**“Everything can be done on one page” should not mean “everything is visible simultaneously.”**

That creates SAP-style density and cognitive overload.

Instead use **progressive disclosure**:

```text
PAGE
│
├── Persistent context
│     Org hierarchy
│     Search
│     View
│     Filters
│
├── Primary workspace
│     Members / Org chart
│
├── Inspect
│     Right inspector
│
├── Perform lightweight action
│     Popover / inline edit
│
├── Perform substantial action
│     Sheet / Drawer
│
├── Confirm dangerous action
│     Dialog
│
└── Multi-object action
      Floating bulk-action bar
```

shadcn itself defines `Sheet` specifically as complementary content to the main screen, making it a very natural primitive for this architecture. Its Drawer supports nested drawers and non-modal configurations where appropriate. ([shadcn/ui][4])

---

# 3. Desktop information architecture

The page should have **four spatial layers**.

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│ Organization & People                                    Search ⌘K   + Create  ⋯ │
│ 428 people · 12 entities · Updated just now                                      │
├──────────────────────────────────────────────────────────────────────────────────┤
│ [People] [Org chart] [Positions]       Active ▾   Location ▾   Filter   Views ▾  │
├───────────────────┬──────────────────────────────────────────────────────────────┤
│ ORGANIZATION      │ PEOPLE                                                       │
│                   │                                                              │
│ ▾ Afenda Group    │  428 people                       Columns ▾   Density ▾       │
│   ├─ Malaysia 124 │ ┌─┬───────────────────────────────────────────────────────┐   │
│   │ ├ Finance 18  │ │□│ MEMBER       ROLE          ORG        MANAGER STATUS │   │
│   │ ├ HR 11       │ ├─┼───────────────────────────────────────────────────────┤   │
│   │ └ Operations  │ │ │ ● Aaron Lim   Accountant    Finance    Mei    Active │   │
│   │               │ │ │ ● Aisha Rahim HR Partner   People     Jack   Active │   │
│   ├─ Singapore 46 │ │ │ ● Alvin Tan   Ops Manager  SG Ops     Wong   Active │   │
│   │               │ │ │ ● Amanda Lee  Designer     Product    Lina   Leave  │   │
│   └─ Vietnam 258  │ │ │ ● An Nguyen   Sales Exec   VN Feed    Bao    Active │   │
│                   │ │ │ ...                                                   │   │
│ + Organization    │ └─┴───────────────────────────────────────────────────────┘   │
│                   │                                                              │
│                   │ Showing 1–50 of 428                                          │
└───────────────────┴──────────────────────────────────────────────────────────────┘
```

The left hierarchy is **not navigation to another page**.

Selecting `Vietnam → Feed Division → Sales` simply changes the scope of the current workspace.

---

# 4. Organization tree

This should become the persistent **scope navigator**.

Each node represents something structurally meaningful:

```text
Legal Entity
Business Unit
Division
Department
Team
Cost Centre
Location
Project / Matrix Team
```

Do not force everything into one “Department” hierarchy.

Workday explicitly supports supervisory, matrix, cost-centre and geographic structures. ([Workday][1])

Afenda should eventually be even cleaner:

```text
Organization Unit
   id
   type
   parent
   owner
   manager
   effectiveFrom
   effectiveTo
```

With different semantics supplied by `type`.

### Tree row

```text
▼ Vietnam
   258
   ├─ Feed Division
   │   72
   ├─ Central Operations
   │   28
   └─ ...
```

Hover:

```text
Feed Division               72
                     +   ⋯
```

`⋯` gives:

```text
View details
Add child organization
Add member
Rename
Change manager
Move organization
Duplicate structure
View history
Archive
```

---

# 5. Organization Summary Inspector

Clicking an organization opens a **persistent right-side inspector**, not another route.

```text
┌─────────────────────────────────────┐
│ Feed Division                   ×   │
│ Vietnam · Business Unit             │
│                                     │
│ 72 members      4 teams             │
│ 6 vacancies     9 managers          │
│                                     │
│ Overview  Structure  Activity       │
│ ─────────────────────────────────   │
│ Manager                             │
│ Bao Nguyen                          │
│                                     │
│ Parent                              │
│ Vietnam                             │
│                                     │
│ Cost centre                         │
│ VN-FEED                             │
│                                     │
│ Effective                           │
│ 01 Jan 2026 → Present               │
│                                     │
│ HEALTH                              │
│ ⚠ 3 people without manager          │
│ ⚠ 1 vacant managerial position      │
│                                     │
│ [Edit organization]                 │
│                                     │
│ More actions                     ⋯  │
└─────────────────────────────────────┘
```

This is where Afenda starts feeling **intelligent rather than database-driven**.

Don't merely expose fields.

Expose meaning.

---

# 6. People workspace

The center surface should default to **People**, because that will be the most frequently operated view.

Recommended base columns:

| Column       | Purpose                                 |
| ------------ | --------------------------------------- |
| Member       | avatar + preferred name + employee code |
| Employment   | title / worker type                     |
| Organization | current primary assignment              |
| Manager      | immediate manager                       |
| Location     | workplace                               |
| Status       | active / onboarding / leave / exiting   |
| Since        | assignment effective date               |
| Alerts       | data or structural exceptions           |
| `⋯`          | actions                                 |

Do **not** put 25 HR fields in the default grid.

Use column presets instead:

```text
Default
Organization
Employment
Contact
Compliance
Assignment
Manager view
Custom...
```

TanStack Table is a good fit because row selection, conditional selection, column visibility, sorting, filtering, resizing and grouping are first-class features. For very large workforces, TanStack recommends pairing the table with TanStack Virtual rather than rendering the entire dataset into the DOM. ([TanStack][5])

---

# 7. Clicking a person must **not navigate away**

This is one of the most important rules.

Click:

```text
Amanda Lee
Product Designer
```

And the table remains visible while the inspector appears:

```text
                            ┌──────────────────────────────────┐
                            │ Amanda Lee                    ×  │
                            │ ● Active                         │
                            │ Product Designer                 │
                            │ Malaysia                         │
                            │                                  │
                            │ Overview  Work  Access  History  │
                            │ ──────────────────────────────── │
                            │ ORGANIZATION                     │
                            │ Product Design                   │
                            │                                  │
                            │ Reports to                       │
                            │ Lina Wong                        │
                            │                                  │
                            │ Position                         │
                            │ Senior Product Designer          │
                            │                                  │
                            │ Location                         │
                            │ Kuala Lumpur                     │
                            │                                  │
                            │ Started                          │
                            │ 14 March 2024                    │
                            │                                  │
                            │ [Edit]                      •••  │
                            └──────────────────────────────────┘
```

Then `↑` / `↓` can switch the inspector to the previous/next member.

This makes reviewing fifty people dramatically faster.

---

# 8. Inspector versus Sheet versus Drawer versus Dialog

I would establish an Afenda UX contract early:

| UI primitive        | Use                               |
| ------------------- | --------------------------------- |
| **Popover**         | tiny contextual action            |
| **Inspector panel** | read/inspect an object            |
| **Sheet**           | edit one object                   |
| **Drawer**          | guided workflow                   |
| **Dialog**          | confirmation / high-risk decision |
| **Command menu**    | find/execute commands             |
| **Bulk bar**        | act on selected objects           |

This eliminates arbitrary UI decisions later.

### Example

Click member:

> inspector.

Click `Edit`:

> inspector morphs/expands into editable Sheet.

Click `Transfer member`:

> workflow Drawer.

Click `Terminate`:

> Drawer collects information → Dialog confirms final irreversible action.

That hierarchy is also consistent with accessibility expectations: modal experiences need controlled focus, Escape behavior, focus containment and proper focus restoration. ([W3C][6])

---

# 9. Editing should feel instantaneous

Do not open giant “Employee Edit Form”.

Use a sheet:

```text
┌──────────────────────────────────────────────┐
│ Edit Amanda Lee                         ×    │
│                                              │
│ Personal                                     │
│ ──────────────────────────────────────────── │
│ Preferred name       Amanda                  │
│ Work email           amanda@...              │
│                                              │
│ Work                                         │
│ ──────────────────────────────────────────── │
│ Job title            Product Designer        │
│ Organization         Product Design       ▾  │
│ Reports to           Lina Wong            ▾  │
│ Location             Kuala Lumpur         ▾  │
│                                              │
│ CHANGE EFFECTIVE                             │
│ ○ Immediately                                │
│ ● On date       [ 01 Oct 2026 ]              │
│                                              │
│                    Cancel      Save changes  │
└──────────────────────────────────────────────┘
```

**Effective date belongs directly in the interaction.**

That is crucial for enterprise HR.

A manager change often means:

> “From October 1”

not:

> “Overwrite today's manager field.”

---

# 10. The killer feature: **Change Preview**

Before executing an important structural change:

```text
Move Amanda Lee
Product Design → Corporate Design

Effective: 01 Oct 2026
```

show:

```text
CHANGE IMPACT
──────────────────────────────────
Organization       Product → Corporate
Manager            Lina → Unchanged
Cost centre        MY-PROD → MY-CORP
Security role      No change
Direct reports     3 affected
Payroll assignment No change

3 related records will be updated.

                       Cancel   Confirm
```

That small UX pattern creates enormous confidence.

Instead of:

> “Are you sure?”

Afenda says:

> **“Here is exactly what will change.”**

---

# 11. Bulk actions are essential

Select several members:

```text
☑ Amanda
☑ Aaron
☑ Alice
☑ Alvin
```

A floating bottom bar appears:

```text
╭─────────────────────────────────────────────────────────────╮
│ 4 selected     Move   Manager   Location   Status   ⋯   ×   │
╰─────────────────────────────────────────────────────────────╯
```

Linear already demonstrates the efficiency of selection → keyboard/contextual menu → bulk action. ([Linear][2])

Workday similarly makes mass organizational change a primary capability. ([Workday][1])

Afenda should support:

```text
Move organization
Change manager
Change location
Change employment type
Change cost centre
Add/remove role
Assign tag
Set effective date
Export selected
Start workflow
Archive
```

with permission-sensitive availability.

---

# 12. Bulk-change preview

This is where Afenda can outperform lighter HR products.

```text
Move 18 members
─────────────────────────────────────

FROM
Vietnam / Feed / Sales

TO
Vietnam / Feed / Commercial

Effective
01 October 2026

IMPACT

18    assignments changed
3     managers affected
2     inherited access changes
0     payroll conflicts
1     warning

⚠ Nguyen Anh has a future assignment
  beginning 15 October.

[Review exception]

                     Cancel   Apply 18 changes
```

---

# 13. Org chart mode

The same workspace switches:

```text
[ People ] [ Org chart ] [ Positions ]
```

No route change.

Org-chart view:

```text
                              ┌─────────────────┐
                              │ Jack Wee        │
                              │ Group MD        │
                              │ 6 direct        │
                              └────────┬────────┘
                                       │
          ┌────────────────────────────┼──────────────────────────┐
          │                            │                          │
┌─────────────────┐          ┌─────────────────┐        ┌─────────────────┐
│ Malaysia        │          │ Singapore       │        │ Vietnam         │
│ 124 people      │          │ 46 people       │        │ 258 people      │
│ 8 departments   │          │ 4 departments   │        │ 12 departments  │
└───────┬─────────┘          └─────────────────┘        └────────┬────────┘
        │                                                        │
    [expand]                                                 [expand]
```

Cards should be **quiet**.

No rainbow cards.

No huge avatars.

No gradients.

Use hierarchy, spacing, typography and restrained semantic status.

---

# 14. Chart should be operational

Hover an organization:

```text
┌───────────────────────┐
│ Feed Division         │
│ 72 people             │
│                       │
│ 8 managers            │
│ Span: 7.8             │
│                       │
│ +3 this quarter       │
└───────────────────────┘
```

Click → Inspector.

Right-click:

```text
Add child
Add member
Move
Change manager
Open members
View history
```

Later, a **Reorganize** mode can enable controlled drag-and-drop.

Workday's current product explicitly combines drag/drop modeling, mass changes, future-state org charts, span-of-control insights and executing reorganizations. ([Workday][1])

But I would **not ship drag/drop reorganization in Afenda V1**.

It can become Level 2 after the core interaction model is proven.

---

# 15. Add Member should be a Drawer workflow

Don't build:

> `/members/new`

Use:

```text
+ Create
   ├ Member
   ├ Organization
   ├ Position
   └ Location
```

Selecting Member opens:

```text
╔══════════════════════════════════════════╗
║ Add member                           ×   ║
║                                          ║
║ Identity ─ Work ─ Access ─ Review        ║
║ ●──────────○────────○────────○            ║
║                                          ║
║ Legal name                               ║
║ [                                      ] ║
║                                          ║
║ Preferred name                           ║
║ [                                      ] ║
║                                          ║
║ Work email                               ║
║ [                                      ] ║
║                                          ║
║                     Continue →           ║
╚══════════════════════════════════════════╝
```

Keep the underlying organization page mounted.

Users retain context.

---

# 16. Command Bar — the expert layer

`⌘K / Ctrl+K`

```text
┌───────────────────────────────────────────────────┐
│ > search people, organizations or actions...      │
├───────────────────────────────────────────────────┤
│ Amanda Lee                                        │
│ People · Product Design                           │
│                                                   │
│ ACTIONS                                           │
│ + Add member                                      │
│ + Add organization                                │
│ ⇄ Transfer member                                 │
│ ◫ Change manager                                  │
│                                                   │
│ VIEWS                                             │
│ People without manager                            │
│ New joiners                                       │
└───────────────────────────────────────────────────┘
```

Linear's command/search patterns are especially useful here: it exposes search and operational actions through both keyboard and command menu rather than requiring permanent visible controls everywhere. ([Linear][7])

---

# 17. Universal search should understand business language

Searching:

> `Amanda`

returns people.

Searching:

> `VN Feed`

returns organization.

Searching:

> `manager:empty`

returns exceptions.

Searching:

> `status:active country:MY`

creates a filter.

Searching:

> `joined:last30days`

works as a query.

Eventually:

> “people reporting to Jack in Malaysia”

can be translated into structured filters.

I would design the **query grammar now**, but leave natural-language AI interpretation for a later release.

That avoids over-engineering V1.

---

# 18. Saved views

Users should be able to save:

```text
All members
My organization
Direct reports
New joiners
Exiting
Missing manager
Unassigned
Malaysia
Vietnam Feed
Contract workers
```

And custom views:

```text
Jack / Monthly HR Review
HR / Missing employment data
Finance / Cost centre exceptions
```

Views preserve:

```text
scope
filters
sort
columns
grouping
density
```

not duplicated datasets.

---

# 19. Make data quality visible

A major market pain point is not lack of data—it is fragmented and unreliable data. Korn Ferry's 2026 research specifically highlights workforce information spread across multiple systems and resulting decision difficulty. ([Korn Ferry][8])

Therefore Afenda should surface exceptions directly.

Example header:

```text
428 Members

✓ 411 healthy
⚠ 12 need attention
● 5 onboarding
```

Click `12 need attention`:

```text
Missing manager                     3
Missing organization                2
Future assignment conflict          1
Missing work location               4
Duplicate work email                1
Inactive manager                    1
```

One click converts each condition into a filter.

This is much better than a separate:

> Data Quality Report

buried in Reporting.

---

# 20. Organization insights belong *inside* the operational context

When viewing:

> Vietnam / Feed

the toolbar can display:

```text
72 People     8 Managers     Span 7.8     6 Open Positions
```

No dashboard tiles taking half the screen.

Metrics should be **small contextual facts**, not decorative KPI cards.

Workday is moving in exactly this direction: org metrics such as headcount and span of control are embedded into organizational context rather than existing only as detached reports. ([Workday][1])

---

# 21. History should be first-class

Every member and organization inspector should contain:

```text
Overview
Work
Access
History
```

History:

```text
01 Sep 2026
Manager changed
Lina Wong → Jack Tan
Effective 01 Oct 2026
Changed by Emerson

────────────────────

12 Aug 2026
Location changed
Penang → Kuala Lumpur
Changed by HR Admin
```

This should be human-readable.

Not:

```text
employment_assignment.manager_id
old: 781712
new: 893712
```

---

# 22. Future changes are visible

One excellent enterprise UX pattern:

```text
CURRENT
Product Designer
Product Design
Manager: Lina Wong

────────────────────────────

UPCOMING · 01 OCT 2026
Senior Product Designer
Corporate Design
Manager: Lina Wong
```

Then:

```text
Cancel future change
Edit future change
```

This is substantially safer than overwriting current data.

---

# 23. Matrix relationships

The member Inspector should eventually express:

```text
PRIMARY
Product Design
Manager: Lina

MATRIX
AI Transformation Program
Program Lead: Marcus
```

Graphically:

```text
Lina Wong
   │
   └── Amanda Lee ─ ─ ─ Marcus Tan
       primary          matrix
```

Workday's current people-view organization chart explicitly represents supervisory and matrix organization membership. ([Workday Documentation][9])

---

# 24. Permissions should shape the UI

Avoid:

> Click Edit → “You don't have permission.”

Instead:

```text
HR Admin
[ Edit ]

Manager
[ Request change ]

Employee
[ View ]
```

Sensitive information should simply not appear where permission does not allow it.

And the Sheet should be schema-aware:

```text
Field           View   Edit
Organization      ✓     ✓
Manager           ✓     ✓
Compensation      –     –
Personal ID       –     –
```

---

# 25. Responsive strategy

“Single page” still works on mobile, but the spatial model changes.

Desktop:

```text
Tree | Workspace | Inspector
```

Tablet:

```text
Workspace | Inspector
Tree = Sheet
```

Mobile:

```text
Workspace

Organization = Drawer
Member detail = Drawer
Actions = Bottom Sheet
Filters = Drawer
```

Do not attempt to compress all three desktop regions onto a phone.

---

# 26. Recommended density system

Provide:

```text
Comfortable
Compact
```

### Comfortable

48–52 px rows.

For normal managers and employees.

### Compact

36–40 px rows.

For HR, payroll, finance and operators reviewing hundreds of records.

Do not create five density modes.

Two is enough.

---

# 27. Keyboard contract

For experienced operators:

| Key             | Action                |
| --------------- | --------------------- |
| `/`             | Search workspace      |
| `⌘K` / `Ctrl K` | Command menu          |
| `↑ ↓` / `J K`   | Move row focus        |
| `Enter`         | Open inspector        |
| `X`             | Select focused record |
| `Shift + X`     | extend selection      |
| `E`             | Edit                  |
| `N`             | New member            |
| `Esc`           | close current layer   |
| `?`             | shortcuts             |

This should enhance the mouse workflow, never replace it.

W3C guidance specifically emphasizes predictable visible focus and efficient keyboard operation for application-style interfaces. ([W3C][10])

---

# 28. The complete interaction model

This is the architecture I would freeze:

```text
                    ORGANIZATION WORKSPACE
                            │
          ┌─────────────────┼──────────────────┐
          │                 │                  │
       SCOPE              VIEW              QUERY
          │                 │                  │
    Org hierarchy      People/List          Search
    Location           Org chart            Filter
    Entity             Positions             Saved view
          │                 │                  │
          └─────────────────┼──────────────────┘
                            │
                         RESULT
                            │
             ┌──────────────┼─────────────┐
             │              │             │
           CLICK          SELECT        COMMAND
             │              │             │
         Inspector       Bulk bar       ⌘K menu
             │              │             │
           Edit           Action         Action
             │              │             │
           Sheet          Drawer         Drawer
             │              │             │
             └──────────────┼─────────────┘
                            │
                      Impact Preview
                            │
                          Commit
                            │
                       Audit / Undo*
```

`Undo*` only for operations whose domain semantics genuinely support reversal.

---

# 29. What I would **not** build in V1

This is equally important.

Do **not** start with:

```text
AI chatbot
Drag/drop reorganisation
Workforce planning simulation
Skills graph
Succession planning
Performance management
Compensation analytics
Employee engagement
Social feed
Full workflow designer
Custom report builder
```

They are adjacent products.

The first frontend domain should make **organization and membership exceptionally good**.

---

# 30. V1 feature boundary

I would ship this first:

### Organization

* hierarchy
* organization types
* create/edit/archive
* parent-child relationships
* manager/owner
* cost centre/location references
* effective dating
* organization inspector
* member count
* basic structural health
* organization history

### Members

* member directory
* search
* filters
* sorting
* customizable columns
* profile inspector
* employment/assignment overview
* manager relationship
* organization/location
* effective dates
* upcoming change
* history

### Operations

* add member
* edit member
* move member
* change manager
* change organization
* multi-select
* bulk move/change
* impact preview
* saved views
* export selected

### UX

* command palette
* inspector
* sheets
* drawers
* dialogs
* keyboard navigation
* compact/comfortable density
* responsive layout
* URL-restorable workspace state

That is already a **serious enterprise product**.

---

# 31. Wireframe — normal state

```text
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│  Organization & People                                               ⌘K        + Create   │
│  Your company structure and workforce                                                        │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│  People   Org chart   Positions           🔍 Search people or orgs...        Filter  Views │
├───────────────────┬────────────────────────────────────────────────────────────────────────┤
│ ORGANIZATION      │  All people                                                         ⋯ │
│                   │  428 members             Active ▾  Location ▾  Columns ▾  Density ▾    │
│ ▼ Afenda Group    │ ┌────┬──────────────────┬─────────────┬────────────┬──────────┬───────┐ │
│   Malaysia   124  │ │    │ MEMBER           │ TITLE       │ ORG        │ MANAGER  │STATUS │ │
│    Finance    18  │ ├────┼──────────────────┼─────────────┼────────────┼──────────┼───────┤ │
│    People     11  │ │ □  │ ● Amanda Lee     │ Designer    │ Product    │ Lina     │Active │ │
│    Operations 42  │ │ □  │ ● Aaron Lim      │ Accountant  │ Finance    │ Mei      │Active │ │
│                   │ │ □  │ ● Alice Ng        │ HR Partner  │ People     │ Jack     │Leave  │ │
│   Singapore   46  │ │ □  │ ● Alvin Tan      │ Manager     │ SG Ops     │ Wong     │Active │ │
│                   │ │ □  │ ● An Nguyen       │ Sales Exec  │ VN Feed    │ Bao      │Active │ │
│   Vietnam    258  │ │    │                  │             │            │          │       │ │
│    Feed        72 │ │    │                  │             │            │          │       │ │
│    Operations  28 │ └────┴──────────────────┴─────────────┴────────────┴──────────┴───────┘ │
│                   │                                                                         │
│ + Organization    │  1–50 of 428                                              50 rows ▾   │
└───────────────────┴────────────────────────────────────────────────────────────────────────┘
```

---

# 32. Wireframe — member inspection

```text
┌──────────────────┬────────────────────────────────────────────┬────────────────────────────┐
│ ORGANIZATION     │ PEOPLE                                     │ Amanda Lee              × │
│                  │                                            │ ● Active                   │
│ ▼ Afenda Group   │ Amanda Lee              ← selected         │ Product Designer           │
│   Malaysia       │ Aaron Lim                                  │                            │
│    Product       │ Alice Ng                                   │ Overview Work Access History│
│    Finance       │ Alvin Tan                                  │ ────────────────────────── │
│                  │ An Nguyen                                  │ Organization               │
│                  │                                            │ Product Design             │
│                  │                                            │                            │
│                  │                                            │ Manager                    │
│                  │                                            │ Lina Wong                  │
│                  │                                            │                            │
│                  │                                            │ Employment                 │
│                  │                                            │ Permanent                  │
│                  │                                            │                            │
│                  │                                            │ Location                   │
│                  │                                            │ Kuala Lumpur               │
│                  │                                            │                            │
│                  │                                            │ UPCOMING                   │
│                  │                                            │ 01 Oct · Promotion         │
│                  │                                            │                            │
│                  │                                            │ [Edit]                 ⋯   │
└──────────────────┴────────────────────────────────────────────┴────────────────────────────┘
```

---

# 33. Wireframe — bulk operation

```text
┌───────────────────────────────────────────────────────────────────────────────┐
│ PEOPLE                                                                        │
├───────────────────────────────────────────────────────────────────────────────┤
│ ☑ Amanda Lee       Product Design      Lina Wong                              │
│ ☑ Aaron Lim        Product Design      Lina Wong                              │
│ ☑ Alvin Tan        Product Design      Lina Wong                              │
│ ☑ Alice Ng         Product Design      Lina Wong                              │
│ □ ...                                                                         │
│                                                                               │
│                                                                               │
│        ╭──────────────────────────────────────────────────────────╮           │
│        │ 4 selected   Move  Manager  Location  Access  More ⋯  × │           │
│        ╰──────────────────────────────────────────────────────────╯           │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

# 34. Wireframe — organization chart

```text
┌───────────────────────────────────────────────────────────────────────────────┐
│ People   [Org chart]   Positions                 Search       Filter   Views  │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│                               AFENDA GROUP                                    │
│                              428 members                                      │
│                                    │                                          │
│                ┌───────────────────┼───────────────────┐                      │
│                │                   │                   │                      │
│          MALAYSIA              SINGAPORE            VIETNAM                   │
│          124 people             46 people           258 people                │
│                │                                       │                      │
│       ┌────────┼────────┐                       ┌───────┼───────┐              │
│       │        │        │                       │       │       │              │
│    FINANCE   PEOPLE    OPS                    FEED    OPS     SALES            │
│      18        11       42                     72      28      37              │
│                                                                               │
│                               −  100%  +   Fit                                │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

# 35. Component architecture for Claude Code

I would give Claude this component boundary:

```text
organization/
├── organization-workspace.tsx
│
├── shell/
│   ├── workspace-header.tsx
│   ├── workspace-toolbar.tsx
│   └── workspace-content.tsx
│
├── hierarchy/
│   ├── organization-navigator.tsx
│   ├── organization-tree.tsx
│   ├── organization-tree-node.tsx
│   └── organization-context-menu.tsx
│
├── people/
│   ├── people-table.tsx
│   ├── people-columns.tsx
│   ├── people-toolbar.tsx
│   ├── people-row.tsx
│   └── people-empty-state.tsx
│
├── chart/
│   ├── organization-chart.tsx
│   ├── organization-card.tsx
│   └── chart-controls.tsx
│
├── inspectors/
│   ├── member-inspector.tsx
│   └── organization-inspector.tsx
│
├── actions/
│   ├── bulk-action-bar.tsx
│   ├── impact-preview.tsx
│   └── command-menu.tsx
│
├── sheets/
│   ├── edit-member-sheet.tsx
│   └── edit-organization-sheet.tsx
│
├── drawers/
│   ├── create-member-drawer.tsx
│   ├── create-organization-drawer.tsx
│   ├── move-member-drawer.tsx
│   └── bulk-change-drawer.tsx
│
├── filters/
│   ├── organization-filters.tsx
│   ├── filter-chip.tsx
│   └── saved-views.tsx
│
├── hooks/
│   ├── use-organization-workspace.ts
│   ├── use-member-selection.ts
│   └── use-workspace-keyboard.ts
│
└── organization.types.ts
```

The key architectural principle:

> **The page owns orchestration. Components own presentation and local interaction. Domain mutation logic stays outside the component tree.**

---

# 36. Workspace state

Keep it compact:

```ts
type OrganizationWorkspaceState = {
  view: 'people' | 'chart' | 'positions'
  organizationId?: string
  memberId?: string

  query: string
  filters: WorkspaceFilter[]
  sorting: SortingState
  columnVisibility: VisibilityState
  density: 'comfortable' | 'compact'

  selectedMemberIds: Set<string>

  inspector:
    | { type: 'member'; id: string }
    | { type: 'organization'; id: string }
    | null

  overlay:
    | { type: 'create-member' }
    | { type: 'edit-member'; id: string }
    | { type: 'move-member'; ids: string[] }
    | null
}
```

Do **not** introduce Redux/Zustand simply because this workspace has state.

Most of the server state belongs in the query/data layer.

The UI state above is small enough to remain local/shared via a workspace controller until evidence says otherwise.

---

# 37. URL semantics

Make meaningful view state restorable:

```text
/organization
?org=vn-feed
&view=people
&status=active
&location=vn
```

Opening a person can optionally become:

```text
/organization?org=vn-feed&member=emp_123
```

while **remaining the same page**.

Benefits:

* back/forward works;
* links can be shared;
* browser refresh preserves context;
* saved views become trivial;
* tests become deterministic.

---

# 38. UX quality gates

Claude should not consider the frontend complete merely because buttons work.

Require:

### Interaction

```text
No full-page navigation for normal organization/member operations.
No accidental context loss when sheets open.
Selection survives inspector changes.
Filters survive member inspection.
Escape closes only the topmost interaction layer.
```

### Performance

```text
100 records      effortless
1,000 records    effortless
10,000 records   virtualized/server filtered
```

### Accessibility

```text
All actions keyboard reachable
Visible focus
Focus moves correctly into modal layers
Focus returns to trigger
Inspector has accessible heading
Icon-only buttons have labels
Selection isn't communicated by color alone
```

W3C's current guidance specifically requires sensible dialog focus movement/restoration and strong visible focus indicators. ([W3C][11])

### Visual

```text
No decorative gradients
No oversized cards
No excessive rounded containers
No rainbow status badges
No repeated headers
No hidden primary actions
No modal for simple inspection
```

That is how you reach the **quiet, high-end, data-intensive Afenda character**.

---

# 39. Copy this directly into Claude Code

Here is the implementation brief I would now give Claude.

# Afenda — Organization & People Workspace

Implement the first Afenda frontend business domain as a single-page operational workspace for Organization and Members.

## Product intent

This must not be implemented as conventional CRUD pages.

Do not build separate:

* organization list page
* organization details page
* member list page
* member details page
* member edit page

Instead implement one persistent `/organization` workspace where users can inspect and operate on organization structures and members without leaving the page.

The fundamental interaction is:

SEE → FILTER → INSPECT → SELECT → ACT → PREVIEW → COMMIT

Normal operations must preserve the user's workspace context.

## UX qualities

The interface must feel:

* enterprise-grade
* quiet
* modern
* dense without clutter
* fast
* keyboard-capable
* highly contextual
* suitable for long working sessions
* suitable for several hundred or thousands of records
* progressive rather than form-heavy

Avoid dashboard-card UI, oversized headings, decorative gradients, excessive rounded containers and rainbow status badges.

Prioritize typography, hierarchy, whitespace, density and restrained semantic status.

## Main route

`/organization`

The page contains:

1. Workspace header
2. View/search/filter toolbar
3. Organization navigator
4. Primary workspace
5. Contextual inspector
6. Sheets/drawers/dialogs
7. Floating bulk-action bar

Do not navigate away from `/organization` for ordinary member or organization operations.

## Primary views

Provide three view modes inside the same page:

* People
* Org chart
* Positions

Implement People completely first.

Org chart can initially implement the structural visualization without advanced reorganization behavior.

Positions may initially be a placeholder behind the same view contract if the domain is not ready.

## Desktop layout

Use a three-region architecture.

Left:
Organization navigator, approximately 240–280px and optionally resizable.

Center:
Primary workspace.

Right:
Contextual inspector, approximately 360–440px when open.

When inspector is closed, the center workspace uses the available width.

Do not use route navigation when switching organization scope.

Selecting an organization changes the scope of the center workspace.

## Organization navigator

Display the organization hierarchy as an expandable tree.

Tree nodes must support:

* select
* expand/collapse
* member count
* hover actions
* context menu
* keyboard focus

Expected organization types include:

* legal entity
* business unit
* division
* department
* team
* cost centre
* geographic/location grouping
* matrix/project organization

Do not hardcode the UI around "Department".

Use the organization's type supplied by domain data.

Node contextual actions:

* view details
* add child organization
* add member
* edit
* change manager
* move
* view history
* archive, if permitted

## People workspace

Use the existing Afenda data-grid/table primitives.

Recommended default columns:

* selection
* member
* job title / employment
* organization
* manager
* location
* status
* effective/since date
* alerts
* contextual actions

Member cell should contain:

* avatar or initials
* preferred/display name
* employee/member code as subtle secondary text where useful

Keep the default table deliberately compact.

Do not expose every HR field as a default column.

Support:

* sorting
* filtering
* column visibility
* column resizing where supported
* compact/comfortable density
* row selection
* range/multi selection
* keyboard row navigation
* server-side filtering/pagination where required
* virtualization only when dataset size justifies it

## Workspace toolbar

Include:

* People / Org chart / Positions view selector
* universal search
* active filter chips
* Filter control
* Views control
* Columns control
* Density control
* overflow menu

Do not create several rows of permanent buttons.

## Search

Search should cover both members and organizations.

Prepare the interface so structured query syntax can eventually support:

`manager:empty`
`status:active`
`country:MY`
`organization:finance`

Natural-language AI parsing is not required in this implementation.

## Saved views

Design saved views as persisted workspace configuration.

A saved view may contain:

* organization scope
* filters
* sorting
* visible columns
* grouping
* density

Provide system view examples:

* All members
* My organization
* Direct reports
* New joiners
* Exiting
* Missing manager
* Unassigned

The architecture must allow user-created views later.

## Member inspector

Clicking a member must NOT navigate away.

Open a contextual right inspector.

Inspector sections:

* Overview
* Work
* Access
* History

Overview should prioritize meaningful business information rather than database fields.

Show:

* member identity
* status
* title
* current organization
* manager
* position if available
* location
* employment type
* employment/assignment dates
* upcoming effective changes
* relevant warnings

Include:

* Edit
* contextual action menu

When the table is focused, Up/Down or J/K should allow navigation between members while keeping the inspector open.

## Organization inspector

Selecting/opening an organization may display:

* organization name
* organization type
* parent
* manager/owner
* cost centre
* location
* effective dates
* member count
* child organization count
* structural health indicators
* upcoming changes
* history

Use small contextual metrics.

Do not build a dashboard of KPI cards.

## Interaction-layer contract

Use the following rule consistently.

Popover:
small immediate contextual interaction.

Inspector:
read/inspect one object while preserving workspace context.

Sheet:
edit one existing object.

Drawer:
multi-step or more substantial workflow.

Dialog:
confirmation, destructive decision or short blocking decision.

Command palette:
cross-workspace search and actions.

Floating bulk-action bar:
operations against selected objects.

Do not choose overlay primitives arbitrarily.

## Editing members

Member editing should use a Sheet.

Do not create a giant generic employee-edit page.

Group editable data into meaningful sections.

When relevant, include effective date semantics directly in the interaction.

Example:

Change manager:

* new manager
* effective immediately OR effective on date
* optional reason

Preview the impact before high-impact changes are committed.

## Effective-dated changes

Treat effective dates as first-class UX.

Show current and future state separately.

Example:

CURRENT
Product Designer
Product Design
Manager: Lina Wong

UPCOMING — 01 OCT 2026
Senior Product Designer
Corporate Design
Manager: Lina Wong

The UI must not visually imply that future values are already current.

## Change impact preview

Before high-impact structural changes, show exactly what will change.

Example:

Organization:
Product Design → Corporate Design

Cost centre:
MY-PROD → MY-CORP

Manager:
unchanged

Related assignments:
3 affected

Do not rely only on generic "Are you sure?" dialogs.

Use confirmation dialogs only after the impact has been made understandable.

## Member creation

Use a Drawer.

Do not navigate to `/members/new`.

Suggested steps:

1. Identity
2. Work
3. Access
4. Review

Keep the organization workspace mounted beneath the drawer.

## Organization creation

Use a Drawer or Sheet depending on complexity.

Collect:

* organization name
* type
* parent
* manager/owner
* location
* cost centre where applicable
* effective date

Review before creating if creation causes inherited relationships.

## Bulk selection

Support checkbox/mouse and keyboard-driven multi-selection.

When one or more records are selected, show a floating bottom bulk-action bar.

Example:

`4 selected | Move | Manager | Location | Status | More | ×`

Do not permanently display bulk actions when nothing is selected.

Potential bulk operations:

* move organization
* change manager
* change location
* change cost centre
* update status
* add/remove supported roles
* start supported workflow
* export selected
* archive where permitted

Actions must be permission-aware.

## Bulk change workflow

Bulk operations should open a Drawer.

Show:

* selected record count
* requested change
* effective date
* affected related records
* warnings
* conflicts
* exceptions

Require an impact preview before commit.

## Data-quality signals

Surface organizational/member structural problems directly in the workspace.

Examples:

* no manager
* no organization assignment
* inactive manager
* future assignment conflict
* duplicate work email
* missing location
* vacant managerial position

Do not bury these only in a separate reporting module.

Allow clicking an issue count to apply the relevant workspace filter.

## Org chart

Implement as another view of the same organization context.

The chart should display organization hierarchy with restrained cards.

Cards may include:

* organization name
* people count
* manager count
* span of control where available
* vacancy count where available

Clicking a node should open the organization inspector.

Contextual actions should be available.

Advanced drag/drop reorganization is explicitly OUT OF SCOPE for the first implementation.

The architecture should not prevent it being added later.

## Command palette

Implement or prepare a workspace command palette using Cmd/Ctrl+K.

It should eventually cover:

SEARCH

* member
* organization

ACTIONS

* add member
* add organization
* transfer member
* change manager

VIEWS

* navigate to a saved/system view

Do not expose every command as permanent toolbar buttons.

## Keyboard behavior

Target keyboard contract:

`/` focus workspace search

`Cmd/Ctrl + K` open command palette

`Arrow Up/Down` or `J/K` navigate focused table rows

`Enter` inspect focused record

`X` select/unselect focused record where appropriate

`Esc` close only the topmost active interaction layer

`?` show keyboard shortcuts if implemented

Keyboard interactions must never break normal browser/accessibility behavior.

## Accessibility

All primary functionality must be keyboard reachable.

Require:

* visible focus indicators
* proper labels for icon-only actions
* correct Sheet/Drawer/Dialog accessible names
* predictable initial focus
* focus containment for modal interactions
* return focus to the invoking element when modal interaction closes
* Escape behavior
* status not communicated only through color
* appropriate accessible table/grid semantics

Do not build custom inaccessible focus management when the existing design-system primitive already solves the problem.

## Responsive behavior

Desktop:
organization navigator + workspace + inspector.

Tablet:
workspace + inspector.
Organization navigator becomes a Sheet.

Mobile:
workspace is primary.
Organization navigator becomes a Drawer.
Member inspector becomes a Drawer.
Filters become a Drawer.
Bulk actions remain reachable from the bottom.

Do not shrink the three-column desktop layout onto mobile.

## Density

Support exactly:

* comfortable
* compact

Avoid unnecessary additional density variants.

## Workspace URL state

Persist meaningful, shareable state in the URL where appropriate.

Example:

`/organization?org=vn-feed&view=people&status=active`

Optional member inspection:

`/organization?org=vn-feed&member=emp_123`

The member still opens as an inspector rather than causing a page transition.

Back/forward navigation must behave sensibly.

Avoid serializing ephemeral UI details into the URL.

## Performance

Avoid eagerly rendering unnecessary overlays or expensive inspector content.

Keep table/data references stable.

Use server-side query behavior for datasets too large to load into the browser.

Only introduce row virtualization when data volume warrants it.

Inspector changes must not cause the entire member table to rerender unnecessarily.

## Permissions

UI actions must respect domain permissions.

Prefer:

* hide actions that are wholly unavailable;
* disable with explanation where discoverability is useful;
* provide Request Change rather than Edit where that is the business contract.

Never depend on frontend permission checks for security.

Backend/domain authorization remains authoritative.

## History

Both organizations and members should have human-readable history.

Example:

01 Sep 2026
Manager changed
Lina Wong → Jack Tan
Effective 01 Oct 2026
Changed by HR Admin

Do not expose raw audit/database identifiers as the primary UX.

## Component boundaries

Prefer this structure where compatible with the existing codebase:

organization/
organization-workspace.tsx

shell/
workspace-header.tsx
workspace-toolbar.tsx
workspace-content.tsx

hierarchy/
organization-navigator.tsx
organization-tree.tsx
organization-tree-node.tsx
organization-context-menu.tsx

people/
people-table.tsx
people-columns.tsx
people-toolbar.tsx
people-row.tsx

chart/
organization-chart.tsx
organization-card.tsx
chart-controls.tsx

inspectors/
member-inspector.tsx
organization-inspector.tsx

actions/
bulk-action-bar.tsx
impact-preview.tsx
command-menu.tsx

sheets/
edit-member-sheet.tsx
edit-organization-sheet.tsx

drawers/
create-member-drawer.tsx
create-organization-drawer.tsx
move-member-drawer.tsx
bulk-change-drawer.tsx

filters/
organization-filters.tsx
filter-chip.tsx
saved-views.tsx

Do not create files merely to satisfy this example tree. Follow existing repository conventions and extract only when there is a real ownership boundary.

## Architecture constraints

The frontend must consume existing domain/API contracts.

Do not invent new business rules in React components.

Do not duplicate domain validation.

Do not create a client-side mirror of the entire domain model.

Keep server state in the existing data/query abstraction.

Keep ephemeral UI state local to the workspace unless existing architecture dictates otherwise.

Do not add Redux/Zustand or another global state system solely for this page.

Do not introduce abstraction before repeated implementation proves it is needed.

## First implementation sequence

Build vertically rather than building every primitive first.

Sequence:

1. `/organization` shell
2. organization navigator
3. people table
4. member inspector
5. filtering/search
6. member editing Sheet
7. create-member Drawer
8. row selection + floating bulk bar
9. one complete bulk-change workflow with impact preview
10. organization inspector
11. org-chart view
12. saved views / command palette as supported

For every step:

* wire to real contracts where available;
* use fixtures only where API work is genuinely unavailable;
* preserve loading, empty, error and permission states;
* write meaningful interaction tests.

## Explicitly out of scope for V1

Do NOT implement unless the existing domain already requires it:

* AI chatbot
* drag/drop reorganization
* workforce scenario modeling
* succession planning
* performance management
* compensation analytics
* skills graph
* employee social feed
* generic workflow designer
* generic custom report builder

Focus on making Organization & Members exceptionally good.

## Definition of done

The implementation is successful when a user can:

1. open `/organization`;
2. navigate organization hierarchy;
3. search/filter members;
4. inspect multiple members rapidly without leaving the workspace;
5. inspect an organization;
6. edit a member through a Sheet;
7. add a member through a Drawer;
8. select several members;
9. run an authorized bulk change;
10. understand its impact before committing;
11. use back/forward or shared URL state without losing meaningful context;
12. perform all essential workflows with keyboard and accessible focus behavior;
13. complete ordinary organization/member work without route churn.

Prioritize coherent interaction architecture over feature count.

The intended result should feel closer to a professional operating console than a conventional HR administration website.

## My recommendation for the **first frontend milestone**

I would make the milestone even narrower:

> **Ship People Table + Organization Scope Tree + Member Inspector + Edit Sheet + Bulk Manager/Organization Change.**

If those five pieces feel exceptional, **you have established the frontend grammar for almost all of Afenda**.

Payroll can later reuse:

`table → inspector → sheet → bulk action`

Finance can reuse it.

CRM can reuse it.

Inventory can reuse it.

Procurement can reuse it.

The valuable thing you are designing in this first domain is therefore **not merely Organization & Members**. You are establishing Afenda's reusable **enterprise interaction model**—without creating another specification framework before the working product proves it.

[1]: https://www.workday.com/en-us/products/human-capital-management/human-resource-management/org-management.html "Organization Management and Chart Software | Workday US"
[2]: https://linear.app/docs/select-issues "Select issues – Linear Docs"
[3]: https://www.mercer.com/en-us/insights/people-strategy/hr-transformation/priorities-for-2025/?utm_source=chatgpt.com "Embracing transformation in 2025"
[4]: https://ui.shadcn.com/docs/components/base/sheet "Sheet - shadcn/ui"
[5]: https://tanstack.com/table/v8/docs/guide/row-selection?utm_source=chatgpt.com "Row Selection Guide | TanStack Table Docs"
[6]: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/?utm_source=chatgpt.com "Dialog (Modal) Pattern | APG | WAI | W3C"
[7]: https://linear.app/docs/search?utm_source=chatgpt.com "Search – Linear Docs"
[8]: https://www.kornferry.com/about-us/press/korn-ferry-study-reveals-data-overload-is-clouding-decision-making-cutting-into-profits?utm_source=chatgpt.com "Korn Ferry Study Reveals Data Overload is Clouding Decision Making, Cutting into Profits"
[9]: https://doc.workday.com/admin-guide/en-us/manage-workday/organizations/organization-charts/lah1480533274925.html?utm_source=chatgpt.com "Concept: Organization Charts - Workday Documentation"
[10]: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/?utm_source=chatgpt.com "Developing a Keyboard Interface | APG | WAI | W3C"
[11]: https://www.w3.org/WAI/WCAG22/Techniques/html/H102?utm_source=chatgpt.com "H102: Creating modal dialogs with the HTML dialog element | WAI | W3C"
