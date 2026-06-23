// DeepFleet — Gin + GORM fleet-management server.
//
// This file wires every feature route. The dispatch-rung experiment:
//   F1..F6  backend held INLINE  (gin handler calls gorm directly)
//   F7      be-localfn           (handler → same-package func → gorm)
//   F8      be-modulefn          (handler → internal/repo func → gorm)
//   F9      be-structmethod      (handler → service struct method → gorm)
//
// Every route path matches a frontend caller's URL literal exactly.
package main

import (
	"net/http"
	"strconv"

	"deepfleet/internal/models"
	"deepfleet/internal/repo"
	"deepfleet/internal/service"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func main() {
	conn, err := gorm.Open(postgres.Open("postgres://localhost:5432/deepfleet"), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	db = conn
	_ = db.AutoMigrate(&models.Vehicle{}, &models.Driver{}, &models.Trip{})

	r := gin.Default()

	api := r.Group("/api")

	// ── Frontend dispatch matrix (backend inline) ─────────────────────
	api.GET("/f1", f1Inline)
	api.GET("/f2", f2Inline)
	api.GET("/f3", f3Inline)
	api.GET("/f4", f4Inline)
	api.GET("/f5", f5Inline)
	api.GET("/f6", f6Inline)

	// ── Backend dispatch matrix (frontend = modulefn) ─────────────────
	api.GET("/f7", f7LocalFn)
	api.GET("/f8", f8ModuleFn)
	api.GET("/f9", f9StructMethod)

	// ── Realistic CRUD extras ─────────────────────────────────────────
	vehicles := api.Group("/vehicles")
	vehicles.GET("", listVehicles)
	vehicles.POST("", createVehicle)
	vehicles.GET("/:id", getVehicle)
	vehicles.PUT("/:id", updateVehicle)
	vehicles.DELETE("/:id", deleteVehicle)

	drivers := api.Group("/drivers")
	drivers.GET("", listDrivers)
	drivers.POST("", createDriver)
	drivers.GET("/:id", getDriver)
	drivers.PUT("/:id", updateDriver)
	drivers.DELETE("/:id", deleteDriver)

	trips := api.Group("/trips")
	trips.GET("", listTrips)
	trips.POST("", createTrip)
	trips.GET("/:id", getTrip)
	trips.PUT("/:id", updateTrip)
	trips.DELETE("/:id", deleteTrip)
	trips.POST("/:id/complete", completeTrip)

	// Service-backed reporting extras
	svc := service.NewFleetService(db)
	rp := repo.NewVehicleRepo(db)
	api.GET("/stats/fleet", func(c *gin.Context) {
		c.JSON(http.StatusOK, svc.FleetStats())
	})
	api.GET("/stats/idle", func(c *gin.Context) {
		c.JSON(http.StatusOK, rp.IdleVehicles())
	})

	_ = r.Run(":8080")
}

// ── F1..F6 inline handlers (gin handler → gorm directly) ──────────────

func f1Inline(c *gin.Context) {
	var vehicles []models.Vehicle
	db.Find(&vehicles)
	c.JSON(http.StatusOK, vehicles)
}

func f2Inline(c *gin.Context) {
	var trips []models.Trip
	db.Where("status = ?", "planned").Find(&trips)
	c.JSON(http.StatusOK, trips)
}

func f3Inline(c *gin.Context) {
	var drivers []models.Driver
	db.Where("available = ?", true).Find(&drivers)
	c.JSON(http.StatusOK, drivers)
}

func f4Inline(c *gin.Context) {
	var vehicles []models.Vehicle
	db.Order("created_at desc").Find(&vehicles)
	c.JSON(http.StatusOK, vehicles)
}

func f5Inline(c *gin.Context) {
	var trips []models.Trip
	db.Order("distance desc").Limit(10).Find(&trips)
	c.JSON(http.StatusOK, trips)
}

func f6Inline(c *gin.Context) {
	var drivers []models.Driver
	db.Find(&drivers)
	c.JSON(http.StatusOK, drivers)
}

// ── F7 be-localfn (handler → same-package function → gorm) ────────────

func f7LocalFn(c *gin.Context) {
	vehicles := loadActiveVehicles()
	c.JSON(http.StatusOK, vehicles)
}

func loadActiveVehicles() []models.Vehicle {
	var vehicles []models.Vehicle
	db.Where("status = ?", "active").Find(&vehicles)
	return vehicles
}

// ── F8 be-modulefn (handler → internal/repo function → gorm) ──────────

func f8ModuleFn(c *gin.Context) {
	trips := repo.RecentTrips(db)
	c.JSON(http.StatusOK, trips)
}

// ── F9 be-structmethod (handler → service struct method → gorm) ───────

var fleetSvc = service.NewFleetService(nil)

func f9StructMethod(c *gin.Context) {
	s := service.NewFleetService(db)
	drivers := s.TopDrivers()
	c.JSON(http.StatusOK, drivers)
}

// ── Vehicle CRUD (inline) ─────────────────────────────────────────────

func listVehicles(c *gin.Context) {
	var vehicles []models.Vehicle
	db.Find(&vehicles)
	c.JSON(http.StatusOK, vehicles)
}

func createVehicle(c *gin.Context) {
	var v models.Vehicle
	if err := c.ShouldBindJSON(&v); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Create(&v)
	c.JSON(http.StatusCreated, v)
}

func getVehicle(c *gin.Context) {
	var v models.Vehicle
	db.First(&v, c.Param("id"))
	c.JSON(http.StatusOK, v)
}

func updateVehicle(c *gin.Context) {
	var v models.Vehicle
	db.First(&v, c.Param("id"))
	_ = c.ShouldBindJSON(&v)
	db.Save(&v)
	c.JSON(http.StatusOK, v)
}

func deleteVehicle(c *gin.Context) {
	db.Delete(&models.Vehicle{}, c.Param("id"))
	c.Status(http.StatusNoContent)
}

// ── Driver CRUD (inline) ──────────────────────────────────────────────

func listDrivers(c *gin.Context) {
	var drivers []models.Driver
	db.Find(&drivers)
	c.JSON(http.StatusOK, drivers)
}

func createDriver(c *gin.Context) {
	var d models.Driver
	if err := c.ShouldBindJSON(&d); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Create(&d)
	c.JSON(http.StatusCreated, d)
}

func getDriver(c *gin.Context) {
	var d models.Driver
	db.First(&d, c.Param("id"))
	c.JSON(http.StatusOK, d)
}

func updateDriver(c *gin.Context) {
	var d models.Driver
	db.First(&d, c.Param("id"))
	_ = c.ShouldBindJSON(&d)
	db.Save(&d)
	c.JSON(http.StatusOK, d)
}

func deleteDriver(c *gin.Context) {
	db.Delete(&models.Driver{}, c.Param("id"))
	c.Status(http.StatusNoContent)
}

// ── Trip CRUD (inline) ────────────────────────────────────────────────

func listTrips(c *gin.Context) {
	var trips []models.Trip
	db.Find(&trips)
	c.JSON(http.StatusOK, trips)
}

func createTrip(c *gin.Context) {
	var t models.Trip
	if err := c.ShouldBindJSON(&t); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Create(&t)
	c.JSON(http.StatusCreated, t)
}

func getTrip(c *gin.Context) {
	var t models.Trip
	db.First(&t, c.Param("id"))
	c.JSON(http.StatusOK, t)
}

func updateTrip(c *gin.Context) {
	var t models.Trip
	db.First(&t, c.Param("id"))
	_ = c.ShouldBindJSON(&t)
	db.Save(&t)
	c.JSON(http.StatusOK, t)
}

func deleteTrip(c *gin.Context) {
	db.Delete(&models.Trip{}, c.Param("id"))
	c.Status(http.StatusNoContent)
}

func completeTrip(c *gin.Context) {
	var t models.Trip
	id, _ := strconv.Atoi(c.Param("id"))
	db.First(&t, id)
	t.Status = "completed"
	db.Save(&t)
	c.JSON(http.StatusOK, t)
}
