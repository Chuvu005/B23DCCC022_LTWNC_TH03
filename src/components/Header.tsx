'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header
      style={{
        padding: '16px 24px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      <nav style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Link href="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#1e293b' }}>
          Trang chủ
        </Link>
        <Link href="/books" style={{ textDecoration: 'none', color: '#2563eb' }}>
          Sách
        </Link>
        {session && (
          <Link href="/loans" style={{ textDecoration: 'none', color: '#2563eb' }}>
            Sách đã mượn
          </Link>
        )}
        {session?.user?.role === 'admin' && (
          <Link href="/admin" style={{ textDecoration: 'none', color: '#2563eb' }}>
            Quản trị
          </Link>
        )}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {status === 'loading' ? (
          <span style={{ fontSize: '14px', color: '#94a3b8' }}>Đang tải...</span>
        ) : session?.user ? (
          <>
            <span style={{ fontSize: '14px', color: '#334155' }}>
              Xin chào, {session.user.name} ({session.user.role})
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              style={{
                padding: '6px 12px',
                fontSize: '14px',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <Link
            href="/login"
            style={{
              padding: '6px 16px',
              fontSize: '14px',
              backgroundColor: '#2563eb',
              color: '#fff',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
}
