from fastapi import APIRouter
from app.models.analyze import AnalyzeRequest, AnalyzeResponse
from app.services.analysis_service import analyze_stock

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    summary = await analyze_stock(request.ticker)
    return AnalyzeResponse(summary=summary)
