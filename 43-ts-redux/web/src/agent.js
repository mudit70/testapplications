const API_ROOT = '/api';

const requests = {
  get: (url) => fetch(`${API_ROOT}${url}`).then((r) => r.json()),
  post: (url, body) =>
    fetch(`${API_ROOT}${url}`, { method: 'POST', body: JSON.stringify(body) }).then((r) => r.json()),
  put: (url, body) =>
    fetch(`${API_ROOT}${url}`, { method: 'PUT', body: JSON.stringify(body) }).then((r) => r.json()),
};

const Auth = {
  register: (username) => requests.post('/users', { user: { username } }),
  save: (user) => requests.put('/user', { user }),
};

const Articles = {
  all: () => requests.get('/articles'),
  favorite: (slug) => requests.post(`/articles/${slug}/favorite`),
};

export default { Auth, Articles };
