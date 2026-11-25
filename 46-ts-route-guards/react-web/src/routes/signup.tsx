import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/signup')({ component: SignUp });

function SignUp() {
  const navigate = useNavigate();
  // Signs up, then on to the login page; the token is not touched.
  const submit = async () => {
    await fetch('/api/signup', { method: 'POST' });
    navigate({ to: '/login' });
  };
  return <button onClick={submit}>Sign up</button>;
}
