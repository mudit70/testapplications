// Evidence blob storage via Azure Blob Storage (azure-sdk-for-go azblob).
package main

import (
	"context"

	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
)

type EvidenceStore struct {
	client *azblob.Client
}

func NewEvidenceStore(client *azblob.Client) *EvidenceStore {
	return &EvidenceStore{client: client}
}

func (s *EvidenceStore) UploadEvidence(ctx context.Context, key string, body []byte) error {
	_, err := s.client.UploadBuffer(ctx, "evidence", "alerts/"+key+".bin", body, nil)
	return err
}

func (s *EvidenceStore) DownloadEvidence(ctx context.Context, key string) error {
	_, err := s.client.DownloadStream(ctx, "evidence", "alerts/"+key+".bin", nil)
	return err
}
