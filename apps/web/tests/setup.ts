import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Vitest does not expose afterEach globally, so Testing Library cannot
// register its own cleanup; without this, renders leak across tests.
afterEach(cleanup);
