package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"strings"
	"syscall"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/polyglot-shop/inventory/internal/api"
	"github.com/polyglot-shop/inventory/internal/events"
	"github.com/polyglot-shop/inventory/internal/store"
)

func main() {
	db, err := gorm.Open(postgres.Open(os.Getenv("DATABASE_URL")), &gorm.Config{})
	if err != nil {
		log.Fatalf("open database: %v", err)
	}
	if err := db.AutoMigrate(&store.Product{}, &store.Reservation{}); err != nil {
		log.Fatalf("migrate: %v", err)
	}
	st := store.New(db)

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	brokers := strings.Split(os.Getenv("KAFKA_BROKERS"), ",")
	go func() {
		if err := events.ConsumeOrderPlaced(ctx, brokers, st); err != nil {
			log.Printf("order.placed consumer stopped: %v", err)
		}
	}()

	r := gin.Default()
	r.Use(cors.Default())
	api.NewHandler(st).Register(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
