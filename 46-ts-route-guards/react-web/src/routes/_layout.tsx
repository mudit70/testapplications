import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router';
import { isLoggedIn } from '@/auth';

// Runs on every navigation into a route under it, the ones that keep the layout too.
export const Route = createFileRoute('/_layout')({
  component: Layout,
  beforeLoad: async () => {
    await fetch('/api/session');
    if (!isLoggedIn()) {
      throw redirect({ to: '/login' });
    }
  },
});

function Layout() {
  const close = () => {};
  return (
    <main>
      <nav>
        <Link to="/items" onClick={close}>
          Items
        </Link>
      </nav>
      <Outlet />
    </main>
  );
}
