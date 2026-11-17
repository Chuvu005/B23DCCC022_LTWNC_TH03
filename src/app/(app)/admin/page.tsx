import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { db } from '@/lib/db';
import { formatDate, TERM_LABEL } from '@/lib/format';
import { reviewLoan } from './actions';

export const metadata: Metadata = {
  title: 'Duyệt yêu cầu mượn',
  robots: { index: false },
};

export default async function AdminPage() {
  const session = await auth();
  const role = session?.user?.role;

  if (!can(role, 'loan:review')) {
    redirect('/forbidden');
  }

  const pendingCount = db.loans.filter((l) => l.status === 'pending').length;
  const approvedCount = db.loans.filter((l) => l.status === 'approved').length;
  const rejectedCount = db.loans.filter((l) => l.status === 'rejected').length;

  const pendingLoans = db.loans.filter((l) => l.status === 'pending');

  return (
    <div>
      <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Duyệt yêu cầu mượn</h1>

      <p style={{ fontSize: '16px', fontWeight: 500, color: '#334155', marginBottom: '20px' }}>
        Chờ duyệt: {pendingCount} | Đã duyệt: {approvedCount} | Từ chối: {rejectedCount}
      </p>

      {pendingLoans.length === 0 ? (
        <p style={{ color: '#64748b' }}>Không có yêu cầu nào đang chờ duyệt.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', background: '#f8fafc' }}>
              <th style={{ padding: '12px 8px' }}>Tên sách</th>
              <th style={{ padding: '12px 8px' }}>Ngày lấy</th>
              <th style={{ padding: '12px 8px' }}>Thời hạn</th>
              <th style={{ padding: '12px 8px' }}>Email người mượn</th>
              <th style={{ padding: '12px 8px' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pendingLoans.map((loan) => {
              const book = db.books.find((b) => b.id === loan.bookId);
              return (
                <tr key={loan.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 500 }}>
                    {book ? book.title : `Sách #${loan.bookId}`}
                  </td>
                  <td style={{ padding: '12px 8px' }}>{formatDate(loan.pickupDate)}</td>
                  <td style={{ padding: '12px 8px' }}>{TERM_LABEL[loan.term]}</td>
                  <td style={{ padding: '12px 8px', color: '#475569' }}>{loan.userEmail}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <form action={reviewLoan.bind(null, loan.id, 'approved')}>
                        <button
                          type="submit"
                          style={{
                            padding: '4px 10px',
                            backgroundColor: '#16a34a',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '13px',
                          }}
                        >
                          Duyệt
                        </button>
                      </form>
                      <form action={reviewLoan.bind(null, loan.id, 'rejected')}>
                        <button
                          type="submit"
                          style={{
                            padding: '4px 10px',
                            backgroundColor: '#dc2626',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '13px',
                          }}
                        >
                          Từ chối
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
