'use client';

import { useEffect, useState } from 'react';

export default function WithdrawalsPage() {
  const [items, setItems] = useState([]);
  const base = process.env.NEXT_PUBLIC_API_URL;
  const auth = { Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}` };

  const load = async () => {
    const res = await fetch(`${base}/admin/withdrawals`, { headers: auth });
    setItems(await res.json());
  };

  const act = async (id, action) => {
    await fetch(`${base}/admin/withdrawals/${id}/${action}`, { method: 'PATCH', headers: auth });
    await load();
  };

  useEffect(() => { load(); }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Withdrawals</h1>
      {items.map((w) => (
        <div key={w._id} style={{ border: '1px solid #ddd', marginBottom: 8, padding: 10 }}>
          {w.userId?.email} - {w.coins} coins - R${w.amountBRL} - {w.status}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={() => act(w._id, 'approve')}>Approve</button>
            <button onClick={() => act(w._id, 'reject')}>Reject</button>
            <button onClick={() => act(w._id, 'paid')}>Mark Paid</button>
          </div>
        </div>
      ))}
    </main>
  );
}
