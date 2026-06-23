package main

import (
	"context"
	"fmt"

	"github.com/redis/go-redis/v9"
)

// CacheService caches ride lookups in Redis via go-redis.
type CacheService struct {
	rdb *redis.Client
}

func NewCacheService(addr string) *CacheService {
	return &CacheService{rdb: redis.NewClient(&redis.Options{Addr: addr})}
}

func (s *CacheService) GetRide(ctx context.Context, id uint) {
	s.rdb.Get(ctx, fmt.Sprintf("ride:%d", id))
}

func (s *CacheService) SetRide(ctx context.Context, id uint, payload string) {
	s.rdb.Set(ctx, fmt.Sprintf("ride:%d", id), payload, 0)
}

func (s *CacheService) InvalidateRide(ctx context.Context, id uint) {
	s.rdb.Del(ctx, fmt.Sprintf("ride:%d", id))
}

func (s *CacheService) TrackActiveDriver(ctx context.Context, driverID uint) {
	s.rdb.SAdd(ctx, "drivers:active", driverID)
}
