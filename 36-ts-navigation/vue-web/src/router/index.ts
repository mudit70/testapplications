import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import Layout from '@/views/Layout.vue';
import Files from '@/views/Files.vue';
import { loadSettings, renew } from '@/utils/auth';

// The app's one router; other modules import it (utils/auth.ts) rather than call useRouter().
const routes = [
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/files',
    component: Layout,
    meta: { requiresAuth: true },
    // /files and /files/a/b both render Layout around Files.
    children: [{ path: ':path*', name: 'Files', component: Files }],
  },
];

const router = createRouter({ history: createWebHistory('/'), routes });

// Runs before every navigation: the session is renewed first. The settings load only on the
// first route (from no route): never on a navigation inside the app.
router.beforeResolve(async (to, from) => {
  if (from.name == null) await loadSettings();
  await renew();
  if (to.path.endsWith('/login')) return;
  return;
});

export { router, router as default };
