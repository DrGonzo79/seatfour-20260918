# SeatFour

SeatFour is a runnable prototype for matching solo board-game players into compatible tables at local game stores. The static frontend demonstrates discovery, fit scoring, validation, empty/loading states, and a clearly labeled demo seat hold. The Python service implements the same core matching operation as a testable API.

## Run it

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. Run checks with:

```bash
npm run typecheck
npm run test:e2e
npm run build
npm run audit:prod
cd api && uv sync --frozen && uv run pytest
```

Run the API locally with `cd api && uv run uvicorn main:app --reload`. `POST /v1/matches` accepts `game`, `skill`, `night`, and `radius_miles`.

## Deployment boundary

GitHub Pages serves the frontend static export under the repository base path. The FastAPI backend is runnable and tested source only; it is **not publicly deployed**. All tables, venues, people, seat holds, and scores shown in the demo are fictional. No paid API, account, booking, or message is used.

See [product plan](docs/PRODUCT.md), [Office Hours](docs/OFFICE_HOURS.md), [CEO review](docs/CEO_REVIEW.md), and [source notes](research/notes.md).
