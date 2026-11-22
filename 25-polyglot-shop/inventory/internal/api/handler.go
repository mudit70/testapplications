package api

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/polyglot-shop/inventory/internal/store"
)

type Handler struct {
	store *store.Store
}

func NewHandler(s *store.Store) *Handler {
	return &Handler{store: s}
}

func (h *Handler) Register(r *gin.Engine) {
	api := r.Group("/api")
	api.GET("/products", h.ListProducts)
	api.GET("/products/:id", h.GetProduct)
	api.PATCH("/products/:id/stock", h.Restock)
	api.POST("/reservations", h.Reserve)
	api.DELETE("/reservations/:id", h.Release)
}

func (h *Handler) ListProducts(c *gin.Context) {
	products, err := h.store.ListProducts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, products)
}

func (h *Handler) GetProduct(c *gin.Context) {
	id, ok := idParam(c)
	if !ok {
		return
	}
	p, err := h.store.GetProduct(id)
	if errors.Is(err, store.ErrNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "product not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, p)
}

type restockRequest struct {
	Add int `json:"add" binding:"required,gt=0"`
}

func (h *Handler) Restock(c *gin.Context) {
	id, ok := idParam(c)
	if !ok {
		return
	}
	var req restockRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	p, err := h.store.Restock(id, req.Add)
	if errors.Is(err, store.ErrNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "product not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, p)
}

type reserveRequest struct {
	Items []store.Line `json:"items" binding:"required,min=1,dive"`
}

type reserveResponse struct {
	ReservationIDs []uint `json:"reservation_ids"`
	TotalCents     int64  `json:"total_cents"`
}

func (h *Handler) Reserve(c *gin.Context) {
	var req reserveRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	reservations, total, err := h.store.Reserve(req.Items)
	switch {
	case errors.Is(err, store.ErrOutOfStock):
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	case errors.Is(err, store.ErrNotFound):
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	case err != nil:
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ids := make([]uint, len(reservations))
	for i, r := range reservations {
		ids[i] = r.ID
	}
	c.JSON(http.StatusCreated, reserveResponse{ReservationIDs: ids, TotalCents: total})
}

func (h *Handler) Release(c *gin.Context) {
	id, ok := idParam(c)
	if !ok {
		return
	}
	err := h.store.Release(id)
	if errors.Is(err, store.ErrNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "reservation not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

func idParam(c *gin.Context) (uint, bool) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id must be a number"})
		return 0, false
	}
	return uint(id), true
}
