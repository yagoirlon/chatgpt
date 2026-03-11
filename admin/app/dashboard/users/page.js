import api from '../../../lib/api';

export default async function UsersPage() {
  const { data } = await api.get('/admin/users');
  return <main style={{ padding: 24 }}><h1>Users</h1>{data.map((u) => <div key={u._id} style={{ background:'#fff', marginBottom:8, padding:10, borderRadius:8 }}>{u.name} ({u.email}) - {u.coins} coins</div>)}</main>;
}
