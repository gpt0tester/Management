'use client';

import { useState } from 'react';

interface AuthFormProps {
  onSubmit: (email: string, password: string) => void;
  title: string;
}

const AuthForm = ({ onSubmit, title }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center">{title}</h1>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <button type="submit" className="bg-blue-500 text-white py-2 rounded">
        {title}
      </button>
    </form>
  );
};

export default AuthForm;
