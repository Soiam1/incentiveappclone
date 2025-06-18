# backend/api/leaderboard_router.py

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db.database import SessionLocal
from crud.leaderboard_crud import (
    get_leaderboard,
    calculate_leaderboard,
    get_streak_leaderboard,
    update_user_streak,
)

router = APIRouter()


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- Leaderboard Endpoints ---------------- #

@router.get("/")
def leaderboard_view(
    scope: str = Query(..., pattern="^(day|week|month)₹"),
    db: Session = Depends(get_db)
):
    """
    Generic leaderboard for day/week/month
    """
    return get_leaderboard(db, scope)


@router.get("/day")
def leaderboard_day(db: Session = Depends(get_db)):
    return calculate_leaderboard(db, period="day")


@router.get("/week")
def leaderboard_week(db: Session = Depends(get_db)):
    return calculate_leaderboard(db, period="week")


@router.get("/month")
def leaderboard_month(db: Session = Depends(get_db)):
    return calculate_leaderboard(db, period="month")


@router.get("/streak")
def leaderboard_streak(db: Session = Depends(get_db)):
    return get_streak_leaderboard(db)


# ---------------- Streak Update Endpoint ---------------- #

class StreakUpdate(BaseModel):
    user_id: int
    date: str  # Example: "2025-06-07"

@router.post("/streaks/update")
def update_streak(data: StreakUpdate, db: Session = Depends(get_db)):
    return update_user_streak(db, data.user_id, data.date)
