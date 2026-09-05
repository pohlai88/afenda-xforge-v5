# fragments.manifest.json

One file at the repository root. It is the contract: what a Fragment is in this codebase, which tokens are allowed, which compositions have names, and which house rules the loop can check. Its content hash is the FCID.
On this page

## Shape
fragments.manifest.json
`{
  "schemaVersion": 1,
  "designSystem": { "packageName": "@usefragments/ui", "importPath": "@usefragments/ui" },
  "tokens": { "prefix": "--fui-", "rule": "no-raw-values" },
  "primitives": [
    {
      "name": "Button",
      "members": ["Root"],
      "intents": ["action", "submit", "cta", "primary", "secondary", "destructive"],
      "props": ["as", "asChild", "fullWidth", "icon", "size", "variant"],
      "do": ["one primary per view", "verbs right-aligned", "at most two per cluster"],
      "dont": ["raw <button>", "clickable div", "three or more in a row: use Menu"],
      "exemplar": "apps/cloud/src/components/onboarding/StepScan.tsx:282"
    }
  ],
  "patterns": [
    {
      "name": "PageMasthead",`

Show 13 more lines

## Sections
designSystem. The package agents must import Fragments from. Every finding names it: replace `<button>` with `Button` from `@usefragments/ui`.
tokens. The custom-property prefix and the rule. `no-raw-values` turns `color: #f56138` into a finding with the token that should replace it.
primitives. One entry per Fragment. `intents` are how agents find it (search "primary action" → Button). `do` and `dont` are one line each. `exemplar` is a `path:line` in this repository that shows the Fragment used well; the card cites it.
patterns. Named compositions. A pattern has an intent, the Fragments it is made of, its shape in one line, and an exemplar. Agents search patterns before primitives.
grammar. House rules in plain sentences. A rule with a `check` id is enforced by the loop and the gate; a rule without one is read by agents and never enforced.
rules. The rule preset and any rule ids turned off. Presets are listed in the CLI reference.

## FCID
`node node_modules/@usefragments/cli/dist/loop.js card | sed -n 2p   # FCID: `…``

The FCID is `contractHash(manifest)`. It appears on the card, in every receipt, and on the Contract page in Fragments Cloud. A pull request evaluated against a different FCID than the one pinned is indeterminate, not a pass.

## Curating
`discover` fills `name`, `members`, `props`, `tokens.prefix`, and proposes exemplars from usage. A person writes intents, do, dont, patterns and grammar. Ten minutes for a library of seventy Fragments is typical; the Fragments repository's own manifest is the worked example.

## Next steps
- The loopFive minutes from init to a first correction.
- AgentsHooks for Claude Code, Cursor, and Codex.
- The gatePin this FCID and require it to merge.

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