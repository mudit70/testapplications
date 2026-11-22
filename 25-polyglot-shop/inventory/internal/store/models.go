package store

import "time"

type Product struct {
	ID         uint   `gorm:"primaryKey" json:"id"`
	SKU        string `gorm:"uniqueIndex" json:"sku"`
	Name       string `json:"name"`
	PriceCents int64  `json:"price_cents"`
	Stock      int    `json:"stock"`
}

// A Reservation holds stock for one order line: held when orders asks, committed when the
// order is placed, released when it is cancelled.
type Reservation struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	ProductID uint      `json:"product_id"`
	Quantity  int       `json:"quantity"`
	OrderID   *int64    `json:"order_id"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
}

const (
	StatusHeld      = "held"
	StatusCommitted = "committed"
	StatusReleased  = "released"
)
