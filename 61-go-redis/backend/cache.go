package main

import (
	"context"
	"strconv"
	"sync"
	"time"

	"github.com/redis/go-redis/v9"
)

const uploadTTL = time.Hour

// uploadCache keeps the length of each upload in progress, as filebrowser's does: in memory for
// one replica, in redis for several.
type uploadCache interface {
	Register(filePath string, size int64)
	Length(filePath string) (int64, bool)
	Complete(filePath string)
}

type memoryCache struct {
	mu      sync.Mutex
	lengths map[string]int64
}

func (c *memoryCache) Register(filePath string, size int64) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.lengths[filePath] = size
}

func (c *memoryCache) Length(filePath string) (int64, bool) {
	c.mu.Lock()
	defer c.mu.Unlock()
	n, ok := c.lengths[filePath]
	return n, ok
}

func (c *memoryCache) Complete(filePath string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	delete(c.lengths, filePath)
}

type redisCache struct {
	client *redis.Client
}

func (c *redisCache) key(filePath string) string {
	return "uploads:length:" + filePath
}

func (c *redisCache) Register(filePath string, size int64) {
	c.client.Set(context.Background(), c.key(filePath), size, uploadTTL)
}

func (c *redisCache) Length(filePath string) (int64, bool) {
	v, err := c.client.Get(context.Background(), c.key(filePath)).Result()
	if err != nil {
		return 0, false
	}
	c.touch(filePath)
	n, err := strconv.ParseInt(v, 10, 64)
	return n, err == nil
}

func (c *redisCache) touch(filePath string) {
	c.client.Expire(context.Background(), c.key(filePath), uploadTTL)
}

func (c *redisCache) Complete(filePath string) {
	c.client.Del(context.Background(), c.key(filePath))
}
