import { createRouter, createWebHistory } from 'vue-router';
import Files from './Files.vue';

const routes = [{ path: '/files/:path*', name: 'Files', component: Files }];

export const router = createRouter({ history: createWebHistory('/'), routes });

// Runs before every navigation, wherever it goes.
router.beforeResolve(async () => {
  await fetch('/api/renew');
});
