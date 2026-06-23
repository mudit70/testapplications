// internal/service — service-struct layer (another package from main).
//
// Used by:
//   F9 be-structmethod: main.f9StructMethod → service.FleetService.TopDrivers → gorm
package service

import (
	"deepfleet/internal/models"

	"gorm.io/gorm"
)

// FleetService is a service struct whose methods call GORM via s.db.
type FleetService struct {
	db *gorm.DB
}

func NewFleetService(db *gorm.DB) *FleetService {
	return &FleetService{db: db}
}

// TopDrivers is a struct method that calls GORM (s.db is a gorm receiver).
func (s *FleetService) TopDrivers() []models.Driver {
	var drivers []models.Driver
	s.db.Where("available = ?", true).Order("name asc").Limit(5).Find(&drivers)
	return drivers
}

func (s *FleetService) FleetStats() map[string]int64 {
	var vehicles, trips int64
	s.db.Model(&models.Vehicle{}).Count(&vehicles)
	s.db.Model(&models.Trip{}).Count(&trips)
	return map[string]int64{"vehicles": vehicles, "trips": trips}
}

func (s *FleetService) ArchiveTrip(id uint) error {
	var t models.Trip
	s.db.First(&t, id)
	t.Status = "archived"
	return s.db.Save(&t).Error
}
