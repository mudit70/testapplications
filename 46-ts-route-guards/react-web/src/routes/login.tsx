import { createFileRoute, redirect } from '@tanstack/react-router';
import { isLoggedIn, useCurrentUser } from '@/auth';

// A signed-in user is sent home: the page renders only without a token, so its user query
// never runs.
export const Route = createFileRoute('/login')({
  component: Login,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({ to: '/' });
    }
  },
});

function Login() {
  const { data } = useCurrentUser();
  return <p>{String(data)}</p>;
}
