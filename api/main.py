from typing import Literal

from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="SeatFour Matching API", version="0.1.0")

Skill = Literal["learning", "casual", "competitive"]
SKILL_ORDER: dict[str, int] = {"learning": 0, "casual": 1, "competitive": 2}
TABLES = [
    {"id": "table-04", "game": "Catan", "skill": "casual", "night": "Friday", "time": "7:00 PM", "venue": "Corner Meeple", "distance": 2.4, "open_seats": 1},
    {"id": "table-11", "game": "Catan", "skill": "learning", "night": "Friday", "time": "6:30 PM", "venue": "Dice & Draft", "distance": 5.8, "open_seats": 2},
    {"id": "table-22", "game": "Chess", "skill": "competitive", "night": "Tuesday", "time": "7:00 PM", "venue": "Knight Shift", "distance": 3.1, "open_seats": 2},
    {"id": "table-27", "game": "Chess", "skill": "casual", "night": "Tuesday", "time": "6:00 PM", "venue": "Corner Meeple", "distance": 9.3, "open_seats": 1},
]


class MatchRequest(BaseModel):
    game: str = Field(min_length=2, max_length=50)
    skill: Skill
    night: Literal["Tuesday", "Thursday", "Friday"]
    radius_miles: float = Field(ge=1, le=30)


class TableMatch(BaseModel):
    id: str
    game: str
    skill: Skill
    night: str
    time: str
    venue: str
    distance: float
    open_seats: int
    score: int
    reasons: list[str]


def rank_matches(request: MatchRequest) -> list[TableMatch]:
    """Filter hard constraints, then rank viable tables by pace, distance, and seats."""
    matches: list[TableMatch] = []
    for table in TABLES:
        if table["game"] != request.game or table["night"] != request.night:
            continue
        if table["distance"] > request.radius_miles or table["open_seats"] < 1:
            continue
        gap = abs(SKILL_ORDER[request.skill] - SKILL_ORDER[str(table["skill"])])
        score = max(50, round(100 - float(table["distance"]) * 5 - gap * 16 + int(table["open_seats"]) * 2))
        reasons = [
            "Preferred pace matches" if gap == 0 else "Welcomes adjacent skill levels",
            f"{float(table['distance']):.1f} miles away",
            f"{int(table['open_seats'])} open seat" + ("s" if int(table["open_seats"]) != 1 else ""),
        ]
        matches.append(TableMatch(**table, score=score, reasons=reasons))
    return sorted(matches, key=lambda match: match.score, reverse=True)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/v1/matches", response_model=list[TableMatch])
def create_matches(request: MatchRequest) -> list[TableMatch]:
    return rank_matches(request)
