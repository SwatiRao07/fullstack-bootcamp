/**
 * Run (no traces):
 *   pnpm tsx best-practises/drill-07-debug-namespaces.ts
 *
 * Run (all app traces):
 *   $env:DEBUG="app:*"; pnpm tsx best-practises/drill-07-debug-namespaces.ts
 *
 * Run (only repo traces):
 *   $env:DEBUG="app:repo"; pnpm tsx best-practises/drill-07-debug-namespaces.ts
 */

import pino from "pino";
import createDebug from "debug";

const log = pino({ level: "info" }); // business logs – always on

// ── Module: app:repo ──────────────────────────

const debugRepo = createDebug("app:repo");

function findUser(id: string) {
  debugRepo("findUser called id=%s", id);            // trace – only when DEBUG matches
  const user = { id, name: "Aarav" };
  debugRepo("findUser result %O", user);
  return user;
}

// ── Module: app:users ─────────────────────────

const debugUsers = createDebug("app:users");

function getUser(id: string) {
  debugUsers("getUser start id=%s", id);             // trace
  const user = findUser(id);
  log.info({ id, name: user.name }, "user fetched"); // business log – always visible
  debugUsers("getUser done");
  return user;
}


getUser("u1");
getUser("u2");
