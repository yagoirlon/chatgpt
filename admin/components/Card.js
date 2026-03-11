export default function Card({ title, value }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px #00000015' }}>
      <h3>{title}</h3>
      <p style={{ fontSize: 24, fontWeight: 700 }}>{value}</p>
    </div>
  );
}
