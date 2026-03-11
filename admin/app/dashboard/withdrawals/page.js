import api from '../../../lib/api';

export default async function WithdrawalsPage() {
  const { data } = await api.get('/admin/withdrawals');
  return <main style={{ padding: 24 }}><h1>Withdrawals</h1>{data.map((w) => <div key={w._id}>{w.user?.email} - {w.coins} - {w.status}</div>)}</main>;
}
