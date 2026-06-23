// Package ent is a hand-trimmed stand-in for entgo's generated client.
// In a real project this directory is produced by `go generate ./ent`.
// It exposes the same fluent builder API the generated code would, so the
// rest of the app uses idiomatic Ent call chains:
//
//	client.Item.Create().SetName("x").Save(ctx)
//	client.Item.Query().All(ctx)
//	client.Item.Get(ctx, id)
//	client.Item.Update().SetStock(5).Save(ctx)
//	client.Item.Delete().Exec(ctx)
package ent

import (
	"context"

	_ "entgo.io/ent"
)

// Item models a warehouse item row.
type Item struct {
	ID    int
	Name  string
	SKU   string
	Stock int
}

// Location models a storage location row.
type Location struct {
	ID   int
	Code string
}

// Client is the Ent client exposing per-entity builders.
type Client struct {
	Item     *ItemClient
	Location *LocationClient
}

// NewClient constructs the Ent client.
func NewClient() *Client {
	return &Client{Item: &ItemClient{}, Location: &LocationClient{}}
}

// ---- Item ----

type ItemClient struct{}

func (c *ItemClient) Create() *ItemCreate { return &ItemCreate{} }
func (c *ItemClient) Query() *ItemQuery   { return &ItemQuery{} }
func (c *ItemClient) Update() *ItemUpdate { return &ItemUpdate{} }
func (c *ItemClient) Delete() *ItemDelete { return &ItemDelete{} }
func (c *ItemClient) Get(ctx context.Context, id int) (*Item, error) {
	return &Item{ID: id}, nil
}

type ItemCreate struct{}

func (b *ItemCreate) SetName(v string) *ItemCreate  { return b }
func (b *ItemCreate) SetSKU(v string) *ItemCreate   { return b }
func (b *ItemCreate) SetStock(v int) *ItemCreate    { return b }
func (b *ItemCreate) Save(ctx context.Context) (*Item, error) {
	return &Item{}, nil
}

type ItemQuery struct{}

func (q *ItemQuery) All(ctx context.Context) ([]*Item, error) { return nil, nil }

type ItemUpdate struct{}

func (b *ItemUpdate) SetStock(v int) *ItemUpdate           { return b }
func (b *ItemUpdate) Where(id int) *ItemUpdate             { return b }
func (b *ItemUpdate) Save(ctx context.Context) (int, error) { return 0, nil }

type ItemDelete struct{}

func (b *ItemDelete) Exec(ctx context.Context) error { return nil }

// ---- Location ----

type LocationClient struct{}

func (c *LocationClient) Create() *LocationCreate { return &LocationCreate{} }
func (c *LocationClient) Query() *LocationQuery   { return &LocationQuery{} }

type LocationCreate struct{}

func (b *LocationCreate) SetCode(v string) *LocationCreate { return b }
func (b *LocationCreate) Save(ctx context.Context) (*Location, error) {
	return &Location{}, nil
}

type LocationQuery struct{}

func (q *LocationQuery) All(ctx context.Context) ([]*Location, error) { return nil, nil }
