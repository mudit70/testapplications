package main

import (
	"context"
	"net/http"
	"strconv"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/hibiken/asynq"
	"github.com/labstack/echo/v4"
)

// App wires together the repo, cache, queue and storage services.
type App struct {
	repo    *RideRepo
	cache   *CacheService
	queue   *asynq.Client
	storage *StorageService
}

func (a *App) listRides(c echo.Context) error {
	rides, err := a.repo.ListRides()
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, map[string]any{"rides": rides})
}

func (a *App) getRide(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	ctx := c.Request().Context()
	a.cache.GetRide(ctx, uint(id))
	ride, err := a.repo.GetRide(uint(id))
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, ride)
}

func (a *App) requestRide(c echo.Context) error {
	ctx := c.Request().Context()
	var ride Ride
	if err := c.Bind(&ride); err != nil {
		return err
	}
	ride.Status = "requested"
	if err := a.repo.CreateRide(&ride); err != nil {
		return err
	}
	a.cache.SetRide(ctx, ride.ID, ride.Origin)
	_ = enqueueMatch(a.queue, []byte(strconv.Itoa(int(ride.ID))))
	return c.JSON(http.StatusCreated, ride)
}

func (a *App) completeRide(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	ctx := c.Request().Context()
	receiptKey := "receipts/" + c.Param("id") + ".pdf"
	if err := a.storage.UploadReceipt(ctx, receiptKey, []byte("receipt")); err != nil {
		return err
	}
	if err := a.repo.CompleteRide(uint(id), receiptKey); err != nil {
		return err
	}
	a.cache.InvalidateRide(ctx, uint(id))
	_ = enqueueReceipt(ctx, a.queue, []byte(strconv.Itoa(id)))
	return c.NoContent(http.StatusNoContent)
}

func (a *App) listDrivers(c echo.Context) error {
	drivers, err := a.repo.AvailableDrivers()
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, map[string]any{"drivers": drivers})
}

func main() {
	repo, err := NewRideRepo("postgres://localhost:5432/rideshare")
	if err != nil {
		panic(err)
	}
	app := &App{
		repo:    repo,
		cache:   NewCacheService("localhost:6379"),
		queue:   asynq.NewClient(asynq.RedisClientOpt{Addr: "localhost:6379"}),
		storage: NewStorageService(&s3.Client{}),
	}

	e := echo.New()
	e.GET("/api/rides", app.listRides)
	e.POST("/api/rides", app.requestRide)
	e.GET("/api/rides/:id", app.getRide)
	e.POST("/api/rides/:id/complete", app.completeRide)
	e.GET("/api/drivers", app.listDrivers)
	e.GET("/ws/drivers", driverLocationWS)

	// Start the asynq worker mux alongside the HTTP server.
	_ = newTaskMux()
	_ = context.Background()

	_ = e.Start(":8080")
}
