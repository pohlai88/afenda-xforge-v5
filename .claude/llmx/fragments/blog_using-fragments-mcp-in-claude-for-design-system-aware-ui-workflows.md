# Using Fragments MCP in Claude for Design System-Aware UI Workflows

March 5, 2026 · Tutorial · 1 min read · By Conan McNicholl

On this page

A Claude MCP design system workflow is most effective when Claude can query your component metadata instead of guessing from generic React examples. Fragments exposes your reviewed primitives, usage rules, tokens, and conformance loop through MCP so Claude can build UI that matches your system.
## Configure Claude for Fragments MCP
Add the hosted Fragments MCP endpoint to your project-level MCP config:
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
Then make sure Fragments Cloud has a ready catalog and a canonical design-system binding selected.
## Recommended Claude Workflow
Use Claude in three passes for better results:
1. Discovery pass: ask Claude to call `design_system/list_primitives`.
2. Styling pass: ask Claude to call `design_system/list_tokens` before writing CSS values.
3. Implementation pass: ask Claude to generate code, then run `design_system/conform` or `design_system/prove_compliant`.
This pattern keeps Claude aligned with the [components docs](/components) and reduces rework during review.
## Example Prompt
```text
Use the Fragments MCP tools to build a dialog-based confirmation flow.
Query design_system/list_primitives and design_system/list_tokens first,
then implement the flow and run design_system/prove_compliant before stopping.
```
## FAQ
### Can Claude use MCP tools and repository context together?
Yes. That is the ideal setup: repository context for local code and MCP for structured design system metadata.
### What should I do if Claude cannot access the catalog?
Check that `FRAGMENTS_API_KEY` is set for the MCP client and that Cloud shows a ready canonical design-system binding.
## CTA
Configure the [MCP Tools docs](/governance/mcp) first, then verify your Cloud catalog and review generated UI against the [components docs](/components).

## Next steps
- Accessible React Component Library: What to Look For (and How Fragments Works)How to evaluate an accessible React component library and how Fragments combines accessibility guidance, component docs, and AI-ready metadata.
- Using Fragments MCP in Cursor for Design System-Aware UI GenerationConfigure Fragments MCP in Cursor so AI can generate UI using your real component docs, props, and design tokens instead of generic markup.
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