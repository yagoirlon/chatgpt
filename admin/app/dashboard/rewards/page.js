'use client';

import { useState } from 'react';

export default function RewardsPage() {
  const [userId, setUserId] = useState('');
  const [coins, setCoins] = useState('10');
  const [reason, setReason] = useState('manual reward adjustment');
  const [status, setStatus] = useState('');

  const submit = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/rewards/adjust`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`
      },
      body: JSON.stringify({ userId, coins: Number(coins), reason })
    });
    setStatus(res.ok ? 'Adjusted successfully' : 'Failed to adjust');
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Adjust Rewards</h1>
      <input placeholder='User ID' value={userId} onChange={(e) => setUserId(e.target.value)} />
      <input placeholder='Coins' value={coins} onChange={(e) => setCoins(e.target.value)} />
      <input placeholder='Reason' value={reason} onChange={(e) => setReason(e.target.value)} />
      <button onClick={submit}>Apply</button>
      <p>{status}</p>
    </main>
  );
}
