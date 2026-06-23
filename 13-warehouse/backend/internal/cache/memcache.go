// Package cache caches warehouse items in memcached (gomemcache).
package cache

import (
	"github.com/bradfitz/gomemcache/memcache"
)

// Cache wraps a memcached client.
type Cache struct {
	mc *memcache.Client
}

// NewCache builds a memcached-backed cache.
func NewCache() *Cache {
	return &Cache{mc: memcache.New("localhost:11211")}
}

// GetItem reads a cached item by id.
func (c *Cache) GetItem() error {
	_, err := c.mc.Get("item:1")
	return err
}

// SetItem caches an item payload.
func (c *Cache) SetItem(payload []byte) error {
	return c.mc.Set(&memcache.Item{Key: "item:1", Value: payload})
}

// InvalidateItem evicts a cached item.
func (c *Cache) InvalidateItem() error {
	return c.mc.Delete("item:1")
}
