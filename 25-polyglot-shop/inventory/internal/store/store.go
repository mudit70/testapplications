package store

import (
	"errors"
	"fmt"

	"gorm.io/gorm"
)

var (
	ErrNotFound   = errors.New("not found")
	ErrOutOfStock = errors.New("out of stock")
)

type Line struct {
	ProductID uint `json:"product_id" binding:"required"`
	Quantity  int  `json:"quantity" binding:"required,gt=0"`
}

type Store struct {
	db *gorm.DB
}

func New(db *gorm.DB) *Store {
	return &Store{db: db}
}

func (s *Store) ListProducts() ([]Product, error) {
	var products []Product
	err := s.db.Order("name").Find(&products).Error
	return products, err
}

func (s *Store) GetProduct(id uint) (Product, error) {
	var p Product
	err := s.db.First(&p, id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return p, ErrNotFound
	}
	return p, err
}

func (s *Store) Restock(id uint, add int) (Product, error) {
	res := s.db.Model(&Product{}).Where("id = ?", id).Update("stock", gorm.Expr("stock + ?", add))
	if res.Error != nil {
		return Product{}, res.Error
	}
	if res.RowsAffected == 0 {
		return Product{}, ErrNotFound
	}
	return s.GetProduct(id)
}

// Reserve holds stock for every line, all or nothing, and returns the reservations in line
// order with the total price.
func (s *Store) Reserve(lines []Line) ([]Reservation, int64, error) {
	tx := s.db.Begin()
	defer tx.Rollback()

	var total int64
	reservations := make([]Reservation, 0, len(lines))
	for _, l := range lines {
		var p Product
		if err := tx.Set("gorm:query_option", "FOR UPDATE").First(&p, l.ProductID).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, 0, fmt.Errorf("product %d: %w", l.ProductID, ErrNotFound)
			}
			return nil, 0, err
		}
		if p.Stock < l.Quantity {
			return nil, 0, fmt.Errorf("%s: %w", p.SKU, ErrOutOfStock)
		}
		if err := tx.Model(&p).Update("stock", gorm.Expr("stock - ?", l.Quantity)).Error; err != nil {
			return nil, 0, err
		}
		r := Reservation{ProductID: p.ID, Quantity: l.Quantity, Status: StatusHeld}
		if err := tx.Create(&r).Error; err != nil {
			return nil, 0, err
		}
		reservations = append(reservations, r)
		total += p.PriceCents * int64(l.Quantity)
	}
	return reservations, total, tx.Commit().Error
}

// Release puts a held reservation's stock back.
func (s *Store) Release(id uint) error {
	tx := s.db.Begin()
	defer tx.Rollback()

	var r Reservation
	if err := tx.First(&r, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrNotFound
		}
		return err
	}
	if r.Status == StatusReleased {
		return nil
	}
	if err := tx.Model(&Product{}).Where("id = ?", r.ProductID).Update("stock", gorm.Expr("stock + ?", r.Quantity)).Error; err != nil {
		return err
	}
	if err := tx.Model(&r).Update("status", StatusReleased).Error; err != nil {
		return err
	}
	return tx.Commit().Error
}

// CommitReservations ties held reservations to the order that was placed with them.
func (s *Store) CommitReservations(orderID int64, ids []uint) error {
	return s.db.Model(&Reservation{}).
		Where("id IN ? AND status = ?", ids, StatusHeld).
		Updates(map[string]any{"status": StatusCommitted, "order_id": orderID}).Error
}
