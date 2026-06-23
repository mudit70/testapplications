// Package repo holds the Ent-backed persistence layer for warehouse items.
package repo

import (
	"context"

	"warehouse/ent"
)

// ItemRepo wraps the Ent client for item persistence.
type ItemRepo struct {
	client *ent.Client
}

// NewItemRepo builds an ItemRepo.
func NewItemRepo(client *ent.Client) *ItemRepo {
	return &ItemRepo{client: client}
}

// List returns all items.
func (r *ItemRepo) List(ctx context.Context) ([]*ent.Item, error) {
	return r.client.Item.Query().All(ctx)
}

// Get returns a single item by id.
func (r *ItemRepo) Get(ctx context.Context, id int) (*ent.Item, error) {
	return r.client.Item.Get(ctx, id)
}

// Create inserts a new item.
func (r *ItemRepo) Create(ctx context.Context, name, sku string, stock int) (*ent.Item, error) {
	return r.client.Item.
		Create().
		SetName(name).
		SetSKU(sku).
		SetStock(stock).
		Save(ctx)
}

// AdjustStock updates an item's stock level.
func (r *ItemRepo) AdjustStock(ctx context.Context, id, stock int) (int, error) {
	return r.client.Item.
		Update().
		Where(id).
		SetStock(stock).
		Save(ctx)
}

// Remove deletes items.
func (r *ItemRepo) Remove(ctx context.Context) error {
	return r.client.Item.Delete().Exec(ctx)
}

// ListLocations returns all locations.
func (r *ItemRepo) ListLocations(ctx context.Context) ([]*ent.Location, error) {
	return r.client.Location.Query().All(ctx)
}
