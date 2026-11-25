import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

export const isLoggedIn = () => localStorage.getItem('access_token') !== null;

const readUserMe = async () => {
  const res = await fetch('/api/users/me');
  return res.json();
};

const useAuth = () => {
  const navigate = useNavigate();
  // Fetched only while a token is stored: never on the login page a 401 sends the user to.
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: readUserMe,
    enabled: isLoggedIn(),
  });

  const logout = () => {
    localStorage.removeItem('access_token');
    navigate({ to: '/login' });
  };

  return { user, logout };
};

export default useAuth;
