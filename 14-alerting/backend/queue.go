// RabbitMQ event publishing/consuming via rabbitmq/amqp091-go.
package main

import (
	"context"
	"encoding/json"

	amqp "github.com/rabbitmq/amqp091-go"
)

type EventPublisher struct {
	ch *amqp.Channel
}

func NewEventPublisher(ch *amqp.Channel) *EventPublisher {
	return &EventPublisher{ch: ch}
}

func (p *EventPublisher) PublishAlertCreated(ctx context.Context, a Alert) error {
	body, _ := json.Marshal(a)
	return p.ch.PublishWithContext(ctx,
		"alerts", "alert.created", false, false,
		amqp.Publishing{ContentType: "application/json", Body: body},
	)
}

func (p *EventPublisher) PublishAlertAcked(ctx context.Context, id string) error {
	return p.ch.Publish("alerts", "alert.acked", false, false,
		amqp.Publishing{Body: []byte(id)},
	)
}

// Worker side: consume alert events for downstream notification.
func ConsumeAlertEvents(ch *amqp.Channel) error {
	deliveries, err := ch.Consume("alert.created", "notifier", false, false, false, false, nil)
	if err != nil {
		return err
	}
	for d := range deliveries {
		_ = d.Ack(false)
	}
	return nil
}
