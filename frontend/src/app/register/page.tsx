// src/app/page.tsx

'use client';

import {useAuth} from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';

export default function RegisterPage() {
  const { register, error } = useAuth();

  return (
    <div>
      <AuthForm onSubmit={register} title="Register" />
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}
