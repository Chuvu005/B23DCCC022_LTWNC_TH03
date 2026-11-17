import type { MetadataRoute } from 'next';
import { loadBooksShift } from '@/lib/books';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const books = await loadBooksShift();
  const baseUrl = 'http://localhost:3000';

  const bookUrls: MetadataRoute.Sitemap = books.map((b) => ({
    url: `${baseUrl}/books/${b.id}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/books`,
      lastModified: new Date(),
    },
    ...bookUrls,
  ];
}
