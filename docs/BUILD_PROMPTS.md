# Phased build prompts

1. **Inventory:** Replace fixtures with PostgreSQL stores, games, and tables. Add migrations, role-based store CRUD, stale-inventory alerts, and contract tests.
2. **Transactional holds:** Add authenticated players, idempotent seat holds, atomic capacity checks, Redis expiry, hold-conflict UX, and concurrency tests.
3. **Attendance loop:** Add consented reminders, venue check-in, no-show recovery queue, notification-failure retries, metrics, and a manager dashboard.
4. **Safety and learning:** Add store verification, report/block tooling, coarse geolocation, privacy retention, audit logs, and only then outcome-trained ranking experiments behind a feature flag.

Each phase must preserve explicit empty/error states, accessible mobile interactions, rollback instructions, and a no-paid-service local development path.
