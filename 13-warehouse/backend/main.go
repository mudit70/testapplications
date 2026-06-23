// Command warehouse runs the warehouse inventory API.
package main

import (
	"context"
	"log"

	"cloud.google.com/go/storage"
	"github.com/gofiber/fiber/v2"

	"warehouse/ent"
	"warehouse/internal/cache"
	"warehouse/internal/events"
	apihttp "warehouse/internal/http"
	"warehouse/internal/repo"
	"warehouse/internal/search"
	gcsstore "warehouse/internal/storage"
)

func main() {
	ctx := context.Background()

	client := ent.NewClient()
	gcsClient, err := storage.NewClient(ctx)
	if err != nil {
		log.Fatalf("gcs: %v", err)
	}

	idx, err := search.NewIndex()
	if err != nil {
		log.Fatalf("elastic: %v", err)
	}

	handlers := apihttp.NewHandlers(
		repo.NewItemRepo(client),
		events.NewPublisher(),
		idx,
		cache.NewCache(),
		gcsstore.NewPhotos(gcsClient),
	)

	app := fiber.New()
	handlers.Register(app)

	log.Fatal(app.Listen(":8080"))
}
