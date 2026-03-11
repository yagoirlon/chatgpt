'use client';

import { useState } from 'react';

export default function RewardRulesPage() {
  const [payload, setPayload] = useState({ stepToCoinSteps: 1000, maxDailyStepsCounted: 12000, maxDailyCoinsFromSteps: 12, referralRewardOnTarget: 50, referralTargetSteps: 3000, maxAdsPerDay: 3, adRewardPerView: 2 });
  const [msg, setMsg] = useState('');

  const update = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rewards/config`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}` },
      body: JSON.stringify(payload)
    });
    setMsg(res.ok ? 'Updated' : 'Failed');
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Reward Rules</h1>
      {Object.keys(payload).map((k) => <div key={k}><label>{k}</label><input value={payload[k]} onChange={(e)=>setPayload({ ...payload, [k]: Number(e.target.value) })} /></div>)}
      <button onClick={update}>Save rules</button>
      <p>{msg}</p>
    </main>
  );
}
