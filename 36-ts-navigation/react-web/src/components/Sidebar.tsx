import { Link as RouterLink } from '@tanstack/react-router';
import useAuth from '@/hooks/useAuth';

const items = [
  { title: 'Dashboard', path: '/' },
  { title: 'Items', path: '/items' },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const close = () => {};

  // Leaving for another workspace reloads the whole document.
  const switchWorkspace = () => {
    window.location.href = '/';
  };

  return (
    <nav>
      <p>{String(user)}</p>
      {items.map((item) => (
        <RouterLink key={item.path} to={item.path} onClick={close}>
          {item.title}
        </RouterLink>
      ))}
      <RouterLink to="/items" onClick={close}>
        All items
      </RouterLink>
      <button onClick={switchWorkspace}>Switch workspace</button>
      <button onClick={() => logout()}>Log out</button>
    </nav>
  );
}
