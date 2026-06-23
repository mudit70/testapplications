package main

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// RideRepo wraps GORM database access for rides and drivers.
type RideRepo struct {
	db *gorm.DB
}

func NewRideRepo(dsn string) (*RideRepo, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	if err := db.AutoMigrate(&Ride{}, &Driver{}); err != nil {
		return nil, err
	}
	return &RideRepo{db: db}, nil
}

func (r *RideRepo) ListRides() ([]Ride, error) {
	var rides []Ride
	r.db.Order("created_at desc").Find(&rides)
	return rides, nil
}

func (r *RideRepo) GetRide(id uint) (Ride, error) {
	var ride Ride
	r.db.First(&ride, id)
	return ride, nil
}

func (r *RideRepo) CreateRide(ride *Ride) error {
	return r.db.Create(ride).Error
}

func (r *RideRepo) CompleteRide(id uint, receiptKey string) error {
	var ride Ride
	r.db.First(&ride, id)
	ride.Status = "completed"
	ride.ReceiptKey = receiptKey
	return r.db.Save(&ride).Error
}

func (r *RideRepo) CancelRide(id uint) error {
	return r.db.Delete(&Ride{}, id).Error
}

func (r *RideRepo) AvailableDrivers() ([]Driver, error) {
	var drivers []Driver
	r.db.Where("available = ?", true).Find(&drivers)
	return drivers, nil
}
