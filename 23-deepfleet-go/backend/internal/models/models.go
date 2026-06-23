// GORM models for the DeepFleet fleet-management app.
//
// Each struct with gorm tags maps to a DatabaseTable:
//   Vehicle → vehicles, Trip → trips, Driver → drivers
package models

import "gorm.io/gorm"

type Vehicle struct {
	gorm.Model
	Plate    string `gorm:"uniqueIndex;not null" json:"plate"`
	Model    string `gorm:"not null" json:"model"`
	Status   string `gorm:"default:idle" json:"status"`
	DriverID uint   `json:"driver_id"`
}

type Driver struct {
	gorm.Model
	Name      string    `gorm:"not null" json:"name"`
	License   string    `gorm:"uniqueIndex" json:"license"`
	Available bool      `gorm:"default:true" json:"available"`
	Vehicles  []Vehicle `gorm:"foreignKey:DriverID" json:"vehicles"`
}

type Trip struct {
	gorm.Model
	VehicleID uint    `json:"vehicle_id"`
	DriverID  uint    `json:"driver_id"`
	Origin    string  `gorm:"not null" json:"origin"`
	Dest      string  `gorm:"not null" json:"dest"`
	Distance  float64 `json:"distance"`
	Status    string  `gorm:"default:planned" json:"status"`
}
