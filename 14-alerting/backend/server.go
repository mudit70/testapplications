// HTTP entrypoint: Chi router wiring the alerting API.
package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func newRouter(h *AlertHandler) *chi.Mux {
	r := chi.NewRouter()

	r.Get("/api/alerts", h.ListAlerts)
	r.Post("/api/alerts", h.CreateAlert)
	r.Get("/api/alerts/{id}", h.GetAlert)
	r.Post("/api/alerts/{id}/ack", h.AckAlert)
	r.Post("/api/alerts/{id}/evidence", h.AttachEvidence)
	r.Get("/api/stats", h.GetStats)

	return r
}

func main() {
	repo := NewAlertRepo(nil)
	h := &AlertHandler{
		Repo:    repo,
		Queue:   NewEventPublisher(nil),
		Storage: NewEvidenceStore(nil),
		Stats:   NewStatsClient(nil),
	}
	go func() { _ = serveGRPC(repo) }()
	_ = http.ListenAndServe(":8080", newRouter(h))
}
