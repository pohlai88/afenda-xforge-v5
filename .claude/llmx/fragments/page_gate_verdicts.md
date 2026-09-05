# Verdicts and receipts

Every push is evaluated at its exact head against the pinned FCID. The check summary carries introduced findings; the details link opens the receipt.
On this page

## Verdicts
Verdict statesVerdict
Check
Meaning

passsuccessevery Fragment on this head is the canonical one
blockfailureintroduced findings, listed in the check summary with the repair command
indeterminateaction_requiredthe truth is not known: the plan was too large, the FCID moved, or the analysis failed. It holds. It never becomes a pass by waiting.

## How a head is evaluated
evaluate()
`push at exact head
        │
        ▼
evaluate(head, pinned FCID)
        │
   ┌────┼──────────────┐
   ▼    ▼              ▼
 pass  block     indeterminate
   │    │              │
   ▼    ▼              ▼
success failure   action_required
                  (holds; never a pass)`

## Receipts
A receipt is the persisted evaluation behind a verdict: `evr_` and a hash of the result. It is public, read-only and carries no personal data, so a reviewer without an account can read exactly why a head was blocked.
receipt
`evr_…
verdict: block
FCID: 69793552072061f8ea29849fbb350c2d772a5082ed6fad02ce8deec385a0274d
introduced:
  FUI1004 Replace <button> with <Button> from @usefragments/ui`

## What a receipt carries
The report carries source text in named fields: offending literals, messages that may quote them, structured rule facts, authored exception and bypass reasons, and compiled package vocabulary. It never uploads whole files, whole source lines or function bodies.
Receipt fieldsField
Type
Purpose
Carriage

`schemaVersion``"fragments-governance-report:v1"`Pins the accepted wire shape and compatibility policy.`—`
`generatedAt``ISO-8601 string`Records when the CLI produced the report.`—`
`root.{workspaceRoot,packageRoot,packageName}``string fields`Identifies the scanned workspace and package roots.`—`
`hook.{installedAt,mode,agents[]}``installation metadata`Describes the local hook installation that produced evidence.`—`
`git.{baseRef,headSha,branch,repoFullName,pullRequestNumber}``Git and provider identifiers`Attaches results to the correct repository, commit and pull request.`—`
`summary.{filesScanned,rulesActive,presetsLoaded[],groupCount,occurrenceCount,ignoredCount,classnamesScanned,classnamesDynamic,classnamesResolved,totalFindings,errorCount,warnCount,infoCount,passed}``counts, verdict and active preset names`Reports scan volume and result totals without finding rows.`derived`
`summary.ignoredByReason.{reason}``configured reason name → count`Counts ignored findings by the reason configured by the repository.`derived`
`summary.countsBySeverity.{error,warn,info}``severity counts`Counts findings in each fixed severity bucket.`derived`
`summary.countsByCategory.{category}``configured category name → count`Counts findings by the rule categories present in the scan.`derived`
`summary.integrity.{status,declared,fatalForCi,blockingCapable,summary}``governance-integrity verdict`Explains whether the resolved policy is capable of enforcement.`derived`
`summary.integrity.families[].{id,armed,reason,remediation}``integrity-family status`Explains the enforcement readiness of each governance family.`derived`
`summary.integrity.families[].rules[]``rule identifiers`Names the active rules contributing to an integrity family.`derived`
`summary.integrity.armed[]``integrity-family identifiers`Names the governance families capable of enforcement.`derived`
`summary.integrity.remediations[]``remediation messages`Explains how to make an inert or degraded policy effective.`derived`
`summary.integrity.configDiagnostics[].{code,kind,severity,path,message}``configuration diagnostics`Reports inert or conflicting authored governance configuration.`structured-source`
`summary.integrity.roster.{configured,active,inert}``rule roster counts`Counts configured, active and inert governance rules.`derived`
`summary.countsByBaselineState.{baselined,new}``baseline-state counts`Separates accepted baseline debt from newly introduced findings.`derived`
`groups[].{groupId,ruleId,category,severity,packageRoot,filePath}``finding group metadata`Identifies each grouped rule failure and repository-relative path.`—`
`groups[].message``string`Explains the failure and may quote the offending source literal.`source-literal`
`groups[].normalizedOffense.kind``normalized-offense category`Names the kind of source offense represented by the group.`derived`
`groups[].normalizedOffense.raw``normalized source offense`Carries the exact offending source substring.`source-literal`
`groups[].normalizedOffense.canonical``normalized source offense`Carries the derived canonical representation of the offense.`derived`
`groups[].occurrences[].occurrenceId``stable occurrence identifier`Identifies one occurrence within a finding group.`derived`
`groups[].occurrences[].location.{file,line,column,endLine,endColumn}``repository-relative location`Places each occurrence at its exact file/line/column range.`—`
`groups[].occurrences[].area.{areaId,areaName,criticality,owners[],matchedGlob}``area identifiers, owners and criticality`Carries the configured product-area classification for the file.`structured-source`
`groups[].occurrences[].evidence[].factId``fact identifier`Links the occurrence to the extracted fact supporting it.`derived`
`groups[].occurrences[].evidence[].fact.kind``fact discriminator`Names the extracted rule-fact shape.`—`
`groups[].occurrences[].evidence[].fact.location.{file,line,column,endLine,endColumn}``repository-relative location`Locates the source-backed fact used as evidence.`—`
`groups[].occurrences[].evidence[].fact.{ruleSpecificField}``extensible rule-specific fact fields`Carries rule-specific parsed facts; fields may include selectors, properties and source values.`structured-source`
`groups[].suggestedReplacement.{kind,from,to,certainty,reason}``deterministic replacement`Carries the deterministic replacement the CLI can apply.`derived`
`groups[].suggestedReplacement.edit.{file,start,end,replacement}``deterministic edit range`Locates and describes the exact edit the CLI can apply.`derived`
`suppressions[].{id,kind,file,line,column,code,expiresOn,attachedLine,attachedTo,directive}``directive identity, location and attachment metadata`Reports matched in-source governance directives.`—`
`suppressions[].reason``authored directive reason`Carries the repository-authored reason for the suppression.`source-literal`
`bypassEvents[].{code,file,line}``rule code and source location`Records directives that actually bypassed a finding in this run.`—`
`bypassEvents[].reason``authored directive reason`Carries the repository-authored reason for the bypass.`source-literal`
`bypassEvents[].area.{areaId,areaName,criticality,matchedGlob}``configured product-area metadata`Classifies the bypass by its configured product area.`structured-source`
`hookEvents[].{eventId,kind,ruleId,code,file,mode,agent,timestamp,reasonClass}``bounded hook decision receipts`Reports deny, downgrade, suppression and fail-open decisions.`—`
`packageVocabularies[].{source,packageName,status,manifestPath,digest,commit}``compiled canonical-package vocabulary records`Publishes package vocabulary proposed by authoritative local discovery.`structured-source`
`packageVocabularies[].roots[].{name,members[]}``compiled component roots and members`Publishes the canonical component vocabulary discovered from the package.`structured-source`
`adoption.{metricVersion,adoptedUsages,ownableUsages}``versioned component-identity usage counts`Records the exact numerator and denominator used for adoption history.`derived`
`adoption.adopted[].{componentKey,displayName,canonicalTarget,usageCount}``bounded adopted component-identity summaries`Explains which canonical components account for current adopted call sites without uploading source.`derived`
`adoption.shadows[].{componentKey,displayName,canonicalTarget,usageCount}``bounded component-identity summaries`Explains which shadow components are moving the adoption curve without uploading source.`derived`
`health.{metricVersion,checkedSites,violatingSites}``versioned contract-site counts`Records how many sites contract-scope rules inspected and how many distinct sites carried a finding.`derived`
`health.populations.{componentUsages,tokenReferences}``per-population site counts`Names the measured populations behind the checked-site denominator.`derived`
`topology.areaImpact[].{areaId,areaName,beforeOpen,afterOpen,introduced,persistent,resolved}``area identifiers and before/after counts`Reports bounded product-area impact totals.`derived`
`contractHash``64-character FCID`Pins the exact compiled contract enforced by the run.`derived`
`source``"ci"`Identifies the report producer.`—`
`gateRung``"ci" | "cli"`Identifies the enforcement rung that produced the verdict.`—`
`diffOnly``boolean`States whether the scan was restricted to changed files.`—`
`failOnWarnings``boolean`States whether warnings were gating for this run.`—`

