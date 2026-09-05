# 4 Hosted MCP Tools That Make AI Understand Your Design System

February 17, 2026 · Tutorial · 1 min read · By Conan McNicholl

On this page

Fragments MCP is hosted by Fragments Cloud. AI clients connect directly to the remote endpoint; there is no npm package or local stdio process to install:
```text
https://app.usefragments.com/api/mcp
```
Interactive RC clients authenticate through MCP OAuth discovery. Headless
clients authenticate with a Fragments Cloud API key:
```text
Authorization: Bearer <FRAGMENTS_API_KEY>
```
The endpoint exposes 4 tools:
| Tool                            | Purpose                                                       |
| ------------------------------- | ------------------------------------------------------------- |
| `design_system/list_primitives` | List reviewed Cloud primitives with source paths and guidance |
| `design_system/list_tokens`     | List design tokens from the active Cloud contract             |
| `design_system/conform`         | Return deterministic design-system rewrites for supplied code |
| `design_system/prove_compliant` | Run a validate/fix/revalidate proof loop for supplied code    |
## The Agent Loop
Use a short loop for UI work:
1. Query `design_system/list_primitives` before choosing primitives.
2. Ask `design_system/list_tokens` before writing CSS values.
3. Run `design_system/conform` on generated code to get deterministic rewrites.
4. Use `design_system/prove_compliant` before review when the client supports the full proof loop.
The server never reads or writes your filesystem. The agent owns disk I/O and applies patches locally.
## What Is Not Exposed
Fragments MCP does not expose the old catalog, lint, findings, fix, scan, autofix, or suggestions tools. Governance scanning and PR automation happen through the CLI, GitHub App, and Cloud APIs; MCP stays focused on design-system context and code conformance.
## Setup
Use this config shape for clients that support remote HTTP MCP servers:
```json
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
See the [MCP Tools docs](/governance/mcp) for the current setup details.

## Next steps
- Give the AI a Database, Not a DocumentContext dumps go stale. Rules files get ignored when the AI is confident. Workflow configs live outside your repo and nobody updates them. Here's the pattern that actually enforces consistency.
- Make Your Design System AI-NativeAI can build apps, but the output is often inconsistent. Here's how Fragments makes your design system AI-native with MCP tools, structured fragments, and seed-based theming.
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