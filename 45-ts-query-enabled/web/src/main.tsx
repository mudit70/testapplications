import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';

// A failed request: the token is dropped and the whole app reloads at /login.
const handleApiError = (error: Error) => {
  if (error.message === '401') {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  }
};

const queryClient = new QueryClient({
  mutationCache: new MutationCache({ onError: handleApiError }),
});

createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <div />
  </QueryClientProvider>,
);
