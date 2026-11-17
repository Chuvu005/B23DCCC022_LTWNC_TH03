import { db } from './db';
import { can } from './permissions';
import type { Loan, LoanStatus, Role } from '@/types';
import type { LoanData } from './loan-validate';

export interface Viewer {
  email?: string | null;
  role?: Role;
}

export interface ListLoansResult {
  items: (Loan & { bookTitle: string })[];
  total: number;
  page: number;
  totalPages: number;
}

export function parseStatus(v?: string | null): LoanStatus | '' {
  if (v === 'pending' || v === 'approved' || v === 'rejected') {
    return v;
  }
  return '';
}

export function listLoans(
  viewer: Viewer,
  status?: string | null,
  page: number = 1
): ListLoansResult {
  let list: Loan[] = [];

  if (can(viewer.role, 'loan:view-all')) {
    list = [...db.loans];
  } else if (can(viewer.role, 'loan:view-own')) {
    list = db.loans.filter((l) => l.userEmail === viewer.email);
  }

  const parsedStatus = parseStatus(status);
  if (parsedStatus) {
    list = list.filter((l) => l.status === parsedStatus);
  }

  const total = list.length;
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Kẹp page vào khoảng 1...totalPages
  const validPage = Math.max(1, Math.min(page, totalPages));

  const start = (validPage - 1) * pageSize;
  const sliced = list.slice(start, start + pageSize);

  const items = sliced.map((loan) => {
    const book = db.books.find((b) => b.id === loan.bookId);
    return {
      ...loan,
      bookTitle: book ? book.title : '',
    };
  });

  return {
    items,
    total,
    page: validPage,
    totalPages,
  };
}

export function submitLoan(
  email: string,
  data: LoanData
): { ok: false; message: string } | { ok: true; loan: Loan } {
  const book = db.books.find((b) => b.id === data.bookId);
  const maxCopies = book ? book.copies : 0;

  // Tính tổng số quyển của các yêu cầu chưa bị từ chối cùng sách, cùng ngày lấy
  const reservedQuantity = db.loans
    .filter(
      (l) =>
        l.bookId === data.bookId &&
        l.pickupDate === data.pickupDate &&
        l.status !== 'rejected'
    )
    .reduce((sum, l) => sum + l.quantity, 0);

  if (reservedQuantity + data.quantity > maxCopies) {
    return { ok: false, message: 'Sách đã hết bản vào ngày này' };
  }

  const newLoan: Loan = {
    id: db.nextLoanId++,
    bookId: data.bookId,
    userEmail: email,
    pickupDate: data.pickupDate,
    term: data.term,
    quantity: data.quantity,
    reason: data.reason,
    status: 'pending',
  };

  db.loans.unshift(newLoan);
  return { ok: true, loan: newLoan };
}

export function cancelLoan(
  email: string,
  id: number
): 'not-found' | 'forbidden' | 'not-pending' | 'ok' {
  const index = db.loans.findIndex((l) => l.id === id);
  if (index === -1) {
    return 'not-found';
  }

  const loan = db.loans[index];
  if (loan.userEmail !== email) {
    return 'forbidden';
  }

  if (loan.status !== 'pending') {
    return 'not-pending';
  }

  db.loans.splice(index, 1);
  return 'ok';
}
