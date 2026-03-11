import api from '../../../lib/api';

export default async function MissionsPage() {
  const { data } = await api.get('/admin/missions');
  return <main style={{ padding: 24 }}><h1>Missions</h1>{data.map((m) => <div key={m._id}>{m.title} - {m.reward}</div>)}</main>;
}
