package main

import "time"

// Ride is the core GORM model for a ride-share trip.
type Ride struct {
	ID         uint   `gorm:"primaryKey"`
	RiderID    uint   `gorm:"index"`
	DriverID   uint   `gorm:"index"`
	Origin     string
	Dest       string
	Status     string // requested | active | completed
	ReceiptKey string
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

// Driver is a GORM model for available drivers.
type Driver struct {
	ID        uint `gorm:"primaryKey"`
	Name      string
	Lat       float64
	Lng       float64
	Available bool
}
