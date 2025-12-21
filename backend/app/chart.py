from fastapi import APIRouter
from app.services.alpha_vantage_client import get_daily_time_series

router = APIRouter()

@router.get("/chart/{ticker}")
async def get_chart_data(ticker: str):
    data = await get_daily_time_series(ticker)

    series = data.get("Time Series (Daily)")
    if not series:
        return {"points": []}

    # últimos 30 dias
    dates = sorted(series.keys())[-30:]

    points = [
        {
            "date": d,
            "close": float(series[d]["4. close"])
        }
        for d in dates
    ]

    return {"points": points}
