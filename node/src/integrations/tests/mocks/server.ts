// ─── Drill Set 5: MSW Node Server Setup ──────────────────────────────────────
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
