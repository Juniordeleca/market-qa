from app.services.alpha_vantage_client import get_daily_time_series

async def analyze_stock(ticker: str):
    data = await get_daily_time_series(ticker)

    if not data:
        return {
            "summary": "Não foi possível obter dados.",
            "chart": []
        }

    sorted_items = sorted(data.items())[-30:]

    # Build chart robustly: skip entries that don't have the expected
    # close field and handle parsing errors gracefully.
    chart = []
    for date, values in sorted_items:
        if not isinstance(values, dict):
            continue

        # Primary expected key is "4. close" (Alpha Vantage), but be resilient
        close_str = values.get("4. close")
        if close_str is None:
            # Some unexpected response could use a different key or be malformed.
            continue

        try:
            close = float(close_str)
        except (ValueError, TypeError):
            continue

        chart.append({"date": date, "close": close})

    if len(chart) < 2:
        return {
            "summary": "Dados insuficientes para cálculo (resposta da API inesperada).",
            "chart": chart,
        }

    last = chart[-1]["close"]
    prev = chart[-2]["close"]
    change = ((last - prev) / prev) * 100

    summary = (
        f"Último fechamento: {last:.2f}. "
        f"Variação diária: {change:.2f}%."
    )

    return {
        "summary": summary,
        "chart": chart
    }
