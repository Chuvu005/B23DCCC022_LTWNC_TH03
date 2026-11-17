import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { db } from '@/lib/db';
import { formatDate, TERM_LABEL, STATUS_LABEL } from '@/lib/format';
import { listLoans } from '@/lib/loans';
import LoanForm from '@/components/LoanForm';
import { createLoanAction, cancelLoanAction } from './actions';

export const metadata: Metadata = {
  title: 'Sách đã mượn',
  robots: { index: false },
};

interface LoansPageProps {
  searchParams: Promise<{
    status?: string;
    page?: string;
    book?: string;
  }>;
}

export default async function LoansPage({ searchParams }: LoansPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login?callbackUrl=/loans');
  }

  const { status, page, book } = await searchParams;
  const role = session.user.role;
  const email = session.user.email;

  const isStudent = can(role, 'loan:create');
  const defaultBookId = book ? Number(book) : undefined;

  const parsedPage = page ? parseInt(page, 10) : 1;
  const currentPage = isNaN(parsedPage) ? 1 : parsedPage;

  const { items, totalPages, page: validPage } = listLoans(
    { email, role },
    status,
    currentPage
  );

  const prevUrl = `/loans?status=${encodeURIComponent(status || '')}&page=${validPage - 1}`;
  const nextUrl = `/loans?status=${encodeURIComponent(status || '')}&page=${validPage + 1}`;

  return (
    <div>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Sách đã mượn</h1>

      {/* Form gửi yêu cầu chỉ hiện với student */}
      {isStudent && (
        <LoanForm
          books={db.books}
          defaultBookId={defaultBookId}
          action={createLoanAction}
        />
      )}

      {/* Form lọc trạng thái gửi bằng GET */}
      <form
        method="GET"
        action="/loans"
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          marginBottom: '20px',
          background: '#f8fafc',
          padding: '12px 16px',
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
        }}
      >
        <label htmlFor="status" style={{ fontWeight: 500, fontSize: '14px' }}>
          Trạng thái
        </label>
        <select
          id="status"
          name="status"
          defaultValue={status ?? ''}
          style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
        >
          <option value="">Tất cả</option>
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Từ chối</option>
        </select>
        <button
          type="submit"
          style={{
            padding: '6px 16px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Lọc
        </button>
      </form>

      {/* Bảng danh sách mượn */}
      {items.length === 0 ? (
        <p style={{ color: '#64748b' }}>Chưa có yêu cầu mượn nào.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '20px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', background: '#f8fafc' }}>
              <th style={{ padding: '12px 8px' }}>Tên sách</th>
              <th style={{ padding: '12px 8px' }}>Ngày lấy</th>
              <th style={{ padding: '12px 8px' }}>Thời hạn</th>
              <th style={{ padding: '12px 8px' }}>Số quyển</th>
              <th style={{ padding: '12px 8px' }}>Trạng thái</th>
              <th style={{ padding: '12px 8px' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((loan) => (
              <tr key={loan.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 8px', fontWeight: 500 }}>{loan.bookTitle}</td>
                <td style={{ padding: '12px 8px' }}>{formatDate(loan.pickupDate)}</td>
                <td style={{ padding: '12px 8px' }}>{TERM_LABEL[loan.term]}</td>
                <td style={{ padding: '12px 8px' }}>{loan.quantity} quyển</td>
                <td style={{ padding: '12px 8px' }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: 500,
                      backgroundColor:
                        loan.status === 'approved'
                          ? '#dcfce7'
                          : loan.status === 'rejected'
                          ? '#fee2e2'
                          : '#fef3c7',
                      color:
                        loan.status === 'approved'
                          ? '#166534'
                          : loan.status === 'rejected'
                          ? '#991b1b'
                          : '#92400e',
                    }}
                  >
                    {STATUS_LABEL[loan.status]}
                  </span>
                </td>
                <td style={{ padding: '12px 8px' }}>
                  {loan.status === 'pending' && loan.userEmail === email && (
                    <form action={cancelLoanAction.bind(null, loan.id)}>
                      <button
                        type="submit"
                        style={{
                          padding: '4px 10px',
                          backgroundColor: '#ef4444',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                        }}
                      >
                        Hủy
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Phân trang */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 0',
          borderTop: '1px solid #e2e8f0',
        }}
      >
        <div>
          {validPage > 1 ? (
            <Link
              href={prevUrl}
              style={{
                padding: '6px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                textDecoration: 'none',
                color: '#2563eb',
              }}
            >
              Trước
            </Link>
          ) : (
            <span
              style={{
                padding: '6px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                color: '#94a3b8',
              }}
            >
              Trước
            </span>
          )}
        </div>

        <span style={{ fontSize: '14px', color: '#475569', fontWeight: 500 }}>
          Trang {validPage}/{totalPages}
        </span>

        <div>
          {validPage < totalPages ? (
            <Link
              href={nextUrl}
              style={{
                padding: '6px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                textDecoration: 'none',
                color: '#2563eb',
              }}
            >
              Sau
            </Link>
          ) : (
            <span
              style={{
                padding: '6px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                color: '#94a3b8',
              }}
            >
              Sau
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
