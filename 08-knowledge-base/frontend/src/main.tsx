import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage, ArticlePage, SpacesPage, SearchPage } from './pages.js';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/articles/:id', element: <ArticlePage /> },
  { path: '/spaces', element: <SpacesPage /> },
  { path: '/search', element: <SearchPage /> },
]);

const el = document.getElementById('root');
if (el) {
  createRoot(el).render(<RouterProvider router={router} />);
}
