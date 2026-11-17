import type { Metadata } from 'next';
import Link from 'next/link';
import { loadBooksShift } from '@/lib/books';
import { CATEGORIES } from '@/data/books';

export const metadata: Metadata = {
  title: 'Danh mục sách',
};

interface BooksPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
  }>;
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const { category, q } = await searchParams;
  const books = await loadBooksShift({ category, q });

  const now = new Date();
  const renderTime = [
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join(':');

  return (
    <div>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Danh mục sách</h1>

      <form
        method="GET"
        action="/books"
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          background: '#f8fafc',
          padding: '16px',
          borderRadius: '8px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label htmlFor="q" style={{ fontWeight: 500 }}>
            Tìm sách
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q ?? ''}
            placeholder="Nhập tên sách..."
            style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label htmlFor="category" style={{ fontWeight: 500 }}>
            Chuyên mục
          </label>
          <select
            id="category"
            name="category"
            defaultValue={category ?? ''}
            style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
          >
            <option value="">Tất cả</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          style={{
            padding: '6px 16px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Lọc
        </button>
      </form>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#475569' }}>
        <div>
          {books.length > 0 ? (
            <p style={{ margin: 0, fontWeight: 'bold' }}>Tìm thấy {books.length} sách</p>
          ) : (
            <p style={{ margin: 0, fontWeight: 'bold' }}>Không tìm thấy sách nào</p>
          )}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '14px' }}>Render lúc: {renderTime}</p>
        </div>
      </div>

      {books.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', background: '#f8fafc' }}>
              <th style={{ padding: '12px 8px' }}>Tên sách</th>
              <th style={{ padding: '12px 8px' }}>Tác giả</th>
              <th style={{ padding: '12px 8px' }}>Số bản</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 8px' }}>
                  <Link href={`/books/${book.id}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
                    {book.title}
                  </Link>
                </td>
                <td style={{ padding: '12px 8px', color: '#475569' }}>{book.author}</td>
                <td style={{ padding: '12px 8px', color: '#475569' }}>Số bản: {book.copies}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
