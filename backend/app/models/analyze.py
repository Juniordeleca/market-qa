from pydantic import BaseModel
from typing import List

class AnalyzeRequest(BaseModel):
    ticker: str

class StockPoint(BaseModel):
    date: str
    close: float

class AnalyzeResponse(BaseModel):
    summary: str
    chart: List[StockPoint]
