import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

type ChartPoint = {
  date: string;
  close: number;
};

type Props = {
  points: ChartPoint[];
};

const screenWidth = Dimensions.get('window').width;

export default function StockChart({ points }: Props) {
  console.log('STOCK CHART POINTS:', points);
  
  if (!points || points.length === 0) {
    return null;
  }

  const prices = points.map(p => p.close);
  const labels = points.map((_, index) =>
  index % 5 === 0 ? `${points.length - index}` : ''
);



  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const isUp = prices[prices.length - 1] >= prices[0];

  return (
    <View style={{ marginTop: 24 }}>
      <Text style={{ marginBottom: 8, fontWeight: '600' }}>
        Últimos {points.length} pregões
      </Text>

      <LineChart
        data={{
          labels,
          datasets: [{ data: prices }],
        }}
        width={screenWidth - 48}
        height={220}
        yAxisSuffix=""
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 2,
          color: (opacity = 1) =>
            isUp
              ? `rgba(34, 197, 94, ${opacity})` // verde
              : `rgba(239, 68, 68, ${opacity})`, // vermelho
          labelColor: () => '#666',
          propsForDots: {
            r: '0',
          },
        }}
        bezier
        fromZero={false}
        withDots={false}
        withInnerLines={false}
      />
    </View>
  );
}
