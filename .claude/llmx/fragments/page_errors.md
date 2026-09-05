# Error codes

Every stable FUI diagnostic shared by the CLI, CI, MCP, and Cloud, grouped by the rule domain that emits it.
On this page

Tier A rules enforce the contract you picked; Tier B rules are hygiene you opt into. Each code links to an explain page with remediation, and the whole set is currently experimental.

## Catalog

54 codes

- Accessibility 2
- Components 10
- Composition 2
- Imports 1
- Props 3
- Styles 4
- Tailwind 6
- Theme 1
- Tokens 5
- Brand 1
- Config 6
- Contract 2
- Fragment files 2
- Safety 6
- Suppressions 3

### Accessibility
Accessibility diagnostic codesCode
Rule
Enforcement
Fix

FUI3001Accessible name is required
a11y/required-accessible-nameseriousBManual
FUI3002Accessibility standard failed
a11y/standardseriousBManual

### Components
Components diagnostic codesCode
Rule
Enforcement
Fix

FUI1001Component should use the canonical primitive
components/non-canonicalseriousBAutofix
FUI1002Preferred component should be used
components/preferred-componentseriousBAutofix
FUI1004Library component should be preferred
components/prefer-librarymoderateAAutofix
FUI1005Component is not in the allowed set
components/allowseriousBManual
FUI1006Component is denied by policy
components/denyseriousBManual
FUI1007Component shadows a canonical primitive
components/shadow-componentmoderateAManual
FUI5001Required child component is missing
components/required-childrenseriousBManual
FUI5002Component should use canonical composition
components/canonical-usageseriousBAutofix
FUI6004Prop value is forbidden
components/forbidden-prop-valueseriousBAutofix
FUI6005Component prop is unknown
components/unknown-propmoderateBManual

### Composition
Composition diagnostic codesCode
Rule
Enforcement
Fix

FUI5003Too many of a component in one region
composition/cardinalitymoderateBManual
FUI5004Required companion component is missing from the region
composition/co-occurrencemoderateBManual

### Imports
Imports diagnostic codesCode
Rule
Enforcement
Fix

FUI1003Import should use the preferred path
imports/preferred-pathmoderateBAutofix

### Props
Props diagnostic codesCode
Rule
Enforcement
Fix

FUI6001Prop is unknown
props/unknownmoderateBManual
FUI6002Prop value is invalid
props/invalid-valueseriousBAutofix
FUI6003Prop pattern is banned
props/banned-patternseriousBManual

### Styles
Styles diagnostic codesCode
Rule
Enforcement
Fix

FUI2004Raw dimension should use a token
styles/no-raw-dimensionsseriousBAutofix
FUI2005Raw color should use a token
styles/no-raw-colorseriousBAutofix
FUI2006Raw spacing should use the scale
styles/no-raw-spacingseriousBAutofix
FUI2016Raw typography should use a token
styles/no-raw-typographyseriousBAutofix

### Tailwind
Tailwind diagnostic codesCode
Rule
Enforcement
Fix

FUI2007Tailwind arbitrary color should use a token
tailwind/arbitrary-colormoderateBManual
FUI2008Tailwind arbitrary spacing should use the scale
tailwind/arbitrary-spacingmoderateBAutofix
FUI2009Tailwind palette is forbidden
tailwind/forbidden-palettemoderateBAutofix
FUI2010Tailwind color should use a resolved token
tailwind/raw-color-via-tokenmoderateBManual
FUI2011Tailwind spacing token is off scale
tailwind/off-scale-spacing-tokenmoderateBAutofix
FUI2012Tailwind class is unknown
tailwind/unknown-classmoderateBManual

### Theme
Theme diagnostic codesCode
Rule
Enforcement
Fix

FUI2014Theme-coupled literal should use a semantic token
theme/no-theme-coupled-literalmoderateBManual

### Tokens
Tokens diagnostic codesCode
Rule
Enforcement
Fix

FUI2001Design token is required
tokens/require-design-tokensseriousBAutofix
FUI2002Token prefix is not allowed
tokens/allowed-prefixesmoderateBAutofix
FUI2003Token fallback is required
tokens/require-dual-fallbackseriousInternalAutofix
FUI2015CSS variable is not in the contract vocabulary
tokens/css-vars-must-be-definedmoderateAManual
FUI2017Local token differs from its declared upstream source
tokens/upstream-driftmoderateAManual

### Brand
Brand diagnostic codesCode
Rule
Enforcement
Fix

FUI2013Brand seed token is required
brand/enforce-seedsseriousBAutofix

### Config
Config diagnostic codesCode
Rule
Enforcement
Fix

FUI2018Token sources resolved to 0 tokens
config/empty-token-vocabularyseriousBManual
FUI9004Config key is not consumed
config/unconsumed-keymoderateBManual
FUI9005Governance scale is not referenced
config/orphan-scalemoderateBManual
FUI9006Rule exclude matched no scanned file
config/unmatched-excludemoderateBManual
FUI9007Governance record was dropped as a duplicate
config/colliding-recordmoderateBManual
FUI9008Rule override outranks a record's authored severity
config/overridden-record-severitymoderateBManual

### Contract
Contract diagnostic codesCode
Rule
Enforcement
Fix

FUI9009Contract token source cannot be read
contract/unreadable-token-sourcecriticalBManual
FUI9012Contract write requires a paid workspace
contract/write-not-entitledcriticalBManual

### Fragment files
Fragment files diagnostic codesCode
Rule
Enforcement
Fix

FUI9010Fragment definition is not valid
fragment/invalid-definitioncriticalBManual
FUI9011Fragment definition drifted from its component source
fragment/source-driftcriticalBManual

### Safety
Safety diagnostic codesCode
Rule
Enforcement
Fix

FUI8001Event handler prop is blocked
safety/block-event-handlersseriousBAutofix
FUI8002Dangerous prop is blocked
safety/block-dangerous-propscriticalBAutofix
FUI8003Controlled prop is blocked
safety/block-controlled-propsseriousBAutofix
FUI8004Function prop is blocked
safety/block-function-propsseriousBAutofix
FUI8005Internal prop is blocked
safety/block-internal-propscriticalBAutofix
FUI8006Href must be sanitized
safety/sanitize-hrefscriticalBAutofix

### Suppressions
Suppressions diagnostic codesCode
Rule
Enforcement
Fix

FUI9001Suppression is unused
unused-suppressionminorBAutofix
FUI9002Suppression is expired
expired-suppressionseriousBAutofix
FUI9003Suppression expiry is missing
missing-expiryminorBAutofix

## Next steps
- RulesThe rules that emit FUI codes.
- ExceptionsIn-source allows and Cloud exceptions.

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