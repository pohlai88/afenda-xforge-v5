# Contract

The pinned identity of a manifest version is the FCID: contractHash(manifest). Every verdict cites one.
On this page

## FCID
`node node_modules/@usefragments/cli/dist/loop.js card | sed -n 2p   # FCID: `…``

The FCID appears on the card, in every receipt, and on the Contract page in Fragments Cloud. Change the manifest, get a new FCID, and pin it again before a pull request can pass. A head evaluated against a different FCID than the pin is indeterminate.
Shape of the file: fragments.manifest.json.

## Rules the pin arms
Each rule emits a versioned FUI code. Explain pages live at /errors.

### Components
Components rulesRule
FUI code
Tier
Title

`components/unknown-prop``FUI6005`Opt-inComponent prop is unknown
`components/forbidden-prop-value``FUI6004`Opt-inProp value is forbidden
`components/preferred-component``FUI1002`Opt-inPreferred component should be used
`components/prefer-library``FUI1004`ContractLibrary component should be preferred
`components/shadow-component``FUI1007`ContractComponent shadows a canonical primitive

### Props
Props rulesRule
FUI code
Tier
Title

`props/invalid-value``FUI6002`Opt-inProp value is invalid

### Imports
Imports rulesRule
FUI code
Tier
Title

`imports/preferred-path``FUI1003`Opt-inImport should use the preferred path

### Styles
Styles rulesRule
FUI code
Tier
Title

`styles/no-raw-color``FUI2005`Opt-inRaw color should use a token
`styles/no-raw-dimensions``FUI2004`Opt-inRaw dimension should use a token
`styles/no-raw-spacing``FUI2006`Opt-inRaw spacing should use the scale
`styles/no-raw-typography``FUI2016`Opt-inRaw typography should use a token

### Tailwind
Tailwind rulesRule
FUI code
Tier
Title

`tailwind/arbitrary-color``FUI2007`Opt-inTailwind arbitrary color should use a token
`tailwind/arbitrary-spacing``FUI2008`Opt-inTailwind arbitrary spacing should use the scale
`tailwind/forbidden-palette``FUI2009`Opt-inTailwind palette is forbidden
`tailwind/off-scale-spacing-token``FUI2011`Opt-inTailwind spacing token is off scale
`tailwind/raw-color-via-token``FUI2010`Opt-inTailwind color should use a resolved token
`tailwind/unknown-class``FUI2012`Opt-inTailwind class is unknown

### Tokens
Tokens rulesRule
FUI code
Tier
Title

`tokens/require-dual-fallback``FUI2003`Opt-inToken fallback is required
`tokens/css-vars-must-be-defined``FUI2015`ContractCSS variable is not in the contract vocabulary
`tokens/upstream-drift``FUI2017`ContractLocal token differs from its declared upstream source

### Theme
Theme rulesRule
FUI code
Tier
Title

`theme/no-theme-coupled-literal``FUI2014`Opt-inTheme-coupled literal should use a semantic token

### Accessibility
Accessibility rulesRule
FUI code
Tier
Title

`a11y/required-accessible-name``FUI3001`Opt-inAccessible name is required
`a11y/standard``FUI3002`Opt-inAccessibility standard failed

### Composition
Composition rulesRule
FUI code
Tier
Title

`composition/cardinality``FUI5003`Opt-inToo many of a component in one region
`composition/co-occurrence``FUI5004`Opt-inRequired companion component is missing from the region

## Config schema
Optional `fragments.config.ts` scopes token sources, topology, and rule records. The manifest is still the contract the loop and the gate evaluate.

### Governance policy
Governance policy configuration fieldsField
Type
Required
Description

