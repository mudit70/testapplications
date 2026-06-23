package main

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

// StorageService uploads and fetches ride receipts from AWS S3.
type StorageService struct {
	s3Client *s3.Client
}

func NewStorageService(client *s3.Client) *StorageService {
	return &StorageService{s3Client: client}
}

func (s *StorageService) UploadReceipt(ctx context.Context, key string, body []byte) error {
	_, err := s.s3Client.PutObject(ctx, &s3.PutObjectInput{
		Bucket: aws.String("ride-receipts"),
		Key:    aws.String(key),
	})
	return err
}

func (s *StorageService) GetReceipt(ctx context.Context, key string) error {
	_, err := s.s3Client.GetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String("ride-receipts"),
		Key:    aws.String(key),
	})
	return err
}

func (s *StorageService) DeleteReceipt(ctx context.Context, key string) error {
	_, err := s.s3Client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String("ride-receipts"),
		Key:    aws.String(key),
	})
	return err
}
