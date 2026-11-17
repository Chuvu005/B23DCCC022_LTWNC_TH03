import { describe, it, expect } from 'vitest';
import { formatDate, TERM_LABEL, STATUS_LABEL } from './format';

describe('Kiểm tra hàm format và nhãn hiển thị', () => {
  it('formatDate định dạng đúng từ YYYY-MM-DD sang dd/mm/yyyy', () => {
    expect(formatDate('2026-12-02')).toBe('02/12/2026');
    expect(formatDate('2025-05-18')).toBe('18/05/2025');
  });

  it('TERM_LABEL hiển thị đúng thời hạn bằng tiếng Việt', () => {
    expect(TERM_LABEL[7]).toBe('7 ngày');
    expect(TERM_LABEL[14]).toBe('14 ngày');
    expect(TERM_LABEL[30]).toBe('30 ngày');
  });

  it('STATUS_LABEL hiển thị đúng trạng thái yêu cầu mượn bằng tiếng Việt', () => {
    expect(STATUS_LABEL['pending']).toBe('Chờ duyệt');
    expect(STATUS_LABEL['approved']).toBe('Đã duyệt');
    expect(STATUS_LABEL['rejected']).toBe('Từ chối');
  });
});
