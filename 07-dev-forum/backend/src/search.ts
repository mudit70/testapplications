import { Client } from '@elastic/elasticsearch';

const client = new Client({ node: 'http://localhost:9200' });

export async function indexThread(id: string, title: string, body: string) {
  return client.index({ index: 'threads', id, document: { title, body } });
}

export async function searchThreads(query: string) {
  return client.search({ index: 'threads', query: { match: { title: query } } });
}

export async function deleteThreadDoc(id: string) {
  return client.delete({ index: 'threads', id });
}
