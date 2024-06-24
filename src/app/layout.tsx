import type { Metadata } from 'next';
import './root.css';

export const metadata: Metadata = {
  title: 'CAMVAS 1.0 | Gemsounds',
  description: 'CAMVAS 1.0 | Gemsounds'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh' }}>{children}</body>
    </html>
  );
}
