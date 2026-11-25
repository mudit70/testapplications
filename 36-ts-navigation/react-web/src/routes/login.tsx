import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { LoginService } from '@/client';
import { isLoggedIn } from '@/hooks/useAuth';

export const Route = createFileRoute('/login')({
  component: Login,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({ to: '/' });
    }
  },
});

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  const submit = async () => {
    const token = await LoginService.loginAccessToken({ username, password: '' });
    localStorage.setItem('access_token', token.access_token);
    navigate({ to: '/' });
  };

  return (
    <div>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <button onClick={submit}>Log in</button>
    </div>
  );
}
