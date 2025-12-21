import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
} from 'react-native';

import { analyzeStock, fetchStockChart } from '@/services/api';
import StockChart from '@/components/stockChart';

type ChartPoint = {
  date: string;
  close: number;
};

export default function Home() {
  const [ticker, setTicker] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [chartPoints, setChartPoints] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!ticker) return;

    setLoading(true);
    setResult(null);
    setChartPoints([]);

    try {
      const analysis = await analyzeStock(ticker);
      const chart = await fetchStockChart(ticker);

      setResult(analysis.summary);
      setChartPoints(chart.points ?? []);
    } catch (e) {
      setResult('Erro ao buscar dados');
      setChartPoints([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
        Market Q&A
      </Text>

      <TextInput
        placeholder="Ticker (ex: AAPL)"
        value={ticker}
        onChangeText={setTicker}
        autoCapitalize="characters"
        style={{
          borderWidth: 1,
          padding: 8,
          marginVertical: 12,
        }}
      />

      <Button title="Analisar" onPress={handleAnalyze} />

      {loading && (
        <ActivityIndicator style={{ marginTop: 16 }} />
      )}

      {result && (
        <>
          <Text style={{ marginTop: 16 }}>
            {result}
          </Text>

          <StockChart points={chartPoints} />
        </>
      )}
    </View>
  );
}

