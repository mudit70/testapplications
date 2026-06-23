import { BlobServiceClient } from '@azure/storage-blob';

const svc = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING ?? 'UseDevelopmentStorage=true',
);

export async function fetchAttachment(key: string) {
  return svc.getContainerClient('article-attachments').getBlobClient(key).download();
}

export async function uploadAttachment(key: string, data: string) {
  return svc
    .getContainerClient('article-attachments')
    .getBlockBlobClient(key)
    .upload(data, data.length);
}
