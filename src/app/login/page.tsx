import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Đăng nhập',
};

interface LoginPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  if (session) {
    redirect('/');
  }

  const { callbackUrl } = await searchParams;

  return (
    <div style={{ padding: '40px 0' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '24px' }}>
        Đăng nhập
      </h1>
      <LoginForm callbackUrl={callbackUrl || '/loans'} />
    </div>
  );
}
