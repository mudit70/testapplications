// Package cache is a generic stale-while-revalidate cache, shaped like unkey's pkg/cache: every
// caller hands SWR the loader that fills a miss, and a tracing wrapper wraps that loader in a
// closure of its own before handing it to the cache it wraps.
package cache

import (
	"context"
	"log"
)

type Cache[K comparable, V any] interface {
	SWR(ctx context.Context, key K, load func(context.Context) (V, error)) (V, error)
}

type memory[K comparable, V any] struct {
	values map[K]V
}

func New[K comparable, V any]() Cache[K, V] {
	return &tracing[K, V]{next: &memory[K, V]{values: map[K]V{}}}
}

func (m *memory[K, V]) SWR(ctx context.Context, key K, load func(context.Context) (V, error)) (V, error) {
	if v, ok := m.values[key]; ok {
		return v, nil
	}
	v, err := load(ctx)
	if err == nil {
		m.values[key] = v
	}
	return v, err
}

type tracing[K comparable, V any] struct {
	next Cache[K, V]
}

func (t *tracing[K, V]) SWR(ctx context.Context, key K, load func(context.Context) (V, error)) (V, error) {
	return t.next.SWR(ctx, key, func(inner context.Context) (V, error) {
		log.Printf("cache miss: %v", key)
		return load(inner)
	})
}
