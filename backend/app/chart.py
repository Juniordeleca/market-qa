from fastapi import APIRouter
from app.services.analysis_service import analyze_stock

router = APIRouter()

@router.get("/chart/{ticker}")
async def get_chart_data(ticker: str):
    result = await analyze_stock(ticker)
    return {"points": result["chart"]}
