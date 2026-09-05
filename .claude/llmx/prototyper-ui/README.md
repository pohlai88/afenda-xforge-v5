# Prototyper UI — machine-readable docs

Retrieved 2026-09-04 from https://prototyper-ui.com (see /docs/for-agents/llms-txt).

    llms.txt             index: every doc page with a one-line description       102 lines
    llms-full.txt        every doc page, full text                            28,912 lines
    llms-components.txt  every component page, full text                     19,333 lines

Per-page and per-component text is also served live at
https://prototyper-ui.com/llms/{slug} and /llms/components/{name}.

Third-party documentation, kept out of git (.claude/llmx/ is ignored). Re-fetch with:

    for f in llms.txt llms-full.txt llms-components.txt; do curl -sL "https://prototyper-ui.com/$f" -o "$f"; done
