// src/app/page.tsx

'use client';

import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  const { login, error } = useAuth();

  return (
    <div>
      <AuthForm onSubmit={login} title="Login" />
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}
