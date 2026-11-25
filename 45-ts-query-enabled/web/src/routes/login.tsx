import { createFileRoute, useNavigate } from '@tanstack/react-router';
import useAuth from '@/hooks/useAuth';

export const Route = createFileRoute('/login')({ component: Login });

function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const submit = async () => {
    const res = await fetch('/api/login', { method: 'POST' });
    const { access_token } = await res.json();
    // Stored before the app goes home: the home page's user query runs.
    localStorage.setItem('access_token', access_token);
    navigate({ to: '/' });
  };

  return (
    <div>
      <p>{String(user)}</p>
      <button onClick={submit}>Log in</button>
    </div>
  );
}
