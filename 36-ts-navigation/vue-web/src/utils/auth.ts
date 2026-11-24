import router from '@/router';

export async function login(username: string, password: string) {
  const res = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  localStorage.setItem('jwt', await res.text());
}

export async function renew() {
  const res = await fetch('/api/renew');
  localStorage.setItem('jwt', await res.text());
}

export async function loadSettings() {
  const res = await fetch('/api/settings');
  localStorage.setItem('settings', await res.text());
}

export function logout() {
  localStorage.setItem('jwt', '');
  router.push({ path: '/login' });
}
