import { View, Text } from 'react-native';

export default function ProgressCard({ steps, coins, maxSteps = 15000 }) {
  const pct = Math.min(100, Math.round((steps / maxSteps) * 100));
  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12 }}>
      <Text style={{ fontWeight: '700', fontSize: 16 }}>Today's Progress</Text>
      <Text style={{ marginTop: 8 }}>Steps: {steps} / {maxSteps}</Text>
      <View style={{ height: 10, backgroundColor: '#e5e7eb', borderRadius: 50, marginTop: 8 }}>
        <View style={{ width: `${pct}%`, height: 10, backgroundColor: '#4f46e5', borderRadius: 50 }} />
      </View>
      <Text style={{ marginTop: 8 }}>Coins earned today: {coins}</Text>
    </View>
  );
}
