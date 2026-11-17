import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoanForm from './LoanForm';
import type { Book } from '@/types';

const mockBooks: Book[] = [
  {
    id: 1,
    title: 'Lập trình C căn bản',
    author: 'Nguyễn Văn Hùng',
    category: 'Lập trình',
    copies: 1,
  },
  {
    id: 6,
    title: 'An toàn mạng',
    author: 'Bùi Ngọc Anh',
    category: 'Mạng máy tính',
    copies: 1,
  },
];

describe('Kiểm thử component LoanForm', () => {
  it('(1) action trả errors thì thông báo lỗi hiện ra dưới đúng ô với role="alert"', async () => {
    const user = userEvent.setup();
    const mockAction = vi.fn().mockResolvedValue({
      errors: {
        bookId: 'Hãy chọn sách',
        reason: 'Lý do tối thiểu 10 ký tự',
      },
      values: {},
      ok: false,
    });

    render(<LoanForm books={mockBooks} action={mockAction} />);

    const submitBtn = screen.getByRole('button', { name: /Gửi yêu cầu/i });
    await user.click(submitBtn);

    const bookError = await screen.findByText('Hãy chọn sách');
    expect(bookError).toBeInTheDocument();
    expect(bookError).toHaveAttribute('role', 'alert');

    const reasonError = await screen.findByText('Lý do tối thiểu 10 ký tự');
    expect(reasonError).toBeInTheDocument();
    expect(reasonError).toHaveAttribute('role', 'alert');
  });

  it('(2) điền hợp lệ bằng userEvent thì action được gọi 1 lần và FormData có đúng bookId, term, quantity', async () => {
    const user = userEvent.setup();
    const mockAction = vi.fn().mockResolvedValue({
      errors: {},
      values: {},
      ok: true,
      message: 'Đã gửi yêu cầu, chờ duyệt',
    });

    render(<LoanForm books={mockBooks} action={mockAction} />);

    await user.selectOptions(screen.getByLabelText('Sách'), '1');
    await user.type(screen.getByLabelText('Ngày lấy sách'), '2099-12-31');
    await user.selectOptions(screen.getByLabelText('Thời hạn mượn'), '7');
    await user.clear(screen.getByLabelText('Số quyển'));
    await user.type(screen.getByLabelText('Số quyển'), '1');
    await user.type(screen.getByLabelText('Lý do mượn'), 'Mượn để phục vụ nghiên cứu học tập');

    const submitBtn = screen.getByRole('button', { name: /Gửi yêu cầu/i });
    await user.click(submitBtn);

    expect(mockAction).toHaveBeenCalledTimes(1);

    const formData = mockAction.mock.calls[0][1] as FormData;
    expect(formData.get('bookId')).toBe('1');
    expect(formData.get('term')).toBe('7');
    expect(formData.get('quantity')).toBe('1');
  });

  it('(3) action trả message “Sách đã hết bản vào ngày này” cùng values thì thông báo hiện ra và lý do đã nhập vẫn còn', async () => {
    const user = userEvent.setup();
    const mockAction = vi.fn().mockResolvedValue({
      errors: {},
      values: {
        bookId: '6',
        pickupDate: '2026-12-02',
        term: '14',
        quantity: '1',
        reason: 'Lý do mượn sách chuyên đề mạng',
      },
      message: 'Sách đã hết bản vào ngày này',
      ok: false,
    });

    render(<LoanForm books={mockBooks} action={mockAction} />);

    const submitBtn = screen.getByRole('button', { name: /Gửi yêu cầu/i });
    await user.click(submitBtn);

    const messageAlert = await screen.findByText('Sách đã hết bản vào ngày này');
    expect(messageAlert).toBeInTheDocument();

    const reasonInput = screen.getByLabelText('Lý do mượn');
    expect(reasonInput).toHaveValue('Lý do mượn sách chuyên đề mạng');
  });

  it('(4) có defaultBookId thì ô Sách được chọn sẵn sách tương ứng', () => {
    const mockAction = vi.fn();
    render(<LoanForm books={mockBooks} defaultBookId={6} action={mockAction} />);

    const bookSelect = screen.getByLabelText('Sách');
    expect(bookSelect).toHaveValue('6');
  });
});
