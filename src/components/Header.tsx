'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <nav style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Link href="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#1e293b' }}>
          Trang chủ
        </Link>
        <Link href="/books" style={{ textDecoration: 'none', color: '#2563eb' }}>
          Sách
        </Link>
      </nav>
    </header>
  );
}
