export const metadata = { title: 'StepReward Admin' };

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body style={{ margin: 0, fontFamily: 'Inter, sans-serif', background: '#f6f8ff' }}>{children}</body>
    </html>
  );
}
