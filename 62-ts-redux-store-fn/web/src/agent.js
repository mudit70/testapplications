const API_ROOT = '/api';

const get = url => fetch(`${API_ROOT}${url}`).then(res => res.json());

const Articles = {
  all: page => get(`/articles?page=${page}`),
  feed: page => get(`/articles/feed?page=${page}`),
  byTag: (tag, page) => get(`/articles/tagged/${encodeURIComponent(tag)}?page=${page}`),
};

export default { Articles };
