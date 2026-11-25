import { useQuery } from '@tanstack/react-query';

export const isLoggedIn = () => localStorage.getItem('access_token') !== null;

const readUserMe = async () => {
  const res = await fetch('/api/users/me');
  return res.json();
};

// The current user, fetched only while a token is stored.
export const useCurrentUser = () =>
  useQuery({ queryKey: ['currentUser'], queryFn: readUserMe, enabled: isLoggedIn() });
