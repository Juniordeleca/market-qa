import { API_BASE_URL } from "@/constants/env";

export type StockPoint = {
  date: string;
  close: number;
};

export type AnalyzeResponse = {
  summary: string;
  last_close: number;
  daily_change: number;
  chart: StockPoint[];
};

export async function analyzeStock(ticker: string): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticker }),
  });

  if (!response.ok) {
    throw new Error('Erro ao analisar ativo');
  }

  return response.json();
}

