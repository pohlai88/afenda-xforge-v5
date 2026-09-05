# The Science Behind AI Component Generation

February 28, 2026 · Engineering · 7 min read · By Conan McNicholl

On this page

AI writes your UI code wrong in predictable ways. Not random ways — predictable, well-documented, scientifically-studied ways. Six recent papers explain exactly why, and what to do about it.
This is not a product post. This is a reading list with practical implications. If you build design systems, component libraries, or AI-assisted developer tools, these findings should change how you think about documentation.
## 1. AI Hallucinates APIs It Hasn't Seen Enough
Jain et al. (2024) studied how code LLMs handle API invocations across frequency bands. The finding is stark: GPT-4o achieved only **38.58% valid invocations** for low-frequency APIs. Your custom design system components are, by definition, low-frequency. The model has seen `<button>` a million times. It has seen your `<Card.Header padding="compact">` approximately never.
The obvious fix — dump your API docs into the prompt — helps, but with a catch. Their Documentation Augmented Generation approach improved low-frequency accuracy to 47.94%. But when paired with a bad retriever, it caused a **39.02% absolute performance drop** on high-frequency APIs the model already knew. Naive RAG made the model worse at things it was already good at.
The takeaway: you need selective augmentation that triggers only when the model needs help, not a context dump that drowns what it already knows.
> Jain, N. et al. "On Mitigating Code LLM Hallucinations with API Documentation." [arXiv:2407.09726](https://arxiv.org/abs/2407.09726), 2024.
## 2. Examples Beat Parameter Lists (By a Lot)
Chen et al. (2025) tested retrieval-augmented code generation across 1,017 APIs in four Python libraries. The headline number: RAG with API documentation improved performance by **83%–220%** depending on the library.
But the interesting finding is what type of documentation helped most. Code examples significantly outperformed descriptive text and parameter lists. Not marginally — significantly. A well-chosen example that shows the component in context does more than an exhaustive prop table.
This aligns with what every developer already knows intuitively. When you're learning a new library, you don't read the type signatures first. You find an example that looks like what you're building and work backwards. LLMs do the same thing, except they can't ask a colleague when the example doesn't quite fit.
> Chen, J. et al. "When LLMs Meet API Documentation: Can Retrieval Augmentation Aid Code Generation Just as It Helps Developers?" [arXiv:2503.15231](https://arxiv.org/abs/2503.15231), 2025.
## 3. Prompt Format Matters More Than You Think
He et al. (2024) tested the same content in different prompt formats — plain text, Markdown, JSON, YAML — and measured the impact on LLM output quality. GPT-3.5-turbo showed performance variations of **up to 40%** on code translation tasks based solely on formatting choice.
Forty percent. Same information. Different wrapping.
Larger models like GPT-4 were more robust to formatting variations, but the gap never disappeared entirely. The implication: if you're injecting component metadata into an AI prompt, the structure of that metadata is a first-class engineering decision, not an afterthought.
> He, J. et al. "Does Prompt Formatting Have Any Impact on LLM Performance?" [arXiv:2411.10541](https://arxiv.org/abs/2411.10541), 2024.
## 4. Position Bias: The Middle Gets Lost
Hsieh et al. (2024) documented a U-shaped attention pattern across LLMs: models disproportionately attend to tokens at the beginning and end of input, losing information positioned in the middle. Their calibration mechanism improved RAG task performance by **up to 15 percentage points** by correcting for this bias.
For component documentation, this means the order you present information matters. Critical details buried in the middle of a 50-component context dump will be ignored — not because the model can't process them, but because positional attention bias works against mid-sequence content.
The practical fix: put the most relevant component information first. If you're generating a Card, Card's documentation should be at the top of the injected context, not alphabetically sandwiched between Checkbox and Chart.
> Hsieh, C-Y. et al. "Found in the Middle: Calibrating Positional Attention Bias Improves Long Context Utilization." ACL Findings, [arXiv:2406.16008](https://arxiv.org/abs/2406.16008), 2024.
## 5. More Context Is Not Better Context
Two papers converge on the same conclusion from different angles.
**Context rot.** Chroma Research (2025) tested 18 LLMs across 194,480 calls and found that performance consistently degrades as input context length grows — even on straightforward tasks. They call this "context rot." Longer inputs don't just dilute attention; they actively degrade accuracy. Lower semantic similarity between questions and answers accelerates the decline.
**Few-shot saturation.** Xu et al. (2024) found that code generation performance from few-shot examples saturates around **6 examples**. Beyond that, adding more examples yields diminishing returns while doubling inference time. Prompts with 10 examples were approximately 2x slower than zero-shot, with negligible quality improvement.
The combined finding: there is an optimal amount of context. Below it, the model guesses. Above it, the model drowns. The sweet spot is narrow, and most AI-assisted dev tools are nowhere near it — they either inject nothing (model guesses from training data) or inject everything (model loses focus).
> Hong, K. et al. "Context Rot: How Increasing Input Tokens Impacts LLM Performance." [Chroma Research](https://research.trychroma.com/context-rot), 2025.
>
> Xu, D. et al. "Does Few-Shot Learning Help LLM Performance in Code Synthesis?" [arXiv:2412.02906](https://arxiv.org/abs/2412.02906), 2024.
## What This Means for Design Systems
These papers describe six constraints that any AI-aware design system must operate within:
1. **The model will hallucinate your custom APIs.** Your components are low-frequency by definition. Without structured metadata, the model will invent plausible-sounding props that don't exist.
2. **Examples are the highest-value documentation.** A composition block showing `<Card><Card.Header>...</Card.Header><Card.Body>...</Card.Body></Card>` does more than a prop table listing `padding`, `variant`, `elevation`.
3. **Format is engineering, not cosmetics.** The structure of injected context — Markdown vs JSON, flat vs hierarchical, compact vs verbose — is a performance variable, not a style choice.
4. **Position matters.** Relevant components first. Alphabetical order is the enemy of attention.
5. **There is an optimal context window.** Too little and the model guesses. Too much and it drowns. The job is to hit the sweet spot for each query.
6. **Selective retrieval beats full dumps.** Don't inject your entire design system. Inject the 3–5 components relevant to the current task, with their composition patterns and examples.
## How Fragments Applies These Findings
These constraints shaped how we built [Fragments](/) — specifically the [MCP tools](/blog/fragments-mcp-tools-deep-dive) and the [context generation pipeline](/docs).
**Contract files solve the hallucination problem.** Every component has a `.contract.json` file with machine-readable props, enum values, defaults, composition patterns, and accessibility rules. The AI doesn't guess `padding="compact"` — it reads the prop schema and knows the valid values are `"none" | "sm" | "md" | "lg"`.
**Composition blocks provide the examples research says matter most.** Instead of prop tables alone, blocks show complete patterns: a Login Form wiring together Card, Input, Button, and Text. The block is the documentation unit the model actually learns from.
**The context generator is format-aware.** We tested Markdown vs JSON output, compact vs verbose, with and without code examples. The generator produces position-optimized context: the most relevant component first, composition data before prop lists, contract summaries before raw type definitions.
**MCP tools implement selective retrieval.** `design_system/list_primitives` returns reviewed component guidance for the active contract. `design_system/list_tokens` grounds styling in the real token vocabulary. `design_system/conform` and `design_system/prove_compliant` let the model check generated code without a 67-component dump.
**Token budgets prevent context rot.** Every context injection estimates token count. The system stays within the optimal window that the research identifies — enough to eliminate hallucination, not so much that attention degrades.
**The v2 type system prioritises what research says matters.** We [renamed](/docs) `variants` to `examples` because the research is clear: examples are the primary learning signal. `composition` was promoted from an optional AI hint to a first-class field because compound component structure is what the model actually needs to generate correct nesting.
## The Uncomfortable Implication
The research points to a conclusion that the AI hype cycle doesn't want to hear: making AI-generated code reliable requires more engineering, not less. Structured metadata. Selective retrieval. Format-aware context injection. Position-optimised prompts. Token budgets.
This is infrastructure work. It is not exciting. It does not demo well in a 30-second clip.
But it is the difference between AI that generates plausible-looking code and AI that generates correct code. Between 38% valid API invocations and something a team can actually ship.
The papers are public. The findings are reproducible. The gap between "AI writes code fast" and "AI writes code that meets professional standards" is an engineering problem with engineering solutions.
We're building those solutions. The [components](/components) are open. The [MCP tools](/blog/fragments-mcp-tools-deep-dive) are live. The research is cited above.
---
## References
1. Jain, N. et al. "On Mitigating Code LLM Hallucinations with API Documentation." arXiv:2407.09726, 2024.
2. Chen, J. et al. "When LLMs Meet API Documentation." arXiv:2503.15231, 2025.
3. He, J. et al. "Does Prompt Formatting Have Any Impact on LLM Performance?" arXiv:2411.10541, 2024.
4. Hsieh, C-Y. et al. "Found in the Middle: Calibrating Positional Attention Bias." arXiv:2406.16008, ACL Findings 2024.
5. Hong, K. et al. "Context Rot." Chroma Research, 2025.
6. Xu, D. et al. "Does Few-Shot Learning Help LLM Performance in Code Synthesis?" arXiv:2412.02906, 2024.

## Next steps
- Using Fragments MCP in Cursor for Design System-Aware UI GenerationConfigure Fragments MCP in Cursor so AI can generate UI using your real component docs, props, and design tokens instead of generic markup.
- MCP Tools for Design Systems: Practical Workflows for React TeamsPractical MCP tools for design systems workflows: how React teams use Fragments to query components and tokens, then check conformance through a hosted endpoint.
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