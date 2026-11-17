import { describe, it, expect } from 'vitest';
import {
  validateLoan,
  toLoanData,
  toLoanInput,
  type LoanInput,
} from './loan-validate';
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
    id: 2,
    title: 'Lập trình hướng đối tượng',
    author: 'Trần Minh Đức',
    category: 'Lập trình',
    copies: 3,
  },
];

describe('Kiểm tra hàm validateLoan và toLoanData', () => {
  it('dữ liệu hợp lệ trả về object lỗi rỗng', () => {
    const validInput: LoanInput = {
      bookId: '1',
      pickupDate: '2099-12-31',
      term: '14',
      quantity: '1',
      reason: 'Mượn để ôn thi học kỳ môn lập trình C',
    };

    const errors = validateLoan(validInput, mockBooks);
    expect(Object.keys(errors).length).toBe(0);
  });

  it('form trống báo đủ lỗi cho cả 5 trường', () => {
    const emptyInput: LoanInput = {
      bookId: '',
      pickupDate: '',
      term: '',
      quantity: '',
      reason: '',
    };

    const errors = validateLoan(emptyInput, mockBooks);
    expect(errors.bookId).toBe('Hãy chọn sách');
    expect(errors.pickupDate).toBe('Hãy chọn ngày');
    expect(errors.term).toBe('Hãy chọn thời hạn');
    expect(errors.quantity).toBe('Số quyển phải từ 1 trở lên');
    expect(errors.reason).toBe('Lý do tối thiểu 10 ký tự');
  });

  it('báo lỗi khi ngày lấy sách ở quá khứ', () => {
    const input: LoanInput = {
      bookId: '1',
      pickupDate: '2020-01-01',
      term: '7',
      quantity: '1',
      reason: 'Mượn sách phục vụ nghiên cứu khoa học',
    };

    const errors = validateLoan(input, mockBooks);
    expect(errors.pickupDate).toBe('Ngày lấy sách không được ở quá khứ');
  });

  it('báo lỗi khi lý do dưới 10 ký tự hoặc toàn khoảng trắng', () => {
    const shortReason: LoanInput = {
      bookId: '1',
      pickupDate: '2099-12-31',
      term: '7',
      quantity: '1',
      reason: 'Ngắn',
    };
    expect(validateLoan(shortReason, mockBooks).reason).toBe('Lý do tối thiểu 10 ký tự');

    const spacesReason: LoanInput = {
      bookId: '1',
      pickupDate: '2099-12-31',
      term: '7',
      quantity: '1',
      reason: '                ',
    };
    expect(validateLoan(spacesReason, mockBooks).reason).toBe('Lý do tối thiểu 10 ký tự');
  });

  it('báo lỗi khi số quyển vượt quá số bản của sách đã chọn', () => {
    const input: LoanInput = {
      bookId: '1', // Sách id 1 chỉ có 1 bản
      pickupDate: '2099-12-31',
      term: '7',
      quantity: '2',
      reason: 'Mượn cho hai người cùng học nhóm môn này',
    };

    const errors = validateLoan(input, mockBooks);
    expect(errors.quantity).toBe('Vượt số bản của sách (1 bản)');
  });

  it('báo lỗi khi số quyển không phải số nguyên dương', () => {
    const zeroQty: LoanInput = {
      bookId: '1',
      pickupDate: '2099-12-31',
      term: '7',
      quantity: '0',
      reason: 'Mượn sách để ôn thi tốt nghiệp môn cơ sở',
    };
    expect(validateLoan(zeroQty, mockBooks).quantity).toBe('Số quyển phải từ 1 trở lên');

    const floatQty: LoanInput = {
      bookId: '1',
      pickupDate: '2099-12-31',
      term: '7',
      quantity: '1.5',
      reason: 'Mượn sách để ôn thi tốt nghiệp môn cơ sở',
    };
    expect(validateLoan(floatQty, mockBooks).quantity).toBe('Số quyển phải từ 1 trở lên');
  });

  it('báo lỗi khi thời hạn không hợp lệ ví dụ 10 ngày', () => {
    const input: LoanInput = {
      bookId: '1',
      pickupDate: '2099-12-31',
      term: '10',
      quantity: '1',
      reason: 'Mượn sách để ôn thi tốt nghiệp môn cơ sở',
    };

    const errors = validateLoan(input, mockBooks);
    expect(errors.term).toBe('Hãy chọn thời hạn');
  });

  it('toLoanData ép kiểu số và trim lý do từ chuỗi hợp lệ', () => {
    const input: LoanInput = {
      bookId: '2',
      pickupDate: '2099-12-31',
      term: '30',
      quantity: '2',
      reason: '   Mượn sách phục vụ làm đồ án tốt nghiệp   ',
    };

    const data = toLoanData(input);
    expect(data.bookId).toBe(2);
    expect(data.term).toBe(30);
    expect(data.quantity).toBe(2);
    expect(data.reason).toBe('Mượn sách phục vụ làm đồ án tốt nghiệp');
    expect(data.pickupDate).toBe('2099-12-31');
  });

  it('toLoanInput chuyển đổi đối tượng hoặc FormData thành LoanInput', () => {
    const converted = toLoanInput({
      bookId: 1,
      pickupDate: '2099-01-01',
    });
    expect(converted.bookId).toBe('1');
    expect(converted.pickupDate).toBe('2099-01-01');
    expect(converted.term).toBe('');
    expect(converted.quantity).toBe('');
    expect(converted.reason).toBe('');
  });
});
