import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { loadBooksShift, loadBookById } from '@/lib/books';

export const revalidate = 60;

interface BookDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const books = await loadBooksShift();
  return books.slice(0, 12).map((book) => ({
    id: String(book.id),
  }));
}

export async function generateMetadata({ params }: BookDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const book = await loadBookById(Number(id));
  if (!book) {
    return {
      title: 'Không tìm thấy sách',
    };
  }
  return {
    title: `${book.title} – ${book.author}`,
    description: `Sách ${book.category}, thư viện có ${book.copies} bản.`,
  };
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;
  const book = await loadBookById(Number(id));

  if (!book) {
    notFound();
  }

  const now = new Date();
  const updateTime = [
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join(':');

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 0' }}>
      <div style={{ marginBottom: '16px' }}>
        <Link href="/books" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px' }}>
          ← Quay lại danh mục
        </Link>
      </div>

      <h1 style={{ fontSize: '28px', color: '#1e293b', marginBottom: '16px' }}>{book.title}</h1>

      <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <p style={{ margin: '8px 0', fontSize: '16px' }}>
          <strong>Tác giả:</strong> {book.author}
        </p>
        <p style={{ margin: '8px 0', fontSize: '16px' }}>
          <strong>Chuyên mục:</strong> {book.category}
        </p>
        <p style={{ margin: '8px 0', fontSize: '16px' }}>
          <strong>Số bản:</strong> {book.copies}
        </p>
        <p style={{ margin: '8px 0', fontSize: '14px', color: '#64748b' }}>
          Cập nhật lúc: {updateTime}
        </p>
      </div>

      <div>
        <Link
          href={`/loans?book=${book.id}`}
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#2563eb',
            color: '#fff',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          Mượn sách này
        </Link>
      </div>
    </div>
  );
}
