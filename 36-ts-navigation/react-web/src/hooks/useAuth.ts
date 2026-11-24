import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { UsersService } from '@/client';

export const isLoggedIn = () => localStorage.getItem('access_token') !== null;

const useAuth = () => {
  const navigate = useNavigate();
  // Fetched by every component that calls the hook, as it mounts.
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: UsersService.readUserMe,
    enabled: isLoggedIn(),
  });

  const logout = () => {
    localStorage.removeItem('access_token');
    navigate({ to: '/login' });
  };

  return { user, logout };
};

export default useAuth;
