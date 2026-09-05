# Fragments: the concept, extracted

Source: usefragments.com, read 2026-09-04. Unverified: this pass's skeptics died on a usage limit.

## The concept

Fragments answers one failure: an AI agent writing UI drifts from the design system at the call site — a raw <button> where Button exists, an invented prop or enum value, a hex colour or off-scale spacing, an arbitrary Tailwind class, a wrong import path, a local re-implementation of a canonical component, a missing companion part or a second primary action — and the drift is invisible in review because the rendered result looks plausible while lint, tsc and tests stay green. Documentation, rules files and prompt dumps do not fix it: a snapshot goes stale silently, a rule is not binding on a model that is confident, and a lookup step adds effort without improving the decision. The product's own sentence: the agent ignored your Button.

The mechanism, stripped of packaging, has five parts. (1) The design system becomes ONE committed, machine-readable contract: a closed catalog of components with named members and enumerated prop values, a token vocabulary under one prefix, named compositions (patterns), and house rules (grammar). What code can state — exports, members, props, token prefix, candidate exemplars — is DISCOVERED from source; what only a person can decide — intent, do/dont, patterns, which rules are house law — is CURATED; nothing is inferred at check time and nothing is fetched at scan time. The contract's identity is its content hash (FCID), and every check, verdict and receipt cites it. (2) The contract is put on the agent's WRITE PATH at three moments: a short card pushed into context at session start; a per-file check on every save whose findings are phrased as executable replacements ('path:line CODE message → deterministic repair | no fix') with stable codes and explain pages; and a diff-scoped proof at stop that refuses to end the session while introduced drift remains. Speed and zero network are preconditions, because a slow save hook gets switched off. (3) A pull channel (search intent → pattern with shape and exemplar; get component → intents, members, props, do, dont, exemplar; check source; query tokens) supplies the depth a sixty-line card cannot carry, over the same rule engine the hook uses. (4) The same contract, rules and engine run at merge and produce a three-state verdict — pass, block, or indeterminate that holds and never becomes a pass by waiting — plus a persisted receipt naming the contract hash, the introduced findings and the inspected population; exceptions are scoped, reasoned, expiring and admin-granted; bypasses are recorded in a ledger rather than hidden; adoption is a projection over what actually merged. (5) Governance must prove it is armed: inert configuration, a token source resolving to zero tokens, an unused or expired suppression, a hook that failed open, and a contract write without entitlement are themselves findings with codes; a doctor fires each hook with a real payload and prints what the agent would receive.

The load-bearing ideas, independent of Fragments: separate discovered from curated and never hand-type what code can state; keep enforced and advisory visibly distinct inside the contract file (a rule carries a check id or it is admitted to be prose); phrase every finding as a replacement the agent can execute so the agent repairs before the human looks; pin verdict identity to a hashed contract so a pass cannot be claimed against a contract that moved; treat 'unknown' as a held state, never a pass; block on a small contract tier (canonical component, shadow component, token vocabulary, upstream drift) and make taste opt-in so the gate stays on; and put one word on each thing across every surface, retiring synonyms, because a synonym is a second source for the same fact.

## Vocabulary

