# Give the AI a Database, Not a Document

February 18, 2026 · Engineering · 4 min read · By Conan McNicholl

On this page

Your AI isn't using your components. Or it is, but wrong. Or correctly for three weeks — then it starts importing something it invented, hardcoding a value that exists as a token, or generating an inaccessible pattern you specifically told it to avoid.
You think: I need to tell the AI about my design system. There are a few ways to do this. They don't all work.
---
## The Context Dump
The first instinct: paste your README, component docs, maybe a Storybook URL, into the system prompt. Or into a `.cursorrules` file prepended to every conversation.
This works. For about a week.
Then your context window fills up. Something gets silently dropped. The AI continues making decisions from an incomplete picture and does not mention this.
Your docs also go stale. You rename a prop. The rules file doesn't know. Three months later, the AI is generating code against an API that no longer exists — with the same confidence it had on day one.
Context dumps give the AI a snapshot of your design system at a fixed point in time. Your design system is not at a fixed point in time.
---
## The Rules File
The refinement: write intentional rules instead of pasting everything. `.cursorrules`. `CLAUDE.md`. `copilot-instructions.md`. `.windsurfrules`. There are more of these formats than anyone asked for.
```
Always use components from @mycompany/ui. Never write raw HTML elements.
Use semantic spacing tokens instead of hardcoded values.
```
Better. Rules can capture the non-obvious decisions — the things that don't appear in props and don't make it into documentation.
The ceiling: rules are followed when the AI is uncertain. The AI is uncertain approximately 0% of the time.
They also drift. When you add a new component, you need to update every rules file. Nobody does. The rules fall behind quietly, and you don't notice until the AI generates something that was correct six months ago.
---
## Getting Clever
Some developers write workflow configs that instruct the AI to actively check the source:
```
When building UI:
1. Run ls src/components first
2. Read the component README before using it
3. Check the token list before any spacing value
```
Clever. Dynamic. The AI is checking the actual source rather than a six-week-old snapshot.
It still doesn't work.
Knowing `SettingsPanel` exists doesn't tell the AI when to use it, what it composes with, or whether the output is accessible. The lookup adds a step. It doesn't improve the decision.
These configs also live outside the component repository, so nobody updates them. They're editor-specific, so they stop working when your team switches tools — which happens more often than anyone plans.
---
## What Does Work
The problem isn't that the AI doesn't know your design system. It's that your design system doesn't have a machine-readable representation it can query.
READMEs and Storybook stories were written for humans. They leave implicit exactly what AI needs explicit: when NOT to use something, how components compose, which patterns are deprecated.
The fix: structured metadata colocated with each component. Not documentation — a schema-validated record in the same PR as the source.
```jsonc
// Button.contract.json (excerpt)
{
  "usage": {
    "when": ["Form submission", "Triggering an action"],
    "whenNot": ["Navigation between pages — use Link", "Toggling state — use Switch or Checkbox"],
    "accessibility": ["Icon-only buttons need aria-label", "One primary button per section"]
  },
  "relations": [
    {
      "component": "Form",
      "relationship": "composition",
      "note": "Button is commonly used in forms"
    },
    {
      "component": "Dialog",
      "relationship": "composition",
      "note": "Button is commonly used in dialogs"
    },
    {
      "component": "Link",
      "relationship": "alternative",
      "note": "Use Link for navigation"
    },
    {
      "component": "IconButton",
      "relationship": "alternative",
      "note": "Use IconButton for icon-only actions"
    }
  ]
}
```
The `whenNot` field is doing most of the work. That's the negative space — the constraints that determine whether output is _correct_, not just _valid_. They don't appear in props. They don't survive in a rules file. They have to live with the component.
Hosted MCP exposes this as queryable tools. When the AI builds a settings form, it calls `design_system/list_primitives`, checks the token vocabulary with `design_system/list_tokens`, and validates the result with `design_system/conform` or `design_system/prove_compliant`. It doesn't guess. It queries.
A rules file is guidance. This is infrastructure.
---
The developers getting consistent AI output aren't the ones with the longest `.cursorrules`. They're the ones who made their design system queryable.
That's the whole thing.
---
_Fragments implements this pattern — structured fragment metadata and Cloud governance data exposed through hosted MCP tools. [Browse the components](/components) or [connect hosted MCP](/governance/mcp)._

## Next steps
- MCP Tools for Design Systems: Practical Workflows for React TeamsPractical MCP tools for design systems workflows: how React teams use Fragments to query components and tokens, then check conformance through a hosted endpoint.
- 4 Hosted MCP Tools That Make AI Understand Your Design SystemA deep dive into the hosted Fragments MCP tools for primitive discovery, token lookup, deterministic fixes, and compliance proof loops.
- Connect a repositoryPin the contract and gate pull requests in Fragments Cloud.

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