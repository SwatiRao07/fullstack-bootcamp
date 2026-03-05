# Sandbox API Testing Strategy (Drill Set 6)

## What is a Sandbox API?

A sandbox is an isolated environment provided by external services (e.g. Stripe, Twilio, PayPal) where you can make **real HTTP calls** with test credentials and predictable responses—without charging cards or sending real messages.

---

## How to Test Against Stripe Test Mode

### 1. Set Up Test Credentials

Store your Stripe **test** secret key in `.env`:

```
STRIPE_SECRET_KEY=sk_test_...
```

Never commit real keys. Use `.env` + `.gitignore`.

---

### 2. Trigger Special Scenarios with Magic Values

Stripe exposes special card numbers that produce predictable outcomes:

| Card Number           | Scenario                      |
| --------------------- | ----------------------------- |
| `4242 4242 4242 4242` | Successful payment            |
| `4000 0000 0000 9995` | Declined (insufficient funds) |
| `4000 0025 0000 3155` | 3D-Secure required            |
| `4000 0000 0000 0069` | Expired card                  |

This means you don't need to mock — you hit the **real API** and get consistent results.

---

### 3. Assert on Stripe's Response Shape

```typescript
const charge = await stripe.charges.retrieve("ch_test_...");
expect(charge.status).toBe("succeeded");
expect(charge.amount).toBe(2000); // $20.00
```

---

### 4. Use Stripe Webhooks Locally

Use the [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward events to your local server:

```bash
stripe listen --forward-to localhost:3000/webhooks/stripe
```

---

## How This Compares to MSW (Drill 5)

| Approach              | Pros                                 | Cons                                    |
| --------------------- | ------------------------------------ | --------------------------------------- |
| **MSW (Drill 5)**     | Fast, offline, fully controlled      | Doesn't catch real API breaking changes |
| **Sandbox (Drill 6)** | Tests real network, auth, TLS, shape | Slower, requires internet + test keys   |

**Recommendation:** Use MSW in CI for speed. Run sandbox tests nightly or before releases.

---

## General Strategy for Any Sandbox

1. **Load credentials from `.env`** — never hardcode.
2. **Tag sandbox tests** (`@sandbox`) so they can be selectively skipped in CI.
3. **Assert response shapes**, not magic values — APIs can change field names.
4. **Reset state after each test** — use the sandbox API's delete/refund endpoints.
5. **Record & replay (optional)** — tools like `nock` or Polly.js can record real sandbox calls and replay them offline.

---

## Example: Running Sandbox Tests

```bash
# In WSL from /mnt/e/fullstack-bootcamp/node
STRIPE_SECRET_KEY=sk_test_... pnpm exec vitest run --reporter=verbose src/integrations/tests/sandbox.test.ts
```
