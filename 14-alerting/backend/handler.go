// HTTP handlers: each calls into the repo / queue / storage / grpc layers.
package main

import (
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type AlertHandler struct {
	Repo    *AlertRepo
	Queue   *EventPublisher
	Storage *EvidenceStore
	Stats   *StatsClient
}

func (h *AlertHandler) ListAlerts(w http.ResponseWriter, r *http.Request) {
	alerts, _ := h.Repo.ListAlerts(r.Context())
	writeJSON(w, alerts)
}

func (h *AlertHandler) CreateAlert(w http.ResponseWriter, r *http.Request) {
	var a Alert
	_ = json.NewDecoder(r.Body).Decode(&a)
	created, _ := h.Repo.CreateAlert(r.Context(), a)
	_ = h.Queue.PublishAlertCreated(r.Context(), created)
	writeJSON(w, created)
}

func (h *AlertHandler) GetAlert(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	alert, _ := h.Repo.GetAlert(r.Context(), id)
	writeJSON(w, alert)
}

func (h *AlertHandler) AckAlert(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	_ = h.Repo.AckAlert(r.Context(), id)
	_ = h.Queue.PublishAlertAcked(r.Context(), id)
	w.WriteHeader(http.StatusNoContent)
}

func (h *AlertHandler) AttachEvidence(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	body, _ := io.ReadAll(r.Body)
	_ = h.Storage.UploadEvidence(r.Context(), id, body)
	w.WriteHeader(http.StatusNoContent)
}

func (h *AlertHandler) GetStats(w http.ResponseWriter, r *http.Request) {
	stats, _ := h.Stats.FetchStats(r.Context())
	writeJSON(w, stats)
}

func writeJSON(w http.ResponseWriter, v any) {
	w.Header().Set("content-type", "application/json")
	_ = json.NewEncoder(w).Encode(v)
}

var _ = context.Background
