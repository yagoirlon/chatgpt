import api from '../../../lib/api';

export default async function TasksPage() {
  const { data } = await api.get('/admin/tasks');
  return <main style={{ padding: 24 }}><h1>Tasks</h1>{data.map((t) => <div key={t._id}>{t.title} - {t.type} - {t.reward}</div>)}</main>;
}
