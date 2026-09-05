/**
 * The anatomy vocabulary — Material 3's part grammar sized to this package
 * (docs/architecture.md §6.3). A part is a `data-slot`; every slot a component
 * stamps belongs to exactly one class, and the class fixes what the part may
 * draw. The list is closed: a slot without a class fails R2, and a divider
 * that borrows a target's boundary fails the same test. The map is the
 * reviewed fact; the components are read, never trusted.
 */

export const PART_CLASSES = [
  "action",
  "container",
  "divider",
  "icon",
  "indicator",
  "label",
  "media",
  "scrim",
  "structural",
  "supporting",
] as const;

export type PartClass = (typeof PART_CLASSES)[number];

/** What each class draws, in M3's terms. The checks below refer to these. */
export const PART_RULES: Readonly<Record<PartClass, string>> = {
  action:
    "the interactive part a state attaches to; takes its container's pair plus the state grammar (§6.2)",
  container:
    "a fill pair's fill (M3 container); may carry elevation; a target's boundary is --input",
  divider:
    "decorative only (M3 outline-variant): --border, never --input, --primary or --ring",
  icon: "the label's ink, inherited — icons are svg children here, not stamped parts",
  indicator:
    "an active indicator or selection mark: --input for a boundary, --ring for focus, the container's ink for a check or dot",
  label:
    "the on- partner of its container (M3 label text, headline); never chosen alone",
  media: "an image; no colour of its own",
  scrim:
    "a fixed translucent cover over the page (M3 scrim); exempt from measurement — nothing is read through it",
  structural: "layout only; inherits, paints nothing",
  supporting:
    "M3 supporting text: --muted-foreground on the container, --destructive in the error state",
};

/** Components that stamp no part of their own, each with the reason. */
export const NO_PARTS: Readonly<Record<string, string>> = {
  badge: "a single element with no sub-parts; its root is the whole anatomy",
  sonner: "a third-party toaster whose markup the design package does not own",
};

/**
 * Every `data-slot` in `src/components`, classified. R2 discovers the slots
 * from source and pins the set per component; this pins the class per slot,
 * so the two together are the reviewed anatomy.
 */
export const PARTS: Readonly<Record<string, PartClass>> = {
  "alert-dialog": "structural",
  "alert-dialog-action": "action",
  "alert-dialog-cancel": "action",
  "alert-dialog-content": "container",
  "alert-dialog-description": "supporting",
  "alert-dialog-footer": "structural",
  "alert-dialog-header": "structural",
  "alert-dialog-media": "media",
  "alert-dialog-overlay": "scrim",
  "alert-dialog-portal": "structural",
  "alert-dialog-title": "label",
  "alert-dialog-trigger": "action",
  avatar: "container",
  "avatar-badge": "indicator",
  "avatar-fallback": "container",
  "avatar-group": "structural",
  "avatar-group-count": "label",
  "avatar-image": "media",
  button: "container",
  card: "container",
  "card-action": "action",
  "card-content": "structural",
  "card-description": "supporting",
  "card-footer": "structural",
  "card-header": "structural",
  "card-title": "label",
  dialog: "structural",
  "dialog-close": "action",
  "dialog-content": "container",
  "dialog-description": "supporting",
  "dialog-footer": "structural",
  "dialog-header": "structural",
  "dialog-overlay": "scrim",
  "dialog-portal": "structural",
  "dialog-title": "label",
  "dialog-trigger": "action",
  "dropdown-menu": "structural",
  "dropdown-menu-checkbox-item": "action",
  "dropdown-menu-checkbox-item-indicator": "indicator",
  "dropdown-menu-content": "container",
  "dropdown-menu-group": "structural",
  "dropdown-menu-item": "action",
  "dropdown-menu-label": "label",
  "dropdown-menu-portal": "structural",
  "dropdown-menu-radio-group": "structural",
  "dropdown-menu-radio-item": "action",
  "dropdown-menu-radio-item-indicator": "indicator",
  "dropdown-menu-separator": "divider",
  "dropdown-menu-shortcut": "supporting",
  "dropdown-menu-sub": "structural",
  "dropdown-menu-sub-content": "container",
  "dropdown-menu-sub-trigger": "action",
  "dropdown-menu-trigger": "action",
  field: "structural",
  "field-content": "structural",
  "field-description": "supporting",
  "field-error": "supporting",
  "field-group": "structural",
  "field-label": "label",
  "field-legend": "label",
  "field-separator": "divider",
  "field-separator-content": "supporting",
  "field-set": "structural",
  input: "container",
  label: "label",
  "select-content": "container",
  "select-group": "structural",
  "select-item": "action",
  "select-label": "label",
  "select-scroll-down-button": "action",
  "select-scroll-up-button": "action",
  "select-separator": "divider",
  "select-trigger": "container",
  "select-value": "label",
  separator: "divider",
  skeleton: "container",
  table: "structural",
  "table-body": "structural",
  "table-caption": "supporting",
  "table-cell": "structural",
  "table-container": "container",
  "table-footer": "structural",
  "table-head": "label",
  "table-header": "structural",
  "table-row": "structural",
};
