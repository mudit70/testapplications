// Package http exposes the warehouse HTTP API over Fiber.
package http

import (
	"context"

	"github.com/gofiber/fiber/v2"

	"warehouse/internal/cache"
	"warehouse/internal/events"
	"warehouse/internal/repo"
	"warehouse/internal/search"
	"warehouse/internal/storage"
)

// Handlers bundle the warehouse service dependencies.
type Handlers struct {
	repo   *repo.ItemRepo
	pub    *events.Publisher
	idx    *search.Index
	cache  *cache.Cache
	photos *storage.Photos
}

// NewHandlers builds the HTTP handlers.
func NewHandlers(r *repo.ItemRepo, p *events.Publisher, i *search.Index, c *cache.Cache, ph *storage.Photos) *Handlers {
	return &Handlers{repo: r, pub: p, idx: i, cache: c, photos: ph}
}

// listItems handles GET /api/items.
func (h *Handlers) listItems(c *fiber.Ctx) error {
	items, err := h.repo.List(c.Context())
	if err != nil {
		return err
	}
	return c.JSON(fiber.Map{"items": items})
}

// getItem handles GET /api/items/:id.
func (h *Handlers) getItem(c *fiber.Ctx) error {
	id, _ := c.ParamsInt("id")
	if err := h.cache.GetItem(); err != nil {
		// cache miss is fine
		_ = err
	}
	item, err := h.repo.Get(c.Context(), id)
	if err != nil {
		return err
	}
	return c.JSON(item)
}

// createItem handles POST /api/items.
func (h *Handlers) createItem(c *fiber.Ctx) error {
	var body struct {
		Name  string `json:"name"`
		SKU   string `json:"sku"`
		Stock int    `json:"stock"`
	}
	if err := c.BodyParser(&body); err != nil {
		return err
	}
	ctx := c.Context()
	item, err := h.repo.Create(ctx, body.Name, body.SKU, body.Stock)
	if err != nil {
		return err
	}
	if err := h.pub.ItemCreated(ctx, c.Body()); err != nil {
		return err
	}
	if err := h.cache.SetItem(c.Body()); err != nil {
		return err
	}
	if err := h.idx.IndexItem(string(c.Body())); err != nil {
		return err
	}
	return c.Status(201).JSON(item)
}

// adjustStock handles POST /api/items/:id/stock.
func (h *Handlers) adjustStock(c *fiber.Ctx) error {
	id, _ := c.ParamsInt("id")
	var body struct {
		Stock int `json:"stock"`
	}
	if err := c.BodyParser(&body); err != nil {
		return err
	}
	ctx := c.Context()
	n, err := h.repo.AdjustStock(ctx, id, body.Stock)
	if err != nil {
		return err
	}
	if err := h.pub.StockAdjusted(ctx, c.Body()); err != nil {
		return err
	}
	if err := h.cache.InvalidateItem(); err != nil {
		return err
	}
	return c.JSON(fiber.Map{"updated": n})
}

// searchItems handles GET /api/items/search.
func (h *Handlers) searchItems(c *fiber.Ctx) error {
	q := c.Query("q")
	if err := h.idx.SearchItems(q); err != nil {
		return err
	}
	return c.JSON(fiber.Map{"query": q})
}

// uploadPhoto handles POST /api/items/:id/photo.
func (h *Handlers) uploadPhoto(c *fiber.Ctx) error {
	ctx := context.Background()
	w := h.photos.Upload(ctx, "items/new.jpg")
	if _, err := w.Write(c.Body()); err != nil {
		return err
	}
	if err := w.Close(); err != nil {
		return err
	}
	return c.SendStatus(204)
}

// listLocations handles GET /api/locations.
func (h *Handlers) listLocations(c *fiber.Ctx) error {
	locs, err := h.repo.ListLocations(c.Context())
	if err != nil {
		return err
	}
	return c.JSON(fiber.Map{"locations": locs})
}

// Register wires all routes onto the Fiber app.
func (h *Handlers) Register(app *fiber.App) {
	app.Get("/api/items", h.listItems)
	app.Get("/api/items/search", h.searchItems)
	app.Get("/api/items/:id", h.getItem)
	app.Post("/api/items", h.createItem)
	app.Post("/api/items/:id/stock", h.adjustStock)
	app.Post("/api/items/:id/photo", h.uploadPhoto)
	app.Get("/api/locations", h.listLocations)
}
