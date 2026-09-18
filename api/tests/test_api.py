from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health() -> None:
    assert client.get("/health").json() == {"status": "ok"}


def test_matches_are_filtered_and_ranked() -> None:
    response = client.post("/v1/matches", json={"game": "Catan", "skill": "casual", "night": "Friday", "radius_miles": 8})
    assert response.status_code == 200
    body = response.json()
    assert [match["id"] for match in body] == ["table-04", "table-11"]
    assert body[0]["score"] > body[1]["score"]
    assert body[0]["reasons"]


def test_empty_result_is_explicit() -> None:
    response = client.post("/v1/matches", json={"game": "Mahjong", "skill": "learning", "night": "Tuesday", "radius_miles": 8})
    assert response.status_code == 200
    assert response.json() == []


def test_invalid_radius_is_rejected() -> None:
    response = client.post("/v1/matches", json={"game": "Catan", "skill": "casual", "night": "Friday", "radius_miles": 0})
    assert response.status_code == 422


def test_unknown_skill_is_rejected() -> None:
    response = client.post("/v1/matches", json={"game": "Catan", "skill": "expert", "night": "Friday", "radius_miles": 8})
    assert response.status_code == 422
