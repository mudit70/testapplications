import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

const client = new S3Client({ region: 'us-east-1' });

export async function uploadCover(key: string, body: Buffer) {
  return client.send(
    new PutObjectCommand({ Bucket: 'board-covers', Key: key, Body: body }),
  );
}

export async function fetchCover(key: string) {
  return client.send(new GetObjectCommand({ Bucket: 'board-covers', Key: key }));
}

export async function deleteCover(key: string) {
  return client.send(
    new DeleteObjectCommand({ Bucket: 'board-covers', Key: key }),
  );
}
