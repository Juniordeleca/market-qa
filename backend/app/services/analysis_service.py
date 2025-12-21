from app.services.alpha_vantage_client import get_daily_time_series

async def analyze_stock(ticker: str) -> str:
    data = await get_daily_time_series(ticker)

    if "Note" in data:
        return "Limite de requisições da Alpha Vantage atingido. Tente novamente em alguns instantes."

    if "Error Message" in data:
        return "Erro ao consultar o ativo informado."

    series = data.get("Time Series (Daily)")
    if not series:
        return "Dados indisponíveis no momento."

    dates = sorted(series.keys(), reverse=True)

    if len(dates) < 2:
        return "Dados insuficientes para análise."

    latest = series[dates[0]]
    previous = series[dates[1]]

    close_latest = float(latest["4. close"])
    close_previous = float(previous["4. close"])

    variation = ((close_latest - close_previous) / close_previous) * 100

    return (
        f"Último fechamento: {close_latest:.2f}. "
        f"Variação diária: {variation:.2f}%."
    )
