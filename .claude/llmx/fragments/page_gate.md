# The gate: Fragments Cloud

The loop keeps an agent on the contract while it writes. The gate makes the contract required to merge. Same manifest, same rules, same verdict; the gate adds a receipt and a ledger.
On this page

## Connect
Install the GitHub App on the repository, pick the manifest's FCID to pin, and Cloud installs `fragments/contract-compliance` as a check. Make it required on the protected branch. That is the gate.

## Verdicts
Every push is evaluated at its exact head against the pinned FCID.
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

Verdict statesVerdict
Check
Meaning

passsuccessevery Fragment on this head is the canonical one
blockfailureintroduced findings, listed in the check summary with the repair command
indeterminateaction_requiredthe truth is not known: the plan was too large, the FCID moved, or the analysis failed. It holds. It never becomes a pass by waiting.

The check summary carries the introduced findings so a simple fix never leaves GitHub. The details link opens the receipt.

## Receipts
A receipt is the persisted evaluation behind a verdict: `evr_` and a hash of the result. It is public, read-only and carries no personal data, so a reviewer without an account can read exactly why a head was blocked.
receipt
`evr_…
verdict: block
FCID: 69793552072061f8ea29849fbb350c2d772a5082ed6fad02ce8deec385a0274d
introduced:
  FUI1004 Replace <button> with <Button> from @usefragments/ui`

## Exceptions
An admin can except a finding with a reason and an expiry. The check turns green, the exception is logged, and the merge ledger records the merge as excepted, not clean.

## Merge ledger
One row per repository and head that merged: the receipt, the verdict, the outcome. `clean`, `excepted`, `bypassed` (merged with no passing verdict and no exception), `unresolved` (merged on an indeterminate head). Bypasses are recorded, never hidden. The Adoption page is a projection over this ledger.

## Pricing
Pro by repository count, unlimited people, agents and checks, 14-day trial. Enterprise on request. See Pricing.

## Next steps
- The loopThe same manifest, locally, on every save.
- VocabularyVerdict, receipt, exception, bypass.

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