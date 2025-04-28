// src/app/dashboard/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    }
  }, []);

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl">Welcome to the Dashboard 🎉</h1>
    </div>
  );
}
