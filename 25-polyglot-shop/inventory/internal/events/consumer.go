package events

import (
	"context"
	"encoding/json"
	"errors"
	"log"

	"github.com/segmentio/kafka-go"

	"github.com/polyglot-shop/inventory/internal/store"
)

type orderPlaced struct {
	OrderID        int64  `json:"order_id"`
	ReservationIDs []uint `json:"reservation_ids"`
}

// ConsumeOrderPlaced commits the reservations of each order the orders service places.
func ConsumeOrderPlaced(ctx context.Context, brokers []string, st *store.Store) error {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers: brokers,
		GroupID: "inventory",
		Topic:   "order.placed",
	})
	defer r.Close()

	for {
		m, err := r.ReadMessage(ctx)
		if err != nil {
			if errors.Is(err, context.Canceled) {
				return nil
			}
			return err
		}
		var evt orderPlaced
		if err := json.Unmarshal(m.Value, &evt); err != nil {
			log.Printf("order.placed: skipping malformed message at offset %d: %v", m.Offset, err)
			continue
		}
		if err := st.CommitReservations(evt.OrderID, evt.ReservationIDs); err != nil {
			log.Printf("order.placed: order %d: %v", evt.OrderID, err)
		}
	}
}
