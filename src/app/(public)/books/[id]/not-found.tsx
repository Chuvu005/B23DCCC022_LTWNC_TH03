import Link from 'next/link';

export default function BookNotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '48px 16px' }}>
      <h2 style={{ fontSize: '24px', color: '#dc2626', marginBottom: '16px' }}>
        Không tìm thấy sách
      </h2>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>
        Sách bạn tìm kiếm không tồn tại hoặc đã bị xóa.
      </p>
      <Link
        href="/books"
        style={{
          color: '#2563eb',
          textDecoration: 'underline',
          fontWeight: 500,
        }}
      >
        Quay lại danh mục sách
      </Link>
    </div>
  );
}
