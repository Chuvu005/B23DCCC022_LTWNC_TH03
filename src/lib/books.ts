import { db } from './db';
import type { Book } from '@/types';

export interface BookFilter {
  category?: string;
  q?: string;
}

export async function loadBooksShift(filter: BookFilter = {}): Promise<Book[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  let results = [...db.books];

  if (filter.category && filter.category !== 'all' && filter.category !== 'Tất cả') {
    results = results.filter((b) => b.category === filter.category);
  }

  if (filter.q && filter.q.trim()) {
    const keyword = filter.q.trim().toLowerCase();
    results = results.filter((b) => b.title.toLowerCase().includes(keyword));
  }

  return results;
}

export async function loadBookById(id: number): Promise<Book | null> {
  const book = db.books.find((b) => b.id === id);
  return book ?? null;
}
