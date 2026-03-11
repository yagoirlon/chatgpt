import Link from 'next/link';

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>StepReward Admin</h1>
      <ul>
        <li><Link href='/dashboard'>Dashboard</Link></li>
        <li><Link href='/dashboard/users'>Users</Link></li>
        <li><Link href='/dashboard/missions'>Missions</Link></li>
        <li><Link href='/dashboard/tasks'>Tasks</Link></li>
        <li><Link href='/dashboard/withdrawals'>Withdrawals</Link></li>
      </ul>
    </main>
  );
}
