import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, Linking } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import ProgressCard from '../components/ProgressCard';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { startStepSync } from '../services/stepTracker';

export function HomeScreen() {
  const { user, setUser } = useAuth();
  useEffect(() => {
    let stop;
    startStepSync(async () => {
      const { data } = await api.get('/user/profile');
      setUser(data);
    }).then((cleanup) => (stop = cleanup));
    return () => stop?.();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <ProgressCard steps={user?.stepsToday || 0} coins={user?.coins || 0} />
      <LineChart
        data={{ labels: ['M', 'T', 'W', 'T', 'F'], datasets: [{ data: [2000, 5300, 7000, 12000, user?.stepsToday || 1000] }] }}
        width={320}
        height={180}
        chartConfig={{ color: () => '#4f46e5' }}
      />
    </ScrollView>
  );
}

export function MissionsScreen() {
  const [missions, setMissions] = useState([]);
  useEffect(() => { api.get('/missions').then((r) => setMissions(r.data)); }, []);
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
      {missions.map((m) => (
        <Pressable key={m._id} onPress={() => api.post('/missions/complete', { missionId: m._id })} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 12 }}>
          <Text>{m.title}</Text><Text>{m.targetSteps} steps • {m.reward} coins</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => { api.get('/tasks').then((r) => setTasks(r.data)); }, []);
  return <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>{tasks.map((t) => <Pressable key={t._id} onPress={() => { Linking.openURL(t.url); api.post('/tasks/complete', { taskId: t._id }); }} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 12 }}><Text>{t.title}</Text><Text>{t.reward} coins</Text></Pressable>)}</ScrollView>;
}

export function ReferralScreen() {
  const [data, setData] = useState({ referrals: [], code: '' });
  useEffect(() => { api.get('/referral').then((r) => setData(r.data)); }, []);
  return <View style={{ padding: 16 }}><Text>Your code: {data.code}</Text><Text>Invites: {data.referrals.length}</Text></View>;
}

export function WalletScreen() {
  const [wallet, setWallet] = useState({ balance: 0, history: [] });
  useEffect(() => { api.get('/wallet/balance').then((r) => setWallet(r.data)); }, []);
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>{wallet.balance} coins</Text>
      <Pressable onPress={() => api.post('/wallet/withdraw', { method: 'PIX', destination: 'user@pix', coins: 100 })} style={{ backgroundColor: '#4f46e5', padding: 12, borderRadius: 10, marginVertical: 12 }}><Text style={{ color: '#fff' }}>Withdraw 100</Text></Pressable>
      {wallet.history.map((h, i) => <Text key={i}>{h.type}: {h.amount}</Text>)}
    </ScrollView>
  );
}

export function ProfileScreen() {
  const { user, logout } = useAuth();
  return <View style={{ padding: 16 }}><Text>{user?.name}</Text><Text>{user?.email}</Text><Pressable onPress={logout}><Text>Logout</Text></Pressable></View>;
}
