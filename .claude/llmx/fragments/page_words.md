# The loop in five minutes

Fragments keeps agents on your design system while they write. It runs in the editor, on every save, with no network. Five steps.
On this page

-
## Install
`npx @usefragments/cli init`

`init` writes `fragments.config.ts` and the hooks for Claude Code, Cursor and Codex. When it finds your components it also writes `fragments.manifest.json`. Diff them; they are yours.

-
## Discover your Fragments
`npx @usefragments/cli discover`

`discover` reads your component library and proposes `fragments.manifest.json`: every exported primitive with its members and props, your token prefix, and empty slots for intents, patterns and grammar. It infers nothing at check time. You curate the file once; it is the contract. Run it again after you add a primitive.
Terminal
`$ npx @usefragments/cli discover
Wrote fragments.manifest.json (2 primitives, FCID ddadca30512b).`

About one second on a small React app with `src/components/{Button,Card}` and a `@/*` alias in `tsconfig.json`. Discover reads the alias for the import path and your stylesheets for the token prefix. If it cannot tell how your app imports the components it stops and asks for `--library <import path>` instead of writing an empty file.

-
## Commit the manifest
The manifest's content hash is the FCID. Every check, every verdict, every receipt cites it. Change the manifest, get a new FCID.

-
## Open your editor
The next Claude Code, Cursor or Codex session starts with a card: your Fragments, what each is for, the patterns you named, the grammar you wrote. Sixty lines at most.
card
`Fragments vocabulary card
FCID: `69793552072061f8ea29849fbb350c2d772a5082ed6fad02ce8deec385a0274d`
Import from `@usefragments/ui`.
Canonical primitives (71 roots):
Accordion, Alert, AppShell, Avatar, Badge, BentoGrid, Box, Breadcrumbs, Button
ButtonGroup, Card, Chart, Checkbox, Chip, CodeBlock, Collapsible, ColorPicker, Combobox
Command, ComponentDefaults, ConversationList, DataTable, DatePicker, Dialog, Drawer
Editor, EmptyState, Field, Fieldset, Form, Grid, Header, Icon, IconButton, Image, Input
Link, List, Listbox, Loading, Main, Markdown, Menu, Message, NavigationMenu, Pagination
Popover, Progress, Prompt, RadioGroup, ScrollArea, Select, Separator, Sidebar, Skeleton
Slider, Stack, Switch, Table, TableOfContents, Tabs, Text, Textarea, Theme, ThemeToggle
ThinkingIndicator, Toast, Toggle, ToggleGroup, Tooltip, VisuallyHidden
Use for:
- Button: action, submit, cta, primary, secondary, destructive · not raw <button>
- Table: ledger, repositories, findings, pull requests, merges · not clickable flex rows without semantics
- Alert: inline status, warning, error callout, blocked state · not hand-styled callout
- Badge: status, severity, count, verdict · not decorative colour
- CodeBlock: command, digest, snippet, copyable code · not raw <pre> with hardcoded colours`

Show 42 more lines

Sixty lines, recorded from the Fragments repository on 2026-09-02. Yours lists your primitives.

-
## Watch the first correction
Ask the agent for a form. When it writes `<button>`, the check runs on save and the agent reads:
PostToolUse
`apps/cloud/src/prod-smoke/ProdSmokeGovernance.tsx:9 FUI1004 Bespoke <button> has a library equivalent. Swap to <Button> from @usefragments/ui. → Replace <button> with <Button>`

The agent repairs before you look. When the session stops, the loop checks the whole diff once more and holds the stop until introduced findings are zero.

## What you have now
A manifest your team owns. A card every agent session starts from. A check on every save and a proof at every stop, all local.

## Vocabulary
Fragments uses one word per thing, everywhere: CLI, editor, Cloud, GitHub, these docs.
Fragments vocabulary, verbatim from docs/fragments-v1/GLOSSARY.mdWord
Meaning
Where it lives
Retired synonyms

FragmentOne canonical primitive of a design system: a component the team has decided is the way to do a thing (Button, Card.Header).`libs/ui/src/components/<Name>/, fragments.manifest.json primitives[]`

canonical component, root, primitive (outside code)
ManifestThe curated, committed contract of a repository's design system: Fragments, tokens, patterns, grammar, rules, exemplars. One file.`fragments.manifest.json`

policy, contract file, vocabulary, catalog
Contract / FCIDThe pinned identity of a manifest version: contractHash(manifest). Every verdict cites one.`packages/core/src/contract/hash.ts`

contract stamp, contract version (as identity)
CardThe ≤60-line summary of the manifest an agent receives at session start.`fragments hook-exec --event SessionStart`

agent context, vocabulary card, reminder
LoopThe write-path cycle: card → write → check → repair → prove. Local, zero network.`packages/loop`

agent surface, hook pipeline
CheckAn evaluation of one file or one diff against the manifest.`fragments check, check-file, hooks`

scan, governance run, lint
FindingOne drift from the manifest, always phrased as replace <raw> with <Fragment> from <library>, with a code FUI####.`packages/core/src/rules/`

issue, violation, occurrence, diagnostic
RepairThe deterministic fix for a finding.`fragments fix, conform`

autofix, codemod, suggestion
PatternA named composition of Fragments with an intent and an exemplar (StatStrip, DecisionDialog).`manifest patterns[]`

block, recipe, composition
GrammarA house rule of the design system, checkable when a rule id exists.`manifest grammar[]`

design rule, guideline, DESIGN.md prose
ExemplarA gold usage of a Fragment or pattern in this repository, path:line.`manifest exemplar`

example, reference, usage site
BindingA repository connected to Fragments Cloud through the GitHub App.`convex/bindings`

project (user-facing), repo record, installation repo
Verdictpass, block or indeterminate for an exact head against an exact FCID. Produced only by evaluate().`@usefragments/core/evaluation`

conclusion, status, result, clean/dirty
ReceiptThe persisted evaluation behind a verdict, id evr_…. What a check's details link opens.`governanceReceipt.ts, /r/:evr_`

trust receipt, evaluation record, proof
GateThe required GitHub check fragments/contract-compliance on a protected branch.`contract-check.ts`

check run (as a product noun), status check
ExceptionAn admin-granted, expiring, reasoned waiver of a finding. Always logged.`exceptions ledger`

waiver, suppression, ignore
BypassA merge that landed without a passing verdict or an exception. Recorded, never hidden.`merge ledger outcome: bypassed`

override, force-merge
Merge ledgerOne row per (binding, head) merge with its receipt and outcome.`convex/mergeLedger.ts`

merge history, rollup, snapshot
DiscoverThe command that proposes a manifest from the code. A human curates; nothing is inferred at check time.`fragments discover`

scan, classify, auto-detect

The product's sentence: The agent ignored your Button. Replace `<button>` with `Button` from `@acme/ui`.

## Next steps
- Fragments CloudTurn the same manifest into a required check on pull requests.
- Manifest referenceEverything the manifest can say.
- AgentsWhat each editor hook sends and receives.

Design system governance for agents and CI
Governed byFragments

- Docs
- Components
- Pricing
- GitHub
- npm
- Changelog
- Terms
- Privacy