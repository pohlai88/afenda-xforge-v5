# Material Design 3 (m3.material.io) — reference corpus

Retrieved 2026-09-04. The site is an Angular single-page app that renders no text without
JavaScript, so this was pulled from its own content API rather than scraped:

    https://m3.material.io/_dsm/content/m3/<carbonVersion>/<pageCanonId>.json
    carbonVersion 2026-09-02_06-10-10, read from the app bundle

One JSON per page; each holds the page's tabs as sections. A component page therefore
carries Overview, Guidelines, Specs and Accessibility in one file. 103 files here cover
every non-blog URL in the sitemap (375 URLs, 113 of them blog posts).

    *.md              one file per page, converted from the API's html chunks
    routes_all.jsonl  the app's own route table: slug, carbon file id, carbon path
    sitemap-ids.txt   every pageCanonId found in the content sitemap

What survives conversion: headings, prose, lists, tables, links, code snippets, image alt
text and figure captions (captions carry much of the spec detail, e.g. which colour role
maps to which part). What is lost: the rendered diagrams themselves, and the interactive
token tables that load as separate modules.

Key files for foundation work: color-roles, color, choosing-a-scheme, dynamic, static,
typography, shape, elevation, states, motion-easing-and-duration, motion-transitions,
motion-overview, spacing, grids-spacing, breakpoints, layout-overview, design-tokens,
icons, building-for-all, usability, interaction (see states), canonical-examples.

Third-party material, kept out of git (.claude/llmx/ is ignored).
