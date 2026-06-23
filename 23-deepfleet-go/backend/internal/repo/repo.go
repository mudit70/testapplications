// internal/repo — GORM data-access layer (another package from main).
//
// Used by:
//   F8 be-modulefn: main.f8ModuleFn → repo.RecentTrips → gorm
//   plus VehicleRepo struct methods for reporting extras.
package repo

import (
	"deepfleet/internal/models"

	"gorm.io/gorm"
)

// RecentTrips is a free function in another package that calls GORM.
func RecentTrips(db *gorm.DB) []models.Trip {
	var trips []models.Trip
	db.Order("created_at desc").Limit(20).Find(&trips)
	return trips
}

// VehicleRepo wraps GORM access for vehicles.
type VehicleRepo struct {
	db *gorm.DB
}

func NewVehicleRepo(db *gorm.DB) *VehicleRepo {
	return &VehicleRepo{db: db}
}

func (r *VehicleRepo) IdleVehicles() []models.Vehicle {
	var vehicles []models.Vehicle
	r.db.Where("status = ?", "idle").Find(&vehicles)
	return vehicles
}

func (r *VehicleRepo) All() []models.Vehicle {
	var vehicles []models.Vehicle
	r.db.Find(&vehicles)
	return vehicles
}

func (r *VehicleRepo) Save(v *models.Vehicle) error {
	return r.db.Save(v).Error
}
