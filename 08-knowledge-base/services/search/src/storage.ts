import { Storage } from '@google-cloud/storage';

const storage = new Storage();

export async function fetchSnapshot(key: string) {
  return storage.bucket('search-snapshots').file(key).download();
}

export async function saveSnapshot(key: string, data: string) {
  return storage.bucket('search-snapshots').file(key).save(Buffer.from(data));
}
