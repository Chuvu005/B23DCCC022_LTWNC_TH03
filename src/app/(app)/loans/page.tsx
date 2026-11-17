import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sách đã mượn',
  robots: { index: false },
};

export default function LoansPage() {
  return (
    <div>
      <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Sách đã mượn</h1>
    </div>
  );
}
