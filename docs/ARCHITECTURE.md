# Architecture

```text
Player / Store UI (Next.js)
          |
          v
FastAPI validation -> Matching service -> PostgreSQL tables/holds
          |                    |
          |                    +-> Redis expiry -> reminder worker
          v
ranked, explained matches
```

The demo imports the same explicit fictional fixture shape on the frontend and mirrors it in Python so both layers exhibit the domain operation without claiming a live connection.

## Request paths

- Happy: valid request → hard filter → score → sorted explanations → hold.
- Nil/invalid: Pydantic rejects missing, out-of-range, and unknown enum values with 422; UI gives an inline error.
- Empty: return `[]`; UI states no fit and suggests changing a constraint.
- Upstream/store failure: production API returns named 503 `inventory_unavailable`; UI preserves inputs and offers retry. No silent fallback to invented inventory.

## Production controls

Seat creation and holds require authenticated store/player roles. Holds use a database transaction, capacity constraint, expiration, and idempotency key. Log match latency, zero-result rate, hold conflicts, acceptance, expiry, attendance, and safety reports without exact home coordinates. Alert on hold-conflict rate above 1%, reminder failure above 5%, or inventory feed staleness above 15 minutes.
