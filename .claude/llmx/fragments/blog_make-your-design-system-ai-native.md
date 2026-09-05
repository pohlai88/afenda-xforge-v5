# Make Your Design System AI-Native

February 16, 2026 · Tutorial · 5 min read · By Conan McNicholl

On this page

We've all been there. You fire up an AI agent, give it a vague prompt like "build me a dashboard, make it look nice", and a minute later you're staring at something that technically works but looks like three different apps stitched together.
The buttons don't match. The spacing is off. The dreaded purple and blue gradient is everywhere. You asked for a dashboard and got a Frankenstein UI.
## AI Slop is real
The first greenfield features and screens AI helps you build are fine. They might even look good. However, once a codebase gets larger it becomes increasingly difficult for AI to know exactly how to write things consistently.
Those stat cards that AI created for you on the dashboard are different from the stat cards on the reports page. That cool button that AI wrote for you has been hardcoded 23 different times across multiple pages. The more this happens across components and pages, the more design drift occurs. It's a maintenance nightmare and a design system killer. This lack of design consistency cheapens a brand and your users' perception.
Skills and agents can help mitigate this to an extent, or some resolve to just context dumping rules into each prompt. Skills and agents definitely have their place, but they are simply tools that attempt to guide AI agents in the right direction. They are not enforcement agents.
## Introducing Fragments: Metadata That Lives With the Code
Better prompts won't fix this.
If AI is writing your UI, it needs real, queryable context about your components. That context also has to live with the code itself, otherwise it goes stale and becomes yet another doc nobody updates.
In Fragments, every component ships with a co-located `.contract.json` contract file. Here is an excerpt:
```jsonc
// Button.contract.json
{
  "name": "Button",
  "description": "Interactive element for user actions and form submissions",
  "category": "forms",
  "status": "stable",
  "tags": ["action", "button", "form", "interactive"],
  "usage": {
    "when": [
      "Triggering an action (save, submit, delete)",
      "Form submission",
      "Opening dialogs or menus"
    ],
    "whenNot": ["Simple navigation (use Link)", "Toggling state (use Switch or Checkbox)"],
    "guidelines": [
      "Only one primary button per section",
      "Use danger variant for destructive actions"
    ],
    "accessibility": ["Button text should describe the action", "Icon-only buttons need aria-label"]
  }
}
```
The top-level metadata tells AI what the component is and if it's actually ready to use. The `usage` block tells it when to use it and when not to. You can also define props (with types/defaults), variants, relationships to other components, and composition patterns.
Every component in the library has one of these contract files, right next to the component source. Change the component, update the contract. No random Notion page required.
## MCP Tools: A Query Layer for AI Agents
Contract files and Cloud catalog data are the source of truth. [MCP](https://modelcontextprotocol.io) is how AI actually reads them. Fragments exposes 4 hosted MCP tools:
| Tool                            | What it does                                                                      |
| ------------------------------- | --------------------------------------------------------------------------------- |
| `design_system/list_primitives` | Lists reviewed primitives with source paths, usage guidance, props, and examples. |
| `design_system/list_tokens`     | Gives AI the real token vocabulary for the active Cloud contract.                 |
| `design_system/conform`         | Suggests deterministic component and token rewrites for supplied code.            |
| `design_system/prove_compliant` | Runs a validate/fix/revalidate loop before the agent hands code back for review.  |
Without MCP, AI guesses from training data. With MCP, it queries your design system on each decision. Huge difference.
## Seed-Based Theming: 4 Values, Not 500
Most token systems make you manage hundreds of values, which means hundreds of ways for AI to get it wrong.
Fragments does the opposite. You set 4 seed values and a derivation engine generates everything else:
```scss
// styles/globals.scss
@use "@usefragments/ui/styles" with (
  $fui-brand: #6366f1,
  // Your brand color
  $fui-neutral: "ice",
  // Neutral palette: stone | ice | earth | sand | fire
  $fui-density: "default",
  // Spacing: compact | default | relaxed
  $fui-radius-style: "rounded" // Corners: sharp | subtle | default | rounded | pill
);
```
From those 4 seeds, Fragments generates nearly 200 CSS custom properties: full color palettes (with hover/active/focus states), surface layers, text hierarchy, borders, spacing scales, typography, shadows, border radii, focus rings, and WCAG-compliant contrast-safe variants for both light and dark modes.
So instead of AI picking between 12 class names that kinda look right, it uses the exact token from your system.
When design says "make corners rounder", you change one value (`$fui-radius-style: "rounded"` → `"pill"`) and the whole system updates. Want a warm neutral palette? Change `"ice"` to `"sand"`. Done. You can try this in the [theme builder](/create) to see how just 4 values transform an entire system.
## Getting Started
Install the component library, then initialize Fragments:
```bash
npm install @usefragments/ui
npx @usefragments/cli init
```
You get 60+ production-ready components, seed-based theming, and contract metadata for every component.
Run `npx @usefragments/cli view` to generate a static viewer for props, usage guidance, a11y results, and relationships.
Connect your AI assistant via hosted MCP:
```json
// .mcp.json
{
  "mcpServers": {
    "fragments": {
      "type": "http",
      "url": "https://app.usefragments.com/api/mcp",
      "headers": {
        "Authorization": "Bearer ${FRAGMENTS_API_KEY}"
      }
    }
  }
}
```
Drop that in any MCP client that supports remote HTTP servers, including Claude Code and Cursor.
Then ask for something like "build a settings form" and watch it use your components instead of inventing new ones.
## What's Next
Design systems were always about consistency.
The old assumption was that humans were the only ones reading the docs. That's not true anymore.
Fragments makes your system understandable to both humans and AI.
Fragments Cloud is component-library-agnostic today. Point Fragments at your existing React library to get MCP tools, governance checks, and a local static viewer without a rewrite.
We have many other items on the roadmap, so stay tuned.
[![Bad Bunny Halftime Show GIF](https://media.giphy.com/media/T5eZR2cnVZWxxScSwU/giphy.gif)](https://giphy.com/gifs/bad-bunny-halftime-show-T5eZR2cnVZWxxScSwU)
Until next time.
---
Browse the [components](/components) and connect the MCP server if you want to see the difference yourself.

## Next steps
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