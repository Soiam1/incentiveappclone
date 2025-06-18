from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, date
from db.database import get_db
from crud.salesman_crud import get_all_approved_salesmen, delete_salesman
from schemas.salesman_schema import SalesmanOut
from utils.security import get_current_user_role
from models.sale import Sale
from models.incentive import Incentive

from utils.security import get_current_salesman
router = APIRouter()

@router.get("/salesmen", response_model=list[SalesmanOut])
def list_approved_salesmen(
    db: Session = Depends(get_db),
    role: str = Depends(get_current_user_role)
):
    if role != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")
    return get_all_approved_salesmen(db)

@router.delete("/salesmen/{salesman_id}")
def remove_salesman(
    salesman_id: int,
    db: Session = Depends(get_db),
    role: str = Depends(get_current_user_role)
):
    if role != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")
    success = delete_salesman(db, salesman_id)
    if not success:
        raise HTTPException(status_code=404, detail="Salesman not found or not approved")
    return {"message": "Salesman removed"}

@router.get("/me", response_model=SalesmanOut)
def get_me(
    salesman=Depends(get_current_user_role("salesman"))
):
    return salesman

@router.get("/stats")
def get_salesman_stats(db: Session = Depends(get_db), current_user=Depends(get_current_salesman)):
    today = date.today()
    month_start = today.replace(day=1)

    # Monthly sales
    month_sales = db.query(Sale).filter(
        Sale.salesman_id == current_user.id,
        Sale.timestamp >= month_start
    ).all()
    month_sales_count = len(month_sales)
    month_sales_amount = sum(s.amount for s in month_sales)

    # Today's sales
    today_sales = db.query(Sale).filter(
        Sale.salesman_id == current_user.id,
        Sale.timestamp >= today
    ).all()
    today_sales_count = len(today_sales)
    today_sales_amount = sum(s.amount for s in today_sales)

    # Today's incentive
    today_incentives = db.query(Incentive).filter(
        Incentive.salesman_id == current_user.id,
        Incentive.timestamp >= today
    ).all()
    today_incentive_sum = sum(i.amount for i in today_incentives)

    # Wallet balance
    wallet_balance = current_user.wallet_balance or 0.0

    return {
        "month_sales_count": month_sales_count,
        "month_sales_amount": month_sales_amount,
        "today_sales_count": today_sales_count,
        "today_sales_amount": today_sales_amount,
        "today_incentive": today_incentive_sum,
        "wallet_balance": wallet_balance
    }

