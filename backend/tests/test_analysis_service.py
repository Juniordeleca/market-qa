import asyncio

import pytest

from app.services import analysis_service


async def _fake_time_series(ticker: str):
    return {
        "2025-12-19": {"4. close": "90.0"},
        "2025-12-20": {"4. close": "100.0"},
    }


def test_analyze_stock_success(monkeypatch):
    monkeypatch.setattr(
        "app.services.alpha_vantage_client.get_daily_time_series",
        _fake_time_series,
    )

    result = asyncio.run(analysis_service.analyze_stock("FAKE"))

    assert "summary" in result
    assert "chart" in result
    assert len(result["chart"]) == 2


def test_analyze_stock_no_data(monkeypatch):
    monkeypatch.setattr(
        "app.services.alpha_vantage_client.get_daily_time_series",
        lambda ticker: None,
    )

    result = asyncio.run(analysis_service.analyze_stock("FAKE"))

    assert isinstance(result.get("chart"), list)
    assert result["chart"] == []