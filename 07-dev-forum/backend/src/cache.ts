import { Client } from 'memjs';

const client = Client.create();

export async function getThreadCache(id: string) {
  return client.get(`thread:${id}`);
}

export async function setThreadCache(id: string, value: string) {
  return client.set(`thread:${id}`, value, { expires: 60 });
}

export async function deleteThreadCache(id: string) {
  return client.delete(`thread:${id}`);
}

export async function incrThreadViews() {
  return client.increment('counter:thread-views', 1);
}
