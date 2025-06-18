from pydantic import BaseModel
from datetime import datetime

class IncentiveOut(BaseModel):
    id: int
    barcode: str
    amount: float
    trait: str
    timestamp: datetime

    class Config:
        from_attributes = True

class IncentiveSchema(BaseModel):
    day_amount: float
    week_amount: float
    month_amount: float