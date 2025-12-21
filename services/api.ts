import { API_BASE_URL } from "@/constants/env";

export async function analyzeStock(ticker: string) {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ticker }),
  });

  if (!response.ok) {
    throw new Error('Erro ao analisar ativo');
  }

  return response.json();
}

export async function fetchStockChart(ticker: string) {
  const response = await fetch(`${API_BASE_URL}/chart/${ticker}`);

  if (!response.ok) {
    throw new Error('Erro ao buscar dados do gráfico');
  }

  return response.json();
}
