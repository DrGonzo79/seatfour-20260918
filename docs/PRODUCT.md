# Product plan

## ICP and job to be done

**Buyer:** independent game-store events manager with recurring open-play inventory. **User:** solo or disconnected player seeking a safe, compatible, nearby table. **JTBD:** “When I have an open game night, place me at a table whose game, pace, location, and time fit, so I can commit without organizing strangers.” Store JTBD: fill fragile last seats without manual Discord chasing.

## MVP

- Store creates venue-hosted tables with game, pace, time, capacity, and cutoff.
- Player supplies game, pace, night, and travel radius.
- Rules engine filters hard constraints, ranks viable tables, explains fit, and issues a time-bounded hold.
- Reminder asks for confirmation; expiry returns the seat to inventory.
- Store sees confirmed count and no-show history. No free-form chat, public social feed, home hosting, or AI concierge in v1.

## Data model

- `Store(id, name, location, verification_status)`
- `Game(id, title, min_players, max_players, duration_minutes)`
- `Table(id, store_id, game_id, starts_at, pace, capacity, status)`
- `Player(id, display_name, home_geohash, pace_by_game)`
- `SeatHold(id, table_id, player_id, expires_at, status)`
- `Attendance(id, table_id, player_id, outcome, checked_in_at)`

Uniqueness on active `(table_id, player_id)` holds; atomic capacity decrement prevents overbooking. Coarse geohashes protect exact home location.

## Technical architecture

Next.js provides accessible discovery and store operations. FastAPI owns validation and deterministic ranking. PostgreSQL is the transactional source of truth; Redis holds short seat expirations; a worker sends reminders and processes expiries. GitHub Pages hosts only this static demonstration.

## AI/model strategy

Do not use an LLM for initial ranking. Sparse data and safety-sensitive explanations favor auditable rules. After enough completed games, learn weights from acceptance, attendance, repeat-play, and block/report signals. Use embeddings only for game-tag similarity; never infer protected traits or personality compatibility.

## Economics

Hypothesis: $149/location/month plus optional $1–$2 per verified incremental attendee. A store with four events weekly needs roughly 6–10 incremental attendee visits and/or 2–3 manager hours saved to justify the fee. At 75% gross margin, city operations must remain below $35/store/month. Players remain free until density is proven.

## Validation

Twenty-one-day concierge pilot across five stores. Pass thresholds: 60% of eligible requests accept a hold, 75% of accepted holds check in, 50 incremental occupied seats, under 10 manager minutes per event, and three of five stores sign a paid letter. Kill or reposition if attendance remains below 50% or stores will not share structured inventory.

## Moat

The durable asset is not profiles; it is local table liquidity plus verified attendance and game-specific compatibility. Supply relationships, reliable last-seat recovery, and cross-store routing create compounding density. Generic event calendars can copy forms but lack transactional inventory and attendance truth.

## Risks

- Cold start: seed one neighborhood and a few repeat games.
- No-shows: deposits only after testing reminders and reputation.
- Safety: venue-only meetings, verified stores, blocking/reporting, visible code of conduct.
- Overbooking: transactional holds with expiry and idempotency keys.
- Bad-fit scoring: explicit explanations and player-adjustable pace.
- Store disintermediation: provide operational value through roster, reminders, and recovery.

## 30 / 60 / 90 days

- **30:** interview 10 managers; shadow 2; recruit 5 pilot stores; manually fill first 20 seats.
- **60:** ship store inventory, player requests, holds, reminders, check-in; reach 100 completed seats.
- **90:** charge pilot stores; add recovery queue and attendance reputation; decide whether one-city density supports expansion.
