'use client';

import { useState } from 'react';

export default function CreateMissionPage() {
  const [title, setTitle] = useState('Walk 2000 steps');
  const [stepsRequired, setSteps] = useState('2000');
  const [rewardCoins, setReward] = useState('2');
  const [type, setType] = useState('steps');
  const [msg, setMsg] = useState('');

  const submit = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/missions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}` },
      body: JSON.stringify({ title, stepsRequired: Number(stepsRequired), rewardCoins: Number(rewardCoins), type, active: true })
    });
    setMsg(res.ok ? 'Mission created' : 'Failed');
  };

  return <main style={{ padding: 24 }}><h1>Create Mission</h1><input value={title} onChange={(e)=>setTitle(e.target.value)} /><input value={stepsRequired} onChange={(e)=>setSteps(e.target.value)} /><input value={rewardCoins} onChange={(e)=>setReward(e.target.value)} /><select value={type} onChange={(e)=>setType(e.target.value)}><option value='steps'>steps</option><option value='invite'>invite</option><option value='daily_open'>daily_open</option></select><button onClick={submit}>Create</button><p>{msg}</p></main>;
}