- **manifest** — fragments.manifest.json — the one committed file stating what a Fragment is here, which tokens are allowed, which compositions have names and which house rules are checkable; every check, verdict and receipt is evaluated against it (retired synonyms: policy, contract file, vocabulary, catalog).
- **Fragment** — A canonical component of the governed design system as the contract names it — the thing an agent must reach for instead of a raw element or another library's component.
- **primitive** — A manifest entry for one Fragment: name, members, props (discovered from exports) plus intents, do, dont and exemplar (curated); the closed list the check matches raw elements against.
- **pattern** — A named composition of Fragments with an intent, its parts, a one-line shape and an exemplar (StatStrip, DecisionDialog, PageMasthead); agents search patterns before primitives.
- **intent** — The search keys under which a Fragment or pattern is found ('primary action' → Button; 'three stats in a row' → StatStrip); written by a person, never inferred.
- **exemplar** — A path:line inside the governed repository showing a Fragment or pattern used well; proposed by discover, confirmed by a person, cited on the card and returned by get.
- **grammar** — House rules written as plain sentences in the manifest; a rule carrying a check id is enforced by the loop and the gate, one without is read by agents and never enforced.
- **check id** — The rule identifier (FUI####) attached to a grammar entry that makes it enforceable; its presence or absence is the enforced/advisory boundary, visible in the file itself.
- **FCID** — contractHash(manifest) — the 64-hex content hash that is the contract's identity; printed on the card, in every receipt and on the Contract page; a verdict against a different FCID than the pin is indeterminate, not a pass.
- **card** — A ≤60-line summary of the manifest (FCID, import path, primitive roots, 'Use for' lines with the dont, patterns, grammar) injected as context when a session starts, resumes, compacts or clears; budget 100 ms.
- **check** — Evaluation of one file (on save) or a diff (at stop, in CI) against the manifest by the compiled rule engine, producing findings; zero network, budget 300 ms p95 per file.
- **finding** — One drift from the manifest, always phrased as 'path:line FUI#### message → repair or no fix', naming the replacement and its import (retired synonyms: issue, violation).
- **repair** — The deterministic edit that resolves a finding — an exact range, replacement, certainty and reason — applied by fix/conform; some findings carry none (retired synonyms: autofix, codemod, suggestion).
- **prove** — The stop-time diff-wide check that holds the session until introduced findings are zero; the only refusal inside the editor.
- **gate** — The required fragments/contract-compliance check on a protected branch of a bound repository: the same manifest, rules and engine as the loop, plus a receipt and a ledger.
- **binding** — The connection of one repository to one pinned FCID through the GitHub App; the unit exceptions, receipts and the ledger are keyed by.
- **verdict** — The gate's answer for an exact head against the pinned FCID: pass (success), block (failure, with introduced findings and repair command), or indeterminate (action_required — the truth is not known and it never becomes a pass by waiting).
- **receipt** — The persisted evaluation (evr_…) behind a verdict: verdict, FCID, introduced findings, inspected population, suppressions and hook evidence, in a versioned schema whose every field carries a carriage class; public, read-only, no source lines.
- **exception** — An admin-granted, reasoned, expiring waiver of one finding; the check turns green, the merge is ledgered as excepted not clean, and the block returns when it lapses. In-source form: a directive naming the exact code, reason and expiry, whose misuse is itself a finding.
- **bypass** — A merge with no passing verdict and no exception — something the tool cannot prevent, so it is recorded, never hidden.
- **ledger** — One row per (binding, head) that merged: receipt, verdict and outcome ∈ clean | excepted | bypassed | unresolved; the adoption metric is a projection over it.
- **discover** — The CLI step that reads the library and writes the discoverable half of the manifest (name, members, props, token prefix, candidate exemplars), leaving intents, patterns and grammar empty for a person; stops and asks rather than guessing the import path.
- **tier** — Contract tier rules (prefer-library, shadow-component, css-vars-must-be-defined, upstream-drift) arm automatically when a contract is pinned; everything else is opt-in hygiene, so the customer default produces zero findings.
- **doctor** — Fires every hook with a real payload and prints what the agent would receive; green means the chain is armed on this machine, because an installed-but-broken hook is indistinguishable from a clean session.

## Transferable

### One committed, machine-readable contract at the root that every check, card and verdict reads, with its discoverable half generated from source and its curated half kept small

**Why:** A design system that lives only in code and prose has no surface an agent can query or a check can evaluate; a single artefact makes 'which vocabulary' a fact with one owner.

**Needs:** A generator that emits the identity half (components, members, prop enumerations, token names) from exports and token source; a separate, clearly marked curated section; the generated half never hand-edited.

**Checked by:** Byte-identical regeneration (generate, then git diff --exit-code) plus a population assertion that the contract lists at least the components on disk, and a test that hands the generator a fixture with an unexported component and watches it refused.

### Discover versus curate: code states what it can (exports, props, prefix, candidate exemplars); a person decides only what code cannot (intent, do/dont, patterns, which rules are law); nothing is inferred at check time

**Why:** Inference at check time makes verdicts differ between machines and days; hand-typing what code already states creates a second source that agrees until it does not.

**Needs:** A generator with refusals rather than defaults (stop and ask when the import path is ambiguous); a curated file whose keys cannot restate a generated fact.

**Checked by:** A schema that rejects a curated key that duplicates a generated one; a test that perturbs an export and asserts the generated half changes and the curated half does not.

### Content-hashed contract identity cited by every check, verdict and receipt

**Why:** A pass is meaningless unless it names which contract it passed against; a hand-bumped version string can be forgotten while the content moves.

**Needs:** A canonical serialisation (sorted keys, no timestamps) of the contract plus the rule engine version; the hash printed by the card and written into every report.

**Checked by:** A test that edits one byte of the contract and asserts the hash changes and a stored verdict against the old hash now reads indeterminate; a test that reorders keys and asserts the hash does not change.

### A short card pushed into context at session start, resume, compaction and clear, derived from the contract, capped in lines

**Why:** An agent that learns the vocabulary by trial re-learns it every session; a card that is derived cannot drift from the contract, and a cap keeps it inside the context budget.

**Needs:** A harness hook (SessionStart or equivalent) that injects additionalContext; a renderer from the contract; a resident process or a fast cold path.

**Checked by:** A test that renders the card from a fixture contract and asserts every primitive root and every checkable grammar rule appears, that it stays under the cap, and a doctor that fires the hook with a real payload and prints the card.

### Check on save as advisory findings; prove at stop as the one refusal, scoped to what the session introduced

**Why:** Per-file save checks catch drift at the moment it is written by the agent that wrote it; a single refusal at stop means a session cannot end with new drift while pre-existing debt does not block every edit.

**Needs:** PostToolUse and Stop hooks (or equivalents) wired to the same engine; a baseline (git diff or a checkpoint) that defines 'introduced'; budgets that keep the write path fast.

**Checked by:** A test that writes a file containing a known violation through the hook path and asserts the finding text; a test that stops a session with an introduced violation and asserts the block, and with only pre-existing violations and asserts no block.

### Every finding is a replacement the agent can execute: location, stable code, message naming the Fragment and its import, and a deterministic repair or an explicit 'no fix'

**Why:** A bare 'violation' is not repairable; a finding that names the replacement lets the agent fix before the human looks, and the explicit 'no fix' tells it to hand-repair rather than guess.

**Needs:** A rule engine whose rules return structured findings with a suggested edit, certainty and reason; a per-code explain page or equivalent that lives with the rule source.

**Checked by:** A snapshot test per code over a fixture violation asserting the exact finding line and repair edit; a test that applies every repair and re-checks to zero findings; a test that every emitted code has an explain entry.

### Stable, versioned finding codes shared by every surface (hook, CLI, MCP, report)

**Why:** A receipt stays meaningful when message wording changes; an agent can find remediation from the code alone; a synonym for a finding is a second source.

**Needs:** A code registry with severity, tier and fix mode per code, generated into the explain reference; families by leading digit or by rule group, not both.

**Checked by:** A test that the registry has no duplicate codes, that every rule emits a registered code, and that the generated explain reference is byte-identical to the registry.

### Grammar rules carry a check id or are admitted to be advisory, in the file itself

**Why:** A rule read and never enforced is decoration; naming the boundary inside the contract stops anyone mistaking a guideline for a guard.

**Needs:** A schema that distinguishes {rule, check} from {rule} and a report of which rules are armed.

**Checked by:** A test asserting every check id named in grammar resolves to a rule that has been shown a violation, and a report line counting unchecked rules so the number is visible rather than silent.

### Named patterns searched before primitives, with a shape and a repo-local exemplar

**Why:** Agents re-invent compositions the team already named; 'three stats in a row' should resolve to StatStrip, not three Cards.

**Needs:** A pattern table (name, intent, parts, one-line shape, exemplar) and a search over intents; exemplars that resolve to real code.

**Checked by:** A test that every pattern's parts are primitives in the contract and every exemplar path:line exists and contains the pattern's root component (liveness, which Fragments lacks).

### Exemplars are real code in the governed tree, not synthetic snippets, and their liveness is checked

**Why:** An exemplar in the same tree the agent edits conforms by construction and is found by grep; a path:line that nothing re-verifies rots on the next edit.

**Needs:** Exemplar references by symbol or anchor rather than raw line number, or a check that re-resolves them.

**Checked by:** A test that resolves every exemplar and runs the checker over it to zero findings; a test that moves a fixture exemplar and watches the reference refused.

### Three-state verdict with a held indeterminate that never becomes a pass by waiting

**Why:** A gate that fails open on a timeout, a crash or a moved contract is not a gate; mislabelling 'could not look' as 'found violations' sends people chasing phantom fixes.

**Needs:** A verdict type with three values, a distinct exit code or status for indeterminate, and the causes (contract moved, population too large, analysis failed) carried in the receipt.

**Checked by:** A test that evaluates a head against a hash other than the pin and asserts indeterminate; a test that injects an analysis exception and asserts indeterminate rather than pass; a test that a stored indeterminate is not re-read as pass.

### Introduced-only blocking with a baseline: legacy debt is counted, not gating, and the ratchet (adoption floor) cannot slide back

**Why:** A big-bang gate on a codebase with existing drift is switched off on day one; a ratchet lets the contract be adopted and then only tightens.

**Needs:** A baseline file committed in the tree, diff scoping, and a counted-but-not-gating category in the report.

**Checked by:** A test that a violation present in the baseline does not block and the same violation in a changed file does; a test that lowering adoption below the committed floor blocks unless the floor file is in the diff.

### A receipt: the persisted, immutable evaluation behind every verdict, carrying contract hash, introduced findings, inspected population, active rules and hook evidence, in a versioned schema

**Why:** A verdict becomes evidence rather than an assertion; a green over zero inspected sites or zero active rules is visible as such.

**Needs:** A report schema with a version pin and per-field carriage class; counts of files scanned, rules active, sites checked; a store keyed by (repository, head, hash).

**Checked by:** A schema test over every field; a test that a run over an empty population produces a receipt whose checkedSites is zero and whose verdict is indeterminate or explicitly flagged, never pass.

### Expiring, reasoned, scoped exceptions — admin-granted centrally, or in-source directives naming the exact code, reason and expiry — with misuse itself diagnosed

**Why:** An escape hatch without an expiry becomes permanent debt; an unused or expired suppression that persists silently is a second source of truth about what is allowed.

**Needs:** A directive syntax bound to one code and one statement; codes for unused, expired and missing-expiry suppressions; the ledger distinguishing excepted from clean.

**Checked by:** Tests that an unused directive, an expired directive and a directive without expiry each produce their own finding; a test that a valid directive suppresses exactly the named code at exactly the attached statement and nothing else.

### Record bypasses rather than pretend to prevent them; derive adoption from what merged, not from self-report

**Why:** An admin can always merge red; the honest design makes the bypass a permanent, queryable fact and measures drift from the ledger.

**Needs:** A merge observer keyed by (repository, head) and an outcome column; without a hosted product this is a local log appended by the same tool that produces the verdict.

**Checked by:** A test that a merge without a passing verdict yields a bypassed row and a merge under an exception yields excepted, never clean.

### Contract tier versus opt-in tier: block on canonical component identity and token vocabulary; make taste opt-in; produce zero findings until a contract exists

**Why:** A required check that fails on everything is switched off; a tool that is noisy on day one is uninstalled.

**Needs:** A tier field per rule and a preset that arms the contract tier when the contract is pinned.

**Checked by:** A test that with no contract pinned the checker emits zero findings over a fixture full of opt-in violations, and that pinning arms exactly the contract-tier rules.

### Governance proves it is armed: inert configuration, an unconsumed key, a token source resolving to zero tokens, a rule with no matching population and a hook that failed open are findings with codes; a doctor fires every hook with a real payload

**Why:** Installed, configured, green and blind is the failure this repository has already met (depcruise cruised one module); a configuration that looks like enforcement but arms no rule must report itself.

**Needs:** An integrity summary (armed rules, inert keys, populations) in every report; a doctor command; population assertions inside every check.

**Checked by:** A test that a config with an unknown key produces the inert-key finding; a test that a token source globbing nothing produces the zero-tokens finding; doctor output asserted to contain each hook's real payload.

### Speed and zero network as preconditions for anything on the write path, with budgets stated and measured

**Why:** The loop is on the write path, so it is fast or it is off; a hook that fetches makes verdicts differ by machine.

**Needs:** A compiled contract held in memory (resident process or fast cold path); budgets per event; a test that asserts no network call during check.

**Checked by:** A benchmark recorded in the tree with the machine and date; a test that stubs the network layer and fails if any request is attempted during card, check or prove.

### A pull channel over the same engine — search intent, get component, check source, query tokens — local, stdio, zero network

**Why:** A sixty-line card cannot carry seventy components; an agent that can check before writing repairs less after saving.

**Needs:** A local server reading the compiled contract; tool results derived, never hand-written; the same rule engine as the hook.

**Checked by:** A test that check-through-the-pull-channel and check-through-the-hook return identical findings for the same source; a test that get returns exactly the contract's fields for a fixture component.

### Shadow-component identity decisions: a local wrapper around a canonical primitive must be promoted, sanctioned or dismissed, and an undecided or dismissed one is a contract-tier finding

**Why:** A second implementation of Button is a second source of the Button fact; forcing the decision keeps the canonical set closed.

**Needs:** A declared canonical set, a bridge concept (which implementation file may import the underlying library), and a decisions file keyed by portable component identity.

**Checked by:** A test that a fixture wrapper with no decision produces the shadow finding, that a sanctioned one does not, and that an authored file importing the underlying library outside the bridge's implementation files is refused.

### Upstream token drift: a local token that declares an upstream and diverges from it is a contract-tier finding; vocabulary comes only from declared sources, never globbed or fetched

**Why:** This is the second-source defect named in CLAUDE.md, applied to tokens: two copies agree until they do not and nothing complains in between.

**Needs:** Declared, pinned upstream sources with digests; alias mapping; no scan-time I/O beyond the checkout.

**Checked by:** A test that changes one local token value under a declared upstream and asserts the drift finding; a test that an undeclared package's tokens are not admitted to the vocabulary.

### Composition rules over named members: co-occurrence (Input needs Field.Label; Dialog.Content needs Dialog.Title) and cardinality (one primary action per region)

**Why:** Compound components deliver semantics only when their parts co-occur; hierarchy drift (a second primary button) is what a prop-level check cannot see.

**Needs:** A member namespace per component, a definition of region, and rules that walk a JSX tree rather than a string.

**Checked by:** Fixture tests with a missing companion and with two solid Buttons in one footer, each watched red; a test that 'region' resolves deterministically for nested compounds.

### Negative space as data: for every component, when NOT to use it and the alternative (Button for navigation → Link)

**Why:** Props and types say what is valid; whenNot says what is correct; it is the field human docs leave implicit and the one that decides correctness.

**Needs:** A curated dont/whenNot field that names the replacement component so it is actionable, and a rule (preferred-component) that can enforce the ones that are checkable.

**Checked by:** A test that every whenNot alternative names a component in the contract; where a check id exists, a fixture test that the wrong choice is refused.

### One word per thing across every surface, with retired synonyms listed and where each concept lives in code

**Why:** Agent and human must read the same noun in the card, the finding and the docs; a synonym is a second source for the same fact.

**Needs:** A glossary generated from or checked against the code's identifiers, not a hand-maintained table.

**Checked by:** A test that every glossary term appears as an identifier at the location the glossary names, and a grep that refuses a retired synonym in authored prose or messages.

### The AI-facing reference is generated from the same source as the checks and marked do-not-edit

**Why:** A catalog and its documentation are one fact; two copies drift.

**Needs:** A generator that emits the reference (components, members, props, tokens, rules, codes) from the contract and the rule registry.

**Checked by:** Byte-identical regeneration of the reference in the fast loop.

### Privacy as a schema property: a report carries offending literals in named fields with a declared carriage class and never whole files, lines or function bodies

**Why:** A verdict that must be shared (with a reviewer, a tool, a log) should be approvable field by field rather than by promise.

**Needs:** A report schema with a carriage-class tag per field group and a version pin.

**Checked by:** A schema test asserting no field may carry more than the offending substring; a test that a fixture with a secret in the same line does not leak it into the report.

### Hook evidence carried into the verdict: which hooks were installed, which decisions they took, including fail-open

**Why:** A green gate above a hook that failed open must be distinguishable from one above a hook that denied.

**Needs:** Bounded event records (deny, downgrade, suppress, fail-open) written by the hook and read by the report.

**Checked by:** A test that a simulated hook crash produces a fail-open event in the report rather than nothing.

### Selective, relevant-first, example-led, token-budgeted context rather than a full dump

**Why:** The cited research (with its limits: Python APIs, 2024-2025 models) supports injecting the three to five relevant components with composition and examples, relevant first, and warns that naive augmentation degrades what the model already knew.

**Needs:** A context generator with a relevance query, an ordering rule and a size estimate; examples as the primary unit.

**Checked by:** A test that the generated context for a fixture intent contains the matching pattern first and stays under the budget; an eval comparing agent output with and without the card on a fixed task set, recorded with numbers.

## Product-only

- **Fragments Cloud repository binding via the GitHub App, and the fragments/contract-compliance required check on a protected branch** — Presupposes GitHub as the only host, branch protection and a subscription; the CONCEPT (same engine at merge, three-state verdict) transfers, the delivery vehicle does not — and this repository removed CI, PR gating and protection by decision.
- **Hosted MCP at app.usefragments.com with OAuth (design_system/list_primitives, list_tokens, conform, prove_compliant, edit_contract, get_evaluation)** — Exists so agents without the checkout can reach the pinned contract; requires sending generated code to the vendor; the surface has already churned (catalog, lint, findings, fix, scan, autofix, suggestions were removed). The local stdio MCP over the same engine is the transferable half.
- **prove_compliant's suspend-on-MCP-Sampling fallback and hash-keyed replay** — A hosted loop that asks the client's model to fix what deterministic repair cannot; the validate-fix-validate idea transfers, the sampling hop is a hosted-product feature.
- **Public evr_ receipts hosted by the vendor** — Persistence and read-only immutability transfer as a local receipt file; public-by-default hosting carrying offending source literals is a product choice.
- **Admin-role exceptions granted in the Cloud UI and the Adoption page as a ledger projection** — Role gating needs an identity system the product supplies; the expiring, reasoned, ledgered exception transfers as an in-source directive and a local log.
- **Pricing per repository (Pro $219/month, 3 repositories, 14-day trial; Enterprise), and FUI9012 contract/write-not-entitled** — The commercial boundary surfaced as an error code is a product mechanism; nothing about it informs a design.
- **Cloud contract editing (contract sources add/list/remove/replace, contract undo, edit_contract with undoable receipts and pending revisions)** — Solves keeping a remote pin correct as files move; in a repository where the contract is generated from the tree there is no remote pin to repair.
- **The @usefragments/ui component library on Base UI, its 69-component catalog, nine groups, four blocks, and the ruled prop vocabulary codemod** — A component library packaged as governance; this repository has its own adapters on its own vendored primitives, and the ui-vocabulary codemod rewrites call sites to the vendor's prop names.
- **Seed-based theming: four SCSS seeds ($fui-brand, $fui-neutral, $fui-density, $fui-radius-style) derived into ~200 custom properties** — A library theming choice that assumes a generated palette is the brand; the principle 'small authored surface, derived rest' is already how gen:tokens works here, and OKLCH derivation is deferred in STATE.md pending the generator resolving color-mix.
- **Registry source-install with .fragments/registry-lock.json and registry status/diff/sync/migrate, and the team registry served from Cloud with a workspace key** — Distribution of the vendor's component source and reconciliation against its origin; this repository refreshes its vendored shadcn tree by a different route and blocks the ui/* path from outside via the exports map.
- **The @usefragments/cli packaging: init writing .claude/settings.json, .cursor/hooks.json, .codex/hooks.json; the FSL-1.1-MIT licence on the CLI** — The hooks themselves are transferable; the installer and its licence are product.
- **Product-area topology (area.criticality, owners[], matchedGlob) and per-area before/after impact in the receipt** — Useful in an organisation with many owning teams; a single-owner repository has no population for it and it would be a table nothing reads.
- **Vendor-measured budgets (64 ms card, 38 ms warm check, 230 ms prove) and the 'network calls 0' test assertion** — The numbers were measured by the vendor on the vendor's repository on 2026-09-02 with hyperfine; the discipline (state and measure budgets, assert no network) transfers, the figures do not.
- **The per-code explain pages hosted at usefragments.com/errors** — Hosted documentation; the transferable form is an explain entry generated beside the rule registry and read by a local explain command.

## Overlap with v4

- fragments.manifest.json — one committed contract naming components, tokens, patterns and grammar → packages/design/generated/style-manifest.json (157 STYLE symbols → classes and tokens, six omitted roles with reasons, M3 placement per colour root), generated by gen:tokens from the policy barrel; component identity lives in each Adapter's exported axis table and provenance header and is discovered by readdirSync in tests. No root document names components, patterns or grammar. (v4 has a weaker form)
- designSystem.packageName / importPath, and imports/preferred-path (FUI1003) → packages/design/package.json exports map (./components/*, ./policy, ./style-manifest.json; ./components/ui/* is null) plus Biome noRestrictedImports refusing relative cross-package paths, deep @xforge/*/src or /policy imports and @/ paths. A wrong path is a resolution or lint failure, not an advisory finding. (v4 has a stronger form)
- tokens no-raw-values, styles/no-raw-color/dimensions/spacing/typography, tailwind/arbitrary-* (FUI2004-2008, 2016) → tests/unit/design-system-classes.test.ts 'the authored layer selects style; it does not write it' (lexical scan of every string literal in packages/design/src refusing themed prefixes and bracketed arbitrary values; 46 literals watched red), plus NativeProps removing className and style from every public Target so a screen cannot pass a class at all, plus generated/style.ts as the only class source. Raw values are unrepresentable at the screen and refused at the component. (v4 has a stronger form)
- primitives[] name/members/props as the checkable identity; props/invalid-value (FUI6002) and components/unknown-prop (FUI6005) → Each Adapter's exported frozen axis table (ALERT_TONE, BUTTON_VARIANT, TEXT_TONE) typed as const, so an unknown prop or an out-of-enum value is a tsc error at the call site rather than a lexical finding; adapter-schema.test.ts holds every authored file to the shape. The closed set is enforced by the compiler, not matched by a linter. (v4 has a stronger form)
- primitives[] as a queryable catalog an agent can list or get (members, props, intents, do, dont, exemplar per component) → None. There is no listing of components as data; style-manifest.json covers style symbols only, FOUNDATIONS.md covers custom properties, and the axis tables are TypeScript exports an agent must read file by file. (v4 lacks it)
- intents, do, dont per primitive (curated guidance on the card and via get) → The four-label provenance header (Adaptee / Intent / Owns / Contract) whose Intent means adaptation intent (ADOPT / INSPIRE), not usage intent; adapter-schema.test.ts checks only that the labels are present. Usage guidance is CLAUDE.md prose and gallery State names. (v4 has a weaker form)
- patterns[] — named compositions searched before primitives → None as data. Compositions appear only as State names inside apps/web/app/gallery/specimens.tsx ('In a form, with a label and a hint', 'A half-open period') and inside stories; nothing consumes them by name. (v4 lacks it)
- grammar[] — house rules with an optional check id; policy without a check is admitted to be prose → packages/design/policy/define-policy.mjs: a policy is exactly {id, kind, assert}; a missing or non-function assert is refused on import ('policy without enforcement is documentation'); the registry refuses duplicates and freezes. There is no advisory slot at all — the unenforced half lives in CLAUDE.md as rules 1-6 and in STATE.md. (v4 has a stronger form)
- rules.preset and rules.off — narrowing the rule set, committed and hashed → None. Every generator refusal and every test is always on; there is no preset, no off-list and no tiering. (v4 lacks it)
- FCID — content hash of the contract cited by every verdict; mismatch → indeterminate → TOKEN_CONTRACT_VERSION '2.0.0', a hand-bumped semver in policy/vocabulary.mjs written into style-manifest.json and asserted equal in tokens.test.ts; drift in generated output is caught by byte identity (gen:tokens && git diff --exit-code) and by the unit case regenerating over the shipped options. No digest is emitted, stored or cited (grep for createHash/sha256/contractHash finds nothing). (v4 has a weaker form)
- discover — code states what it can (exports, props, prefix); a person curates the rest; nothing inferred at check time → gen:tokens (policy/generators/tokens.mjs) derives all six generated artefacts from tokens.json and the policy tables with refusals rather than defaults; the token half of 'code states what it can' is fully realised and byte-identical. The component half (discovering members and props from exports into a manifest) does not exist. (v4 has a stronger form)
- Card at session start (SessionStart hook injecting a ≤60-line derived summary) → CLAUDE.md and AGENTS.md read by the harness at session start; STATE.md and .claude/skills load only when opened or invoked. .claude/settings.json declares no SessionStart hook and its $comment says the one hook 'decides nothing and blocks nothing'. The instruction file is hand-written prose, not derived from the contract. (v4 has a weaker form)
- Check on save (PostToolUse) returning findings as additional context → One PostToolUse hook on Write|Edit running `pnpm run fix --skip=correctness/noUnusedImports` — a formatter. Every check that can refuse runs only when the agent runs the fast loop by hand. (v4 has a weaker form)
- Prove on stop — diff-scoped check that holds the session until introduced findings are zero → None. 'Green' is the five-command fast loop run by the agent with exit codes read directly and reported; nothing invokes it and nothing refuses a stop. (v4 lacks it)
- Finding — 'path:line FUI#### message → repair | no fix' with a stable code and explain page → Thrown Errors with long prose messages ('tier direction forbids', 'below the 24px floor', 'rebound by both') pinned by regex in tests; Vitest assertion failures with file:line. No code, no catalogue, no repair. (v4 has a weaker form)
- Repair — deterministic edit with certainty and reason; fix / conform → Biome fix on save (formatting and lint autofix only); nothing computes a design-system repair. (v4 lacks it)
- Resident daemon and budgets (card ≤100 ms, check ≤300 ms, prove ≤1 s, network 0) → None; the unit suite includes 30-second compile cases and runs on demand. ABSTRACT.md declines tooling beside the library under rule 6. (v4 lacks it)
- doctor — fires every hook with a real payload and prints what the agent receives → No hook chain to prove. The nearest discipline is stories.browser.test.tsx mounting every story in Chromium (proving the second reader actually renders) and design-system-classes.test.ts compiling through the application's own PostCSS pipeline (proving the style pipeline is armed). (v4 lacks it)
- Local stdio MCP — search / get / check / tokens over the same engine → Declined in .claude/llmx/prototyper-ui/ABSTRACT.md under rule 6. Machine-readable surfaces exist as files an agent can read: style-manifest.json, generated/FOUNDATIONS.md (every custom property with tier, type, value), tokens.json (DTCG 2025.10). The configured MCPs (shadcn-studio, Figma) are third-party and their output is treated as data. (v4 has a weaker form)
- The gate (required check, three-state verdict, receipt, exception, ledger) → None, by decision: no CI, no PR gate, no branch protection, no verify script; the agent's report of which commands ran and what they returned is the whole record. (v4 lacks it)
- Three-state verdict with a held indeterminate → Exit codes only (a crash and a violation are both non-zero). The population assertions in every test ('has a population', >20 literals, >20 exports) refuse the vacuous green that indeterminate exists to prevent, but there is no third state and no report line saying why a run could not decide. (v4 has a weaker form)
- Introduced-only findings, baseline, adoption floor (ratchet) → None. Every check runs over the whole population and tolerates no debt; there is no baseline file and no notion of 'introduced'. The whole-population stance is stricter but cannot be adopted incrementally on a codebase with existing drift. (v4 lacks it)
- Receipt — persisted evaluation with contract hash, findings, inspected population, active rules, hook evidence → The agent's message reporting each command and its exit code (CLAUDE.md report contract, VERIFIED vs ASSUMED); prose, not persisted, not schematised. (v4 has a weaker form)
- Exceptions — reasoned, expiring, scoped; in-source directives with FUI9001-9003 for misuse → NOT_STORIED and NOT_SHOWN entries requiring a >20-character reason, and PROFILE_COVERAGE rows that must state a covering spec or a gap sentence (assertKeyboardCoverage). Reasoned and presence-checked, but no expiry, no code, no scope to one statement, no misuse diagnostics; all eight coverage rows are currently satisfied by gap sentences alone. (v4 has a weaker form)
- Merge ledger — one row per merged head with outcome clean | excepted | bypassed | unresolved → None; git history is the only record and it does not carry a verdict. (v4 lacks it)
- Contract tier vs opt-in tier; zero findings until a contract exists → None; every refusal is always armed. There is no adoption story for a codebase that starts with drift. (v4 lacks it)
- FUI error code scheme with per-code explain pages (54 codes, severity, tier, fix mode) → None; refusals are prose messages and there is no docs/ directory. (v4 lacks it)
- Governance integrity: inert config, unconsumed keys, zero-token sources, unmatched excludes reported as findings; inspected-population accounting (health.checkedSites) → Checks that can actually fail, realised in code: every test asserts its population before asserting its property, the generator refuses a colour root with no STYLE word and a mode that invents a token, and design-system-classes.test.ts shows the detector bg-not-a-role. Same idea at test granularity rather than as a per-run report. (v4 already has it)
- Deterministic replacement with certainty (groups[].suggestedReplacement, edit.{file,start,end}) → None. (v4 lacks it)
- Declared-manifest-only vocabulary; scans never fetch; verdict deterministic across machines → tokens.json is the only design-value source; the generator reads the checkout and nothing else; the compile test runs the application's own PostCSS from apps/web. No package vocabularies need declaring because none are admitted. (v4 already has it)
- Canonical sources, bridges and identity decisions; components/shadow-component (FUI1007) and prefer-library (FUI1004) → The vendored ui/ tree is unreachable from outside the package (exports './components/ui/*': null); adapter-schema.test.ts refuses `export * from '#components/ui/'`, exported types built on an adaptee, and primitives reached except through their adapters; the Adaptee label names the bridge. Shadowing a primitive from a screen is structurally impossible rather than detected. (v4 has a stronger form)
- tokens/upstream-drift (FUI2017) — local token diverging from a declared, pinned upstream → None, because there is no upstream: tokens.json is the single source and M3 is mapped as prior art with a recorded 'why' per departure (style-manifest.json roles, type-placement.test.ts), not pinned as a value source. (v4 lacks it)
- tokens/css-vars-must-be-defined (FUI2015) — var(--x) outside the vocabulary → design-system-classes.test.ts asserts every class in style-manifest.json is emitted as a selector by the application's own Tailwind build, that narrowed roles refuse wrong channels, and that the numeric spacing scale compiles to nothing; the cascade simulator in tokens.test.ts resolves every var() chain. Proved against the real compiler rather than a lexical vocabulary list. (v4 has a stronger form)
- theme/no-theme-coupled-literal (FUI2014) and light/dark WCAG-safe derivation → The cascade simulator asserts dark rebinds colour not geometry, compact rebinds geometry not colour, dark+compact is their composition and the result is order-independent; COLOR_PAIRS asserts every declared ink/fill pair clears its floor in both themes; the generator refuses a theme mode touching geometry. Theme coupling is impossible to author, not merely refused when written. (v4 has a stronger form)
- Ruled prop vocabulary (variant / tone / size / gap) with per-component value subsets → Per-component axis tables (BUTTON_VARIANT, ALERT_TONE, TEXT_TONE, GRID_COLUMNS) exported as const and asserted against rendered DOM in per-component tests; tsc closes the values. Same shape, enforced by the compiler. (v4 has a stronger form)
- Tokens reachable through props (Box padding=none|xs|sm|md|lg|xl, Text role=…) so raw values are never needed → Components select from the 157-symbol STYLE tree (accent.primary.background, interaction.checked.background, typography.body); a symbol that does not exist is a type error; screens cannot pass className. The selection surface is the whole vocabulary. (v4 has a stronger form)
- Exemplar — a path:line to gold usage, cited on the card, never re-verified → packages/design/stories held set-equal to src/components (stories.test.ts), every story mounted in Chromium (stories.browser.test.tsx), and the gallery enumerating every axis value with the employee screen's real copy (gallery.test.tsx asserts every tone, variant, level and slot renders). Exemplars exist for a person or browser, not as data, but their existence and liveness are checked. (v4 has a stronger form)
- a11y/required-accessible-name (FUI3001), a11y/standard (FUI3002) → interaction/accessibility.mjs holds WCAG floors separately from house floors and M3 benchmarks; contrast is enforced in the generator (disabled roles measured, alpha refused) and read back in the gallery colour plate; keyboard is a coverage-declaration gate with every row currently declaring a gap. No AST-level accessible-name check exists. (v4 has a weaker form)
- composition/co-occurrence (FUI5004) and composition/cardinality (FUI5003) → None. Field composes description and error internally and the gallery shows them together, but nothing refuses an Input without a label or two primary buttons in one region. (v4 lacks it)
- fragment/source-drift (FUI9011) — definition diverging from component source → Byte-identical regeneration for everything generated, and per-component tests (e.g. alert.test.tsx) asserting the rendered DOM agrees with the exported table, with the mutation watched red. Definition and source cannot diverge silently for 15 of 23 components; 8 have no test. (v4 has a stronger form)
- Generated AI reference (llms-full.txt) marked do-not-edit → generated/FOUNDATIONS.md and style-manifest.json emitted by the same generator run as tokens.css and style.ts, excluded from Biome and held byte-identical. Covers tokens and style symbols; no component reference is generated. (v4 has a weaker form)
- Vocabulary discipline — one word per thing, retired synonyms, where each lives in code → STYLE_NAMES in foundations/style.mjs is the one place Xforge's word meets the role's class, and assertStyleNames refuses an unnamed root or a word given twice; CLAUDE.md fixes the nouns (Target, Adapter, symbol). Enforced for the style vocabulary, prose for everything else; no glossary. (v4 has a stronger form)
- Co-located contract.json with usage.whenNot, relations and status per component (blog thesis) → The provenance header and exported axis table beside each component, which the DOM test reads; no whenNot, no relations, no status. Identity is stronger (checked against render), guidance is absent. (v4 has a weaker form)
- Seed-based theming — four seeds derived into ~200 properties → tokens.json authors each token with alias resolution across theme and density axes; the generator derives six artefacts but not a palette; OKLCH derivation is deferred in STATE.md until the generator can resolve color-mix. (v4 has a weaker form)
- Second reader / visual read-back (not a Fragments mechanism; listed because it fills a hole in Fragments) → The dev-only gallery's plates print which STYLE symbols the browser was handed, measured WCAG ratio from computed style, and computed size/leading in px, recomputed on theme and density change; Storybook is an independent second reader through the application's PostCSS. Fragments has nothing that looks at rendered output. (v4 has a stronger form)

## Overlap with Prototyper Compose

- fragments.manifest.json — the committed contract (components, props, tokens, patterns, grammar) vs The Zod catalog — one schema per component type that the spec is validated against and the renderer dispatches on: Compose's catalog IS the executable type: it validates at parse time, renders, and is derived into the prompt from one object, so it cannot drift from what renders. Fragments' manifest is a JSON file beside the code that a linter reads; its identity half is discovered from exports and its guidance half is hand-typed, so it can drift from both source and rendering. Compose governs only its own JSON spec; Fragments governs arbitrary JSX an agent wrote to disk.
- primitives[].props with alphabetical enum values; props/invalid-value and components/unknown-prop rules vs Zod object schemas with z.enum() per prop and strict object parsing: Same closed set, opposite enforcement point: Zod refuses an unknown key or out-of-enum value before anything renders (unrepresentable); Fragments detects it after it is written and phrases a finding. Zod carries types (number, function, union) that Fragments' name-only prop list lacks; neither encodes scale ordering.
- Card at session start (≤60 lines derived from the manifest) vs The catalog derived into a prompt: Both push a derived summary of the vocabulary into context before generation. Compose's prompt is derived from the same Zod object that validates, so prompt and validator cannot disagree; Fragments' card is derived from the manifest, which is a separate artefact from the code and rules. Compose has no session-lifecycle hook; the prompt is composed per request.
- Check on save (PostToolUse) — advisory findings on the file just written vs Validation — Zod parse of the spec the model emitted, before render: Compose validates the model's output at the boundary and refuses to render an invalid spec; there is no 'advisory' state and no file. Fragments checks source on disk after the write, returns context the agent may ignore, and refuses only at stop. Compose's unit is a spec; Fragments' is a file then a diff.
- Prove on stop / the merge gate (pass, block, indeterminate; receipt; ledger) vs None; validation at render is the only gate: Compose has no notion of a session, a commit, a verdict record or an indeterminate state — a parse either succeeds or fails, two-valued. Fragments' gate is about what merges; Compose's validation is about what renders now.
- Finding phrased as a replacement with a stable code and a deterministic repair vs Zod issue list (path, code, expected, received): Zod issues name the path and expected shape but carry no repair, no import to swap in and no explain page; Fragments carries an exact edit with certainty. Compose expects the model to regenerate the spec; Fragments expects the agent (or fix) to repair the code.
- Streaming (Compose) versus the resident daemon and budgets (Fragments) vs Streaming — the spec renders progressively as the model emits it: Compose optimises latency of generation-to-pixels; Fragments optimises latency of write-to-finding. Fragments has no runtime and nothing to stream; Compose has no post-hoc check and nothing to budget.
- Expressions (Compose) versus static source governance (Fragments) vs Expressions — runtime data binding evaluated inside the spec: Compose governs a running artefact with live values; Fragments governs static JSX before it runs and has no equivalent. A Fragments rule cannot see a value bound at runtime; a Compose expression cannot be lexically checked for a raw colour unless the schema forbids the field.
- Code export (Compose) versus conform / repair (Fragments) vs Code export — the validated spec emitted as real component code: Opposite directions: Compose turns a validated spec into code (correct by construction, then handed over); Fragments turns already-written code back toward the contract. Once Compose exports, the exported code leaves its validator; Fragments' loop is what would govern it from then on.
- tokens no-raw-values and the styles/tailwind rule family vs Catalog schemas without free-string style or className props; enumerated tone/size/spacing props: Compose makes raw values unrepresentable if the catalog omits the escape hatch; Fragments lists className and style as legitimate props on many components and then polices what passes through them with regex-class rules. Compose's approach is the stronger one and is the one v4 also takes (NativeProps).
- components/prefer-library and components/shadow-component vs Discriminated union over catalog component types; an unknown type fails parse: Compose cannot express a raw <button> or a local wrapper at all — the spec only names catalog types; Fragments detects a raw element or a shadow after the fact. Compose has no identity workflow (promote / sanction / dismiss) because there is nothing to decide.
- patterns[] — named compositions with a shape and an exemplar vs None as a named layer; compositions are instances in the spec tree (children arrays): Compose composes by nesting catalog nodes; a 'StatStrip' exists only as a tree the model emits or an example in the prompt. Fragments names the pattern, gives it an intent and points at real code. Both lack a check that a composition is the named one.
- intents, do, dont per primitive (curated guidance) vs Schema .describe() strings carried into the derived prompt: Compose's guidance sits on the schema field itself, so it is colocated with the validator and cannot be orphaned; Fragments' sits in a manifest beside the code and is never checked. Neither is enforced — both are text the model reads.
- Exemplar — a path:line in the governed tree vs Example specs in the prompt (few-shot) and code export as a source of examples: Compose's examples are specs, validated by the same Zod catalog, so an example cannot be invalid; Fragments' exemplar is a line number nothing re-verifies. Compose's examples live outside the product tree; Fragments' live inside it.
- FCID — content hash of the contract vs None; the catalog is the imported module at runtime: Compose's contract identity is whatever schema object is loaded — no hash, no pin, no 'indeterminate' when it changes. Fragments hashes because its contract is a file evaluated by separate processes at separate times.
- discover — derive the manifest's identity half from exports vs Catalog → prompt derivation: Derivation runs the other way: Compose starts from hand-written Zod schemas and derives the prompt; Fragments starts from component source and derives the manifest, then hand-writes guidance. Neither derives the schema from the component's TypeScript props, so both hold a second copy of the prop set (Fragments in JSON, Compose in Zod).
- Local MCP search / get / check / tokens (pull channel) vs None; the derived prompt is push-only: Compose gives the model the whole catalog up front in the prompt; Fragments caps the push at sixty lines and lets the model pull depth. Compose's approach scales with catalog size in prompt tokens; Fragments' scales with the model's willingness to call tools.
- Three-state verdict with held indeterminate vs safeParse success | error: Two states; a thrown error inside a custom refinement is an exception, not a distinguished 'could not decide'. Compose has no need for indeterminate because there is no contract pin to move and no population to be too large.
- Exceptions, suppressions, bypass and ledger vs None: Compose has no waiver concept: a spec is valid or it is not rendered. The escape hatch, if any, is a catalog change.
- Governance integrity and inspected-population accounting vs None explicit; the catalog's completeness is whatever schemas were registered: Compose has no report of which schemas were active or how many nodes were validated; a catalog with one component silently constrains generation to that component. Fragments reports armed rules, inert config and sites inspected.

## Weaknesses in Fragments a better design should avoid

- The manifest is a hand-curated second source beside the code. intents, do, dont, patterns, grammar and exemplars are typed by a person into JSON that nothing derives from source and nothing checks against source; discover runs once and re-runs by hand; only name/members/props drift is caught (FUI9011). Fragments names the second-source defect in its own rules (upstream-drift, shadow-component) and reproduces it in its own contract. A better design generates everything code can state on every run, keeps the curated remainder minimal, and refuses a curated key that restates a generated fact.
- A grammar rule without a check id is read and never enforced, anywhere, and the file admits it. That is honest but it puts decoration inside the artefact whose hash is supposed to mean 'what is enforced'. A better design either refuses to hold an uncheckable rule in the contract, or hashes only the checkable subset and keeps advisory prose in a separately named file so the FCID never covers a sentence nothing can fail.
- The gate lives in a paid cloud with GitHub as the only host. Without Cloud the CLI rung has only a boolean passed and no indeterminate state; the in-editor refusal (Stop) is bypassed by disabling hooks or not stopping. The transferable design runs the same three-state verdict, receipt and ledger locally, keyed by (checkout, head, hash), as a file the fast loop writes.
- The catalog is a flat prop list: names plus alphabetical enums, no types (children, onChange, style, className appear by name only), no scale ordering (size=lg|md|sm), no tokens inside the component entry, no interaction states (hover, pressed, disabled, checked, invalid), no theme or density modes, and no composition constraints beyond a members list. Rules can therefore check membership but not relationships; className and style are listed as legitimate props so the escape hatch stays open and is policed downstream by regex-class rules. A better design closes the escape hatch at the type (as NativeProps does), makes state and mode part of the vocabulary, and preserves scale order so monotonic rules are expressible.
- 'indeterminate' is the honest verdict and its existence is the strongest idea in the product, but its causes are opaque product-side strings ('plan too large', 'FCID moved', 'analysis failed') and the FCID covers the manifest only — the rule engine's version is not in the hash, so a rule change under the same FCID silently changes what a pass means. A better design hashes contract plus engine version, and carries the reason and the inspected population in the receipt so indeterminate is diagnosable rather than a black box.
- Exemplar references are path:line and nothing re-verifies them; a line number rots on the next edit and the card cites it every session. A better design references by symbol or anchor and checks that the exemplar still exists and still passes the checker.
- Save-time findings are advisory context the agent may ignore; enforcement rests on the agent reading additionalContext. The one refusal is diff-scoped, so pre-existing drift never blocks and the ratchet has no mechanism that ever pays debt down except an opt-in adoption floor. A better design keeps the ratchet but reports the debt population in every receipt so its non-decrease is visible.
- Vocabulary discipline is prose and the sources already disagree: FUI2003 is tier Opt-in on the contract page and Internal on the errors page; the contract page lists 24 rules against 54 codes; Members lines are inconsistent about Root and include non-render exports (preload, useTheme); blocks carry no members or props and are ungoverned; ten codes in the visible ranges are absent without explanation. The glossary that retires synonyms is itself a hand-maintained table.
- No visual read-back. Every check is lexical or AST-level; nothing looks at what the browser rendered, compiles through the application's real pipeline, or measures contrast from computed style. A page can pass every rule and ship unstyled or unreadable — the exact incident v4 recorded on 2026-09-03 — and Fragments has no instrument that would have seen it.
- 'pass = every Fragment on this head is the canonical one' overclaims. With four contract-tier rules armed by default, raw colours, spacing, typography, a11y, composition and prop values are opt-in and silent; a pass proves only that the armed rules found nothing at inspected sites. The receipt's rulesActive and checkedSites are the honest numbers and should lead the verdict text rather than sit beneath it.
- Curation cost and timing are vendor-stated, not measured by anyone else: 'ten minutes for seventy Fragments', 64 ms card, 38 ms warm check, 'network calls 0', all measured on the vendor's own repository on 2026-09-02. The blog thesis cites six papers about Python API hallucination and context length and bridges by inference to React design drift; no before/after outcome for Fragments itself is published, and the promised Markdown-vs-JSON tests have no numbers. The whole error catalog is flagged 'currently experimental'.
- The MCP pull channel has churned: catalog, lint, findings, fix, scan, autofix and suggestions were removed from the hosted surface. A pull channel an agent is expected to depend on needs a stable, versioned tool contract as much as the manifest needs a hash.
- Composition rules depend on an undefined 'region'; 'one primary per view' and 'three or more in a row: use Menu' are card text until a check id exists, and the thing a check id would need — what bounds a region — is not stated anywhere in the captured sources.
- The card assumes context injection changes behaviour and that sixty lines suffice because the agent will pull depth; both are assumptions with no eval. A better design runs a fixed task set with and without the card and records the numbers in the tree.
- Privacy is a schema property (carriage classes, never whole lines), which is right, but receipts are public URLs by default and carry the offending source literal; and the GitHub App re-reads repository files to verify a finding's location. Public-by-default and vendor-read-of-source are choices a design should make explicit rather than inherit.
- Seed theming and Base UI are library choices packaged as governance: four seeds assume a generated palette is the brand and that a derivation engine can express every decision a team needs; nothing compares the result against a hand-authored token set. The governance layer should be indifferent to which library and which theming it governs.
- The hook protocol dependency (Claude Code hookSpecificOutput, Cursor additional_context / followup_message, Codex trust via /hooks) and a resident daemon on the developer machine are load-bearing and outside the product's control; a broken hook is indistinguishable from a clean session, which is why doctor exists, but doctor is run by hand and nothing records its last green in the receipt.