`govern.agent``object`NoAgent repair-order guidance consumed when presenting deterministic fixes.
`govern.agents``Record<string, object>`NoAgent-id keyed rule overrides for supported agent-specific governance policies.
`govern.audit``object`NoReserved audit compatibility object; undeclared child keys are reported as inert.
`govern.canonicalBridges``object[]`NoConfirmed mappings from an underlying library export to the approved local wrapper. The wrapper's implementationFiles scope permits its direct underlying import.
`govern.canonicalSources``object[]`NoCanonical component authorities: npm packages, repository directories, or registry receipts whose included exports arm canonical-component rules.
`govern.ci``object`NoGovernance CI rendering options. Under `--ci`, `failOnWarnings` defaults to `true` when absent; set it to `false` to keep warning findings reported but advisory. `failOnInert` is opt-in and makes inert-config diagnostics (FUI9004-FUI9008) fail the verdict; `--allow-inert` bypasses the inert gates. `failOnAdoptionRegression` is opt-in and makes `check --ci` compare the current component-identity adoption percentage with the committed `.fragments/adoption-baseline.json` floor.
`govern.components``Record<string, object>`NoComponent-keyed governance records for canonical component metadata and prop policy.
`govern.extends``string[]`NoShared governance config modules to extend before applying this file's declarations.
`govern.jsx``object[]`NoLegacy typed JSX-policy records, normalized into the active rule policy.
`govern.overrides``object[]`NoOrdered component-policy overrides selected by component identity fields.
`govern.presets``string[]`NoVersioned governance presets to resolve before applying local rule overrides.
`govern.rules``Record<string, unknown>`NoRule-id keyed enablement and severity overrides. Only fields consumed by the named rule are valid; unsupported fields are reported as inert config.
`govern.runners``Record<string, object>`NoReserved runner compatibility map; undeclared child keys are reported as inert.
`govern.scales``Record<string, object>`NoNamed numeric scales. Spacing rules bind through style.rawSpacing.mustMatchScale; the built-in spacing policy references `space`.
`govern.severity``"error" | "warn" | "info"`NoDefault severity for governance rules that do not declare their own severity.
`govern.styles``object[]`NoLegacy typed style-policy records, normalized into the active rule policy.
`govern.tailwind``object`NoTailwind palette allow/deny policy used by Tailwind governance rules.

### Token sources
Token sources configuration fieldsField
Type
Required
Description

`tokens.aliases``Record<string, string>`NoExplicit local-name -> upstream-name mappings for cross-authority drift checks.
`tokens.enabled``boolean`NoEnable token comparison in style diffs (default: true)
`tokens.exclude``string[]`NoGlob patterns to exclude
`tokens.format``"auto" | "css" | "scss" | "dtcg" | "tailwind"`NoToken source format detection. "auto" infers supported formats from the file extension, including statically analyzable TypeScript/JavaScript modules.
`tokens.include``string[]`NoGlob patterns for files to scan for tokens e.g., ["src/styles/theme.scss", "src/styles/variables.css"]
`tokens.namespace``string`NoVendor namespace for Fragments extensions in DTCG files (default: 'com.usefragments')
`tokens.packages``string[]`Nonpm package names whose shipped `fragments.json` token vocabulary seeds the known-token set (e.g. `["@usefragments/ui"]`). DECLARED-manifest ingest — the parser reads each package's published `fragments.json` and merges its token names into the vocabulary `tokens/css-vars-must-be-defined` consumes, so a consumer using those `--fui-*` vars is not flagged as drift. Never globs node_modules SCSS — only the declared manifest is trusted, keeping the no-inference mandate intact.
`tokens.sources``object[]`NoRepo-root-relative token source files/globs for monorepos and Cloud setup. Set each source to format "auto" for TypeScript or JavaScript token modules.
`tokens.themeSelectors``Record<string, string>`NoMap CSS selectors to theme names
`tokens.upstream``object[]`NoDeterministic pins for upstream token manifests; local scans never fetch them.

### Local identity decisions
Local identity decisions configuration fieldsField
Type
Required
Description

`identity.decisions``object[]`NoAuthored sanctions, rejections, and dismissals keyed by portable component identity.

## Token modules
Point `tokens.sources` at a TypeScript or JavaScript module when tokens are not in CSS.
fragments.config.ts
`import type { FragmentsConfig } from "@usefragments/core";

export default {
  tokens: {
    sources: [{ path: "src/theme/tokens.ts", format: "auto" }],
  },
} satisfies FragmentsConfig;`

## Worked config
fragments.config.ts
`import type { FragmentsConfig } from "@usefragments/core";

export default {
  "app": {
    "path": ".",
    "include": [
      "src/**/*.{ts,tsx,css,scss}"
    ]
  },
  "components": [
    "src/components/**/*.tsx"
  ],
  "tokens": {
    "sources": [
      {
        "path": "src/theme.ts",
        "format": "auto"
      }`

Show 53 more lines

## Next steps
- ConnectPin this FCID on a binding.
- Verdicts and receiptsWhat evaluate() returns for an exact head.
- FUI codesExplain pages for every finding.

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