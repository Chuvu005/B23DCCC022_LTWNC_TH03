import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div style={{ textAlign: 'center', padding: '48px 16px' }}>
      <h1 style={{ fontSize: '24px', color: '#dc2626', marginBottom: '16px' }}>
        Bạn không có quyền truy cập trang này
      </h1>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>
        Vui lòng quay lại trang chủ hoặc đăng nhập với tài khoản có quyền phù hợp.
      </p>
      <Link
        href="/"
        style={{
          color: '#2563eb',
          textDecoration: 'underline',
          fontWeight: 500,
        }}
      >
        Về trang chủ
      </Link>
    </div>
  );
}
