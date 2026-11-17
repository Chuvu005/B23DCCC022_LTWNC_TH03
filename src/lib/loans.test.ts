import { describe, it, expect } from 'vitest';
import { listLoans, submitLoan, cancelLoan, parseStatus } from './loans';

describe('Kiểm tra nghiệp vụ mượn sách (loans)', () => {
  it('listLoans: sv01 có 27 yêu cầu chia 3 trang (10/10/7)', () => {
    const page1 = listLoans({ email: 'sv01@ptit.edu.vn', role: 'student' }, '', 1);
    expect(page1.total).toBe(27);
    expect(page1.totalPages).toBe(3);
    expect(page1.items.length).toBe(10);
    expect(page1.items[0]).toHaveProperty('bookTitle');

    const page2 = listLoans({ email: 'sv01@ptit.edu.vn', role: 'student' }, '', 2);
    expect(page2.items.length).toBe(10);

    const page3 = listLoans({ email: 'sv01@ptit.edu.vn', role: 'student' }, '', 3);
    expect(page3.items.length).toBe(7);
  });

  it('listLoans: admin thấy tất cả 37 yêu cầu mượn', () => {
    const result = listLoans({ email: 'admin@ptit.edu.vn', role: 'admin' }, '', 1);
    expect(result.total).toBeGreaterThanOrEqual(37);
  });

  it('listLoans: trang vượt giới hạn bị kẹp lại trong khoảng hợp lệ', () => {
    const pageOver = listLoans({ email: 'sv01@ptit.edu.vn', role: 'student' }, '', 999);
    expect(pageOver.page).toBe(pageOver.totalPages);

    const pageUnder = listLoans({ email: 'sv01@ptit.edu.vn', role: 'student' }, '', -5);
    expect(pageUnder.page).toBe(1);
  });

  it('parseStatus: chỉ nhận pending, approved, rejected, còn lại trả về rỗng', () => {
    expect(parseStatus('pending')).toBe('pending');
    expect(parseStatus('approved')).toBe('approved');
    expect(parseStatus('rejected')).toBe('rejected');
    expect(parseStatus('other')).toBe('');
    expect(parseStatus(undefined)).toBe('');
  });

  it('submitLoan: trả về hết bản với sách id 6 ngày 2026-12-02', () => {
    const result = submitLoan('sv01@ptit.edu.vn', {
      bookId: 6,
      pickupDate: '2026-12-02',
      term: 14,
      quantity: 1,
      reason: 'Mượn sách chuyên đề an toàn mạng',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe('Sách đã hết bản vào ngày này');
    }
  });

  it('cancelLoan: tạo được rồi kiểm tra đúng 3 mã forbidden, ok, not-found', () => {
    // Tạo 1 loan mới thành công
    const submitResult = submitLoan('sv01@ptit.edu.vn', {
      bookId: 3,
      pickupDate: '2099-11-20',
      term: 7,
      quantity: 1,
      reason: 'Mượn sách phục vụ làm bài tập lớn',
    });

    expect(submitResult.ok).toBe(true);
    if (!submitResult.ok) return;

    const newId = submitResult.loan.id;

    // 1. sv02 cố hủy loan của sv01 -> 'forbidden'
    const forbiddenRes = cancelLoan('sv02@ptit.edu.vn', newId);
    expect(forbiddenRes).toBe('forbidden');

    // 2. sv01 tự hủy loan của mình -> 'ok'
    const okRes = cancelLoan('sv01@ptit.edu.vn', newId);
    expect(okRes).toBe('ok');

    // 3. Loan đã bị xóa, gọi lại -> 'not-found'
    const notFoundRes = cancelLoan('sv01@ptit.edu.vn', newId);
    expect(notFoundRes).toBe('not-found');
  });
});
