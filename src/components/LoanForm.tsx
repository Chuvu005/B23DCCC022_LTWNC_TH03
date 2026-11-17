'use client';

import { useActionState } from 'react';
import type { Book } from '@/types';
import { TERMS } from '@/data/books';
import { TERM_LABEL } from '@/lib/format';
import type { LoanFormState } from '@/lib/loan-validate';

interface LoanFormProps {
  books: Book[];
  defaultBookId?: number;
  action: (prev: LoanFormState, formData: FormData) => Promise<LoanFormState>;
}

export default function LoanForm({ books, defaultBookId, action }: LoanFormProps) {
  const initialState: LoanFormState = {
    errors: {},
    values: {
      bookId: defaultBookId ? String(defaultBookId) : '',
      quantity: '1',
    },
  };

  const [state, formAction, isPending] = useActionState(action, initialState);

  // Key để React re-render lại form inputs với defaultValue khi state.values thay đổi
  const formKey = JSON.stringify(state.values) + '-' + (state.message ?? '') + '-' + (state.ok ? '1' : '0');

  return (
    <form
      key={formKey}
      action={formAction}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        background: '#f8fafc',
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '32px',
        border: '1px solid #e2e8f0',
      }}
    >
      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1e293b' }}>
        Đăng ký mượn sách
      </h3>

      {/* Sách */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label htmlFor="bookId" style={{ fontWeight: 500, fontSize: '14px' }}>
          Sách
        </label>
        <select
          id="bookId"
          name="bookId"
          defaultValue={state.values?.bookId ?? (defaultBookId ? String(defaultBookId) : '')}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
        >
          <option value="">-- Chọn sách --</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title} ({b.copies} bản)
            </option>
          ))}
        </select>
        {state.errors?.bookId && (
          <span role="alert" style={{ color: '#dc2626', fontSize: '13px' }}>
            {state.errors.bookId}
          </span>
        )}
      </div>

      {/* Ngày lấy sách */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label htmlFor="pickupDate" style={{ fontWeight: 500, fontSize: '14px' }}>
          Ngày lấy sách
        </label>
        <input
          id="pickupDate"
          name="pickupDate"
          type="date"
          defaultValue={state.values?.pickupDate ?? ''}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
        />
        {state.errors?.pickupDate && (
          <span role="alert" style={{ color: '#dc2626', fontSize: '13px' }}>
            {state.errors.pickupDate}
          </span>
        )}
      </div>

      {/* Thời hạn mượn */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label htmlFor="term" style={{ fontWeight: 500, fontSize: '14px' }}>
          Thời hạn mượn
        </label>
        <select
          id="term"
          name="term"
          defaultValue={state.values?.term ?? ''}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
        >
          <option value="">-- Chọn thời hạn --</option>
          {TERMS.map((t) => (
            <option key={t} value={t}>
              {TERM_LABEL[t]}
            </option>
          ))}
        </select>
        {state.errors?.term && (
          <span role="alert" style={{ color: '#dc2626', fontSize: '13px' }}>
            {state.errors.term}
          </span>
        )}
      </div>

      {/* Số quyển */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label htmlFor="quantity" style={{ fontWeight: 500, fontSize: '14px' }}>
          Số quyển
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          defaultValue={state.values?.quantity ?? '1'}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
        />
        {state.errors?.quantity && (
          <span role="alert" style={{ color: '#dc2626', fontSize: '13px' }}>
            {state.errors.quantity}
          </span>
        )}
      </div>

      {/* Lý do mượn */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label htmlFor="reason" style={{ fontWeight: 500, fontSize: '14px' }}>
          Lý do mượn
        </label>
        <textarea
          id="reason"
          name="reason"
          rows={3}
          defaultValue={state.values?.reason ?? ''}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
        />
        {state.errors?.reason && (
          <span role="alert" style={{ color: '#dc2626', fontSize: '13px' }}>
            {state.errors.reason}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        style={{
          padding: '10px 20px',
          backgroundColor: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 500,
          cursor: isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.7 : 1,
          alignSelf: 'flex-start',
        }}
      >
        {isPending ? 'Đang gửi...' : 'Gửi yêu cầu'}
      </button>

      {/* state.message hiện ở cuối form */}
      {state.message && (
        <div
          role={state.ok ? undefined : 'alert'}
          style={{
            padding: '10px 14px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 500,
            backgroundColor: state.ok ? '#f0fdf4' : '#fef2f2',
            color: state.ok ? '#166534' : '#dc2626',
            border: `1px solid ${state.ok ? '#bbf7d0' : '#fecaca'}`,
          }}
        >
          {state.message}
        </div>
      )}
    </form>
  );
}
