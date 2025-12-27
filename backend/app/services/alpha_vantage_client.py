import os
import logging
import httpx

API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
BASE_URL = "https://www.alphavantage.co/query"

async def get_daily_time_series(ticker: str):
    params = {
        "function": "TIME_SERIES_DAILY",
        "symbol": ticker,
        "apikey": API_KEY
    }

    if not API_KEY:
        logging.getLogger(__name__).warning("ALPHA_VANTAGE_API_KEY is not set; cannot fetch data for %s", ticker)
        return None

    async with httpx.AsyncClient() as client:
        response = await client.get(BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()

        # Alpha Vantage returns the time series under a key like
        # "Time Series (Daily)". If the response contains that key,
        # return the nested mapping (date -> values). Otherwise return
        # None so callers can handle the error (rate limit, bad symbol, etc.).
        ts_key = next((k for k in data.keys() if k.lower().startswith("time series")), None)
        if ts_key and isinstance(data.get(ts_key), dict):
            return data[ts_key]

        # Could be an error / note indicating rate limits or bad API key
        # e.g. {"Note": "..."} or {"Error Message": "..."}
        logger = logging.getLogger(__name__)
        logger.warning(
            "Unexpected Alpha Vantage response for %s: top-level keys=%s",
            ticker,
            list(data.keys()),
        )
        return None
