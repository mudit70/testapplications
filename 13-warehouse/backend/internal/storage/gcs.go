// Package storage stores item photos in Google Cloud Storage.
package storage

import (
	"context"

	"cloud.google.com/go/storage"
)

// Photos uploads and fetches item photos from GCS.
type Photos struct {
	client *storage.Client
}

// NewPhotos builds a GCS-backed photo store.
func NewPhotos(client *storage.Client) *Photos {
	return &Photos{client: client}
}

// Upload returns a writer for an item photo object.
func (p *Photos) Upload(ctx context.Context, name string) *storage.Writer {
	// PUT → gs://warehouse-photos/items/new.jpg
	return p.client.Bucket("warehouse-photos").Object("items/new.jpg").NewWriter(ctx)
}

// Download returns a reader for an item photo object.
func (p *Photos) Download(ctx context.Context) (*storage.Reader, error) {
	// GET → gs://warehouse-photos/items/logo.jpg
	return p.client.Bucket("warehouse-photos").Object("items/logo.jpg").NewReader(ctx)
}
