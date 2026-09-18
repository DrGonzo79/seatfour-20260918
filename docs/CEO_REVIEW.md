# CEO review

**Mode:** scope reduction. The strategic risk is marketplace liquidity, so the prototype proves one narrow transaction instead of pretending to be a complete social network.

## Nuclear challenge

“Dating app for games” is catchy but wrong: swipe mechanics optimize browsing, while the outcome is a reliable occupied seat. The buyer is the store, not the lonely player. If stores do not expose real inventory or pay for attendance lift, the premise fails.

## Alternatives

- Minimal concierge roster: best validation speed; operationally manual.
- Deterministic venue matcher: accepted baseline; transparent and production-shaped.
- Full community marketplace: compelling 12-month state but premature before density.

## Review findings and decisions

1. **Architecture:** separate inventory filtering from ranking. Capacity and holds belong in transactional storage, not client state.
2. **Errors:** name `invalid_request`, `inventory_unavailable`, `hold_conflict`, `hold_expired`, and `notification_failed`; every one needs visible retry/recovery copy.
3. **Security:** venue-only matching, coarse player location, authenticated roles, rate limits, report/block flow, and no inferred sensitive traits.
4. **Data flow:** nil, empty, invalid, too-far, full, stale, double-click, timeout, and navigate-away paths are explicit. The demo covers invalid and empty; production must add idempotent holds.
5. **Code quality:** rules stay pure and explainable. Do not add an AI abstraction until outcome data exists.
6. **Tests:** cover ranking, filtering, invalid input, empty results, seat hold/release, and mobile overflow. Add concurrency tests with the real database later.
7. **Observability:** match funnel, zero-result rate, hold conflicts, expiry, attendance, and store inventory freshness are launch metrics.
8. **State:** this demo is stateless. Production needs constraints preventing capacity below zero and multiple active holds by the same player.
9. **API:** versioned `/v1/matches`; stable enums; pagination only when inventory volume warrants it; 429 for abusive search loops.
10. **Scale:** city-by-city partitioning works well; the hard problem at 100× is liquidity imbalance, not CPU.
11. **UX:** keep constraint inputs visible, explain every score, never hide an empty result, and label demo-only holds.

## Accepted scope

Player constraint form, deterministic matching, explanations, validation, loading/empty states, demo hold/release, FastAPI operation, tests, and static deployment.

## Deferred / not in scope

Accounts, payments, chat, user-generated home events, deposits, live geocoding, notifications, AI recommendations, and publicly hosted Python. These require demand, safety policy, or hosting approval.

**Decision:** ship the narrow workflow; run the concierge pilot before building marketplace breadth.