## What is never uploaded
Reports do not contain whole files, whole source lines, function bodies, secrets, environment variables, or dependency source. There is no source-excerpt upload option. Separately, Cloud may read a connected repository file through the GitHub App to verify a finding still exists at its claimed location; file contents are not persisted as report data.

## Exceptions
An admin can except a finding with a reason and an expiry. The check turns green, the exception is logged, and the merge ledger records the merge as excepted, not clean. The exception is scoped, reasoned, and expiring. When it lapses, the next evaluation of that head is a block again if the finding is still present. Members cannot grant one.

### Merge ledger
One row per repository and head that merged: the receipt, the verdict, the outcome. `clean`, `excepted`, `bypassed` (merged with no passing verdict and no exception), `unresolved` (merged on an indeterminate head). Bypasses are recorded, never hidden. The Adoption page is a projection over this ledger.

### In-source exceptions
Put the directive immediately before the statement it applies to. Name the exact FUI code and record a reason; use a real calendar expiry when the exception is temporary. These are narrow, auditable exceptions — not a substitute for changing the contract through `govern.canonicalBridges` or another documented config field.
Banner.tsx
`// fragments-allow FUI2005: vendor-owned color, tracked in DS-482 expires="2026-12-31"
const Banner = () => <div style={{ color: "#39594d" }} />;`

LegacyButton.tsx
`// @fragments-expect-error FUI1003 reason="legacy import migration tracked in DS-611" expires="2026-12-31"
import { Button } from "@mui/material";`

For import-path findings, see FUI1003.

## Next steps
- ConnectPin the FCID the verdict cites.
- ContractChange the pin instead of excepting, when you can.
- FUI codesThe codes listed on a blocked receipt.

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