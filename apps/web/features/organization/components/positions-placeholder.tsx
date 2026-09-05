/**
 * Positions ride the same view contract but the domain does not model them
 * yet — an honest placeholder, not a mock (the contract gains `positions`
 * with the screen that observes them).
 */
export const PositionsPlaceholder = () => (
  <div className="rounded-lg border border-border border-dashed p-10 text-center">
    <h2 className="font-medium">Positions aren't modelled yet</h2>
    <p className="mt-1 text-muted-foreground text-sm">
      This view arrives with the positions domain. People and Org chart are
      fully operational.
    </p>
  </div>
);
