import Link from 'next/link';
import { loadBooksShift } from '@/lib/books';

export default async function HomePage() {
  const books = await loadBooksShift();
  const categoriesCount = new Set(books.map((b) => b.category)).size;

  return (
    <div style={{ textAlign: 'center', padding: '48px 16px' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '16px', color: '#1e293b' }}>
        Thư viện khoa CNTT PTIT
      </h1>
      <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '24px' }}>
        {books.length} đầu sách · {categoriesCount} chuyên mục
      </p>
      <div>
        <Link
          href="/books"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#2563eb',
            color: '#fff',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          Xem danh mục sách
        </Link>
      </div>
    </div>
  );
}
