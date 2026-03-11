import api from '../../lib/api';
import Card from '../../components/Card';

export default async function Dashboard() {
  const { data } = await api.get('/admin/stats');
  return (
    <main style={{ padding: 24 }}>
      <h1>Overview</h1>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <Card title='Users' value={data.users} />
        <Card title='Pending Withdrawals' value={data.pendingWithdrawals} />
        <Card title='Revenue USD' value={data.revenueUSD.toFixed(2)} />
      </div>
    </main>
  );
}
