'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [errorMessage, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <form
      action={formAction}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxWidth: '360px',
        margin: '0 auto',
        padding: '24px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        background: '#fff',
      }}
    >
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {errorMessage && (
        <div
          role="alert"
          style={{
            padding: '10px 12px',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            borderRadius: '4px',
            fontSize: '14px',
            border: '1px solid #fecaca',
          }}
        >
          {errorMessage}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="email" style={{ fontWeight: 500, fontSize: '14px' }}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="example@ptit.edu.vn"
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="password" style={{ fontWeight: 500, fontSize: '14px' }}>
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        style={{
          marginTop: '8px',
          padding: '10px',
          backgroundColor: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 500,
          cursor: isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.7 : 1,
        }}
      >
        {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  );
}
