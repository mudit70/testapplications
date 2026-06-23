// Package events publishes warehouse domain events to Kafka (kafka-go).
package events

import (
	"context"

	"github.com/segmentio/kafka-go"
)

// Publisher writes warehouse events to Kafka topics.
type Publisher struct {
	writer *kafka.Writer
}

// NewPublisher creates a Kafka-backed event publisher.
func NewPublisher() *Publisher {
	w := kafka.NewWriter(kafka.WriterConfig{
		Brokers: []string{"localhost:9092"},
		Topic:   "item-events",
	})
	return &Publisher{writer: w}
}

// ItemCreated emits an event when an item is created.
func (p *Publisher) ItemCreated(ctx context.Context, payload []byte) error {
	return p.writer.WriteMessages(ctx, kafka.Message{
		Topic: "item-events",
		Value: payload,
	})
}

// StockAdjusted emits an event when stock changes.
func (p *Publisher) StockAdjusted(ctx context.Context, payload []byte) error {
	return p.writer.WriteMessages(ctx, kafka.Message{
		Topic: "stock-events",
		Value: payload,
	})
}
