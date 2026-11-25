import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { reportError } from './api';
import { App } from './App';

// Runs after every mutation that fails, besides the mutation's own onError.
const handleApiError = (error: Error) => {
  reportError(error.message);
};

const queryClient = new QueryClient({
  mutationCache: new MutationCache({ onError: handleApiError }),
});

createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
