import { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { analyzeStock, StockPoint } from '@/services/api';
import StockChart from '@/components/stockChart';

export default function Home() {
  const [ticker, setTicker] = useState('');
  const [favorites, setFavorites] = useState(['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']);
  const [isEditingFavs, setIsEditingFavs] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [points, setPoints] = useState<StockPoint[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze(selectedTicker?: string) {
    const tickerToAnalyze = typeof selectedTicker === 'string' ? selectedTicker : ticker;
    if (!tickerToAnalyze) return;

    if (selectedTicker) setTicker(selectedTicker);

    setLoading(true);
    setResult(null);
    setPoints([]);

    try {
      const data = await analyzeStock(tickerToAnalyze);

      console.log('API RESPONSE:', data);
      console.log('CHART POINTS:', data.chart);

      setResult(data.summary);
      setPoints(data.chart ?? []);
    } catch (e) {
      setResult('Erro ao buscar dados');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Market Q&A</Text>

      <View style={{ marginTop: 20, marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontWeight: '600' }}>Favoritos</Text>
          <TouchableOpacity onPress={() => setIsEditingFavs(!isEditingFavs)}>
            <Text style={{ color: '#007AFF' }}>{isEditingFavs ? 'Concluir' : 'Editar'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {favorites.map((fav, index) => (
            isEditingFavs ? (
              <TextInput
                key={index}
                value={fav}
                onChangeText={(text) => {
                  const newFavs = [...favorites];
                  newFavs[index] = text.toUpperCase();
                  setFavorites(newFavs);
                }}
                style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, width: 70, textAlign: 'center' }}
              />
            ) : (
              <TouchableOpacity
                key={index}
                onPress={() => handleAnalyze(fav)}
                style={{ backgroundColor: '#f0f0f0', padding: 8, borderRadius: 8 }}
              >
                <Text>{fav}</Text>
              </TouchableOpacity>
            )
          ))}
        </View>
      </View>

      <TextInput
        placeholder="Ticker (ex: AAPL)"
        value={ticker}
        onChangeText={setTicker}
        autoCapitalize="characters"
        style={{ borderWidth: 1, padding: 8, marginVertical: 12 }}
      />

      <Button title="Analisar" onPress={() => handleAnalyze()} />

      {loading && <ActivityIndicator style={{ marginTop: 16 }} />}

      {result && <Text style={{ marginTop: 16 }}>{result}</Text>}

      {Array.isArray(points) && points.length > 0 && (
        <StockChart points={points} />
      )}
    </View>
  );
}
