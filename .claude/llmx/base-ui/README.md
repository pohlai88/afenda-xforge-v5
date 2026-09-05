# Base UI (base-ui.com) — reference corpus

Retrieved 2026-09-04 from https://base-ui.com/llms.txt, every linked page as markdown.
Base UI was at v1.8.0 (released the same day); this repository pins @base-ui/react 1.7.0.

    llms.txt          the site's index: Overview, Handbook, Components, Utilities
    manifest.tsv      section and URL per page, as fetched
    pages/            78 pages, one file each, named <section>_<slug>.md

    Overview     quick-start, accessibility, about, community, releases (index + 26 notes)
    Handbook     styling, composition, customization, animation, forms, typescript
    Components   37 components; each page carries anatomy, API, and demos in CSS Modules
                 and Tailwind (read demos for the pattern, not the styles)
    Utilities    use-render, merge-props, direction-provider, csp-provider

Third-party material, kept out of git (.claude/llmx/ is ignored). Re-fetch: read the
URLs from llms.txt and curl each one.
