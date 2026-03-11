import api from '../../../lib/api';

export default async function SuspiciousPage() {
  const { data } = await api.get('/admin/users/suspicious');
  return <main style={{ padding: 24 }}><h1>Suspicious Accounts</h1>{data.map((u) => <div key={u._id}>{u.name} - {u.email} - {u.lastKnownIp}</div>)}</main>;
}
