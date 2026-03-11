import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, Linking, TextInput, Image, Share } from 'react-native';
import ProgressCard from '../components/ProgressCard';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { startStepSync } from '../services/stepTracker';

const brl = (coins) => `R$${(Number(coins || 0) * 0.01).toFixed(2)}`;

export function HomeScreen() {
  const { user, setUser } = useAuth();
  const [today, setToday] = useState({ stepCount: 0, coinsEarnedToday: 0, streak: 0 });
  const [config, setConfig] = useState({ maxDailyStepsCounted: 12000, stepToCoinSteps: 1000, maxDailyCoinsFromSteps: 12 });

  const refresh = async () => {
    const [{ data: p }, { data: t }, { data: c }] = await Promise.all([api.get('/user/profile'), api.get('/steps/today'), api.get('/rewards/config')]);
    setUser(p);
    setToday(t);
    setConfig(c);
  };

  useEffect(() => {
    let stop;
    startStepSync(async (liveSteps) => {
      setUser((u) => ({ ...(u || {}), stepsToday: liveSteps }));
      await refresh();
    }).then((cleanup) => (stop = cleanup));
    refresh();
    return () => stop?.();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: '#f4f7ff', gap: 8 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Daily Progress</Text>
      <ProgressCard steps={today.stepCount || 0} coins={today.coinsEarnedToday || 0} maxSteps={config.maxDailyStepsCounted} />
      <Text>Daily cap: {config.maxDailyStepsCounted} steps ({config.maxDailyCoinsFromSteps} coins max)</Text>
      <Text>Conversion: {config.stepToCoinSteps} steps = 1 coin</Text>
      <Text>Streak: {today.streak} days</Text>
      <Text>Total Steps: {user?.totalSteps || 0}</Text>
      <Text>Wallet: {user?.coins || 0} coins ({brl(user?.coins)})</Text>
    </ScrollView>
  );
}

export function MissionsScreen() {
  const [missions, setMissions] = useState([]);
  useEffect(() => { api.get('/missions').then((r) => setMissions(r.data)); }, []);
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
      {missions.map((m) => (
        <Pressable key={m._id} onPress={() => api.post('/missions/complete', { missionId: m._id, proof: 'app' })} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 12 }}>
          <Text style={{ fontWeight: '700' }}>{m.title}</Text>
          <Text>{m.stepsRequired ? `${m.stepsRequired} steps` : 'Action mission'}</Text>
          <Text>{m.rewardCoins} coins ({brl(m.rewardCoins)})</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [ads, setAds] = useState({ adViewsToday: 0 });
  useEffect(() => { api.get('/tasks').then((r) => setTasks(r.data)); }, []);
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
      <Pressable onPress={async () => setAds((await api.post('/rewards/ads/claim')).data)} style={{ backgroundColor: '#111827', padding: 12, borderRadius: 12 }}>
        <Text style={{ color: 'white', fontWeight: '700' }}>Watch Rewarded Ad (2 coins, max 3/day)</Text>
        <Text style={{ color: 'white' }}>Views today: {ads.adViewsToday}</Text>
      </Pressable>
      {tasks.map((t) => <Pressable key={t._id} onPress={() => { Linking.openURL(t.url); api.post('/tasks/complete', { taskId: t._id }); }} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 12 }}><Text>{t.title}</Text><Text>{t.description}</Text><Text>{t.reward} coins</Text></Pressable>)}
    </ScrollView>
  );
}

export function ReferralScreen() {
  const [data, setData] = useState({ referrals: [], code: '', link: '' });
  useEffect(() => { api.get('/referrals').then((r) => setData(r.data)); }, []);
  return <View style={{ padding: 16, gap: 8 }}><Text>Your code: {data.code}</Text><Text selectable>{data.link}</Text><Text>Invite reward: 50 coins after friend reaches 3000 steps</Text><Pressable onPress={() => Share.share({ message: data.link })} style={{ backgroundColor: '#4f46e5', padding: 10, borderRadius: 8 }}><Text style={{color:'#fff'}}>Invite Friends</Text></Pressable><Text>Invites: {data.referrals.length}</Text></View>;
}

