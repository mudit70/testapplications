import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Sidebar } from '@/components/Sidebar';
import { isLoggedIn } from '@/hooks/useAuth';

// A pathless layout: every route under routes/_layout/ renders inside it.
export const Route = createFileRoute('/_layout')({
  component: Layout,
  beforeLoad: async () => {
    if (!isLoggedIn()) {
      throw redirect({ to: '/login' });
    }
  },
});

function Layout() {
  return (
    <main>
      <Sidebar />
      <Outlet />
    </main>
  );
}
