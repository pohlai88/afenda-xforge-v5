/** Deterministic ids: `mem_0001` — fixtures never depend on randomness. */
export const id = (prefix: string, n: number) =>
  `${prefix}_${n.toString().padStart(4, "0")}`;

const epoch = Date.UTC(2026, 0, 5, 9, 0, 0);
const dayMs = 86_400_000;

/** Deterministic ISO timestamps: day `n` after the fixture epoch. */
export const dayAfterEpoch = (n: number) =>
  new Date(epoch + n * dayMs).toISOString();