export function WalletScreen() {
  const [wallet, setWallet] = useState({ balance: 0, valueBRL: 0, transactions: [], rewards: [] });
  const refresh = () => api.get('/wallet/balance').then((r) => setWallet(r.data));
  useEffect(refresh, []);
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>Coins: {wallet.balance}</Text>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Value: R${(wallet.valueBRL || 0).toFixed(2)}</Text>
      <Text style={{ fontWeight: '700' }}>Transactions</Text>
      {wallet.transactions?.map((t) => <Text key={t._id}>{t.type} ({t.flow}): {t.amount}</Text>)}
      <Text style={{ fontWeight: '700', marginTop: 8 }}>Rewards</Text>
      {wallet.rewards?.map((r) => <Text key={r._id}>{r.source}: +{r.coinsEarned}</Text>)}
    </ScrollView>
  );
}

export function WithdrawalScreen() {
  const [coins, setCoins] = useState('1000');
  const [pixKey, setPixKey] = useState('user@pix');
  const [msg, setMsg] = useState('');

  const request = async () => {
    const { data } = await api.post('/wallet/withdraw', { coins: Number(coins), pixKey });
    setMsg(`Requested: ${data.coins} coins => R$${Number(data.amountBRL).toFixed(2)} (${data.status})`);
  };

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Text style={{ fontWeight: '700', fontSize: 20 }}>Withdraw via PIX</Text>
      <TextInput value={coins} onChangeText={setCoins} placeholder='Coins (min 1000)' style={{ borderWidth: 1, borderRadius: 8, padding: 8 }} />
      <TextInput value={pixKey} onChangeText={setPixKey} placeholder='PIX Key' style={{ borderWidth: 1, borderRadius: 8, padding: 8 }} />
      <Pressable onPress={request} style={{ backgroundColor: '#4f46e5', padding: 10, borderRadius: 8 }}><Text style={{ color: '#fff' }}>Request Withdrawal</Text></Pressable>
      <Text>{msg}</Text>
    </View>
  );
}

export function LeaderboardScreen() {
  const [board, setBoard] = useState({ topSteps: [], topReferrals: [] });
  useEffect(() => { api.get('/leaderboard/weekly').then((r) => setBoard(r.data)); }, []);
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontWeight: '700', fontSize: 18 }}>Top Steps</Text>
      {board.topSteps.map((u, i) => <Text key={u.userId}>{i + 1}. {u.name} - {u.steps}</Text>)}
      <Text style={{ fontWeight: '700', fontSize: 18, marginTop: 12 }}>Top Referrals</Text>
      {board.topReferrals.map((u, i) => <Text key={u.userId}>{i + 1}. {u.name} - {u.referrals}</Text>)}
    </ScrollView>
  );
}

export function ProfileScreen() {
  const { user, logout, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const save = async () => {
    const { data } = await api.patch('/user/profile', { name, avatar });
    setUser(data);
  };

  return (
    <View style={{ padding: 16, gap: 8 }}>
      {avatar ? <Image source={{ uri: avatar }} style={{ width: 64, height: 64, borderRadius: 999 }} /> : null}
      <Text>{user?.email}</Text><Text>Total coins: {user?.coins || 0} ({brl(user?.coins)})</Text><Text>Total steps: {user?.totalSteps || 0}</Text><Text>Referral code: {user?.referralCode}</Text><Text>Streak: {user?.streakCount || 0} days</Text>
      <TextInput value={name} onChangeText={setName} placeholder='Name' style={{ borderWidth: 1, borderRadius: 8, padding: 8 }} />
      <TextInput value={avatar} onChangeText={setAvatar} placeholder='Avatar URL' style={{ borderWidth: 1, borderRadius: 8, padding: 8 }} />
      <Pressable onPress={save} style={{ backgroundColor: '#4f46e5', padding: 10, borderRadius: 8 }}><Text style={{ color: '#fff' }}>Save Profile</Text></Pressable>
      <Pressable onPress={logout}><Text>Logout</Text></Pressable>
    </View>
  );
}
