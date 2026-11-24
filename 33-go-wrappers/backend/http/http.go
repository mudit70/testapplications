// Package http serves the API. Every route runs handle's closure, most then withUser's (and
// withAdmin's), and then the one handler the route names: the wrappers are shared by all the
// routes, but each route's request reaches only its own handler.
package http

import (
	"net/http"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func NewHandler(db *gorm.DB) http.Handler {
	r := mux.NewRouter()
	// Every route of r and of its subrouters sets the CSP header first.
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Security-Policy", "default-src 'self'")
			next.ServeHTTP(w, r)
		})
	})
	monkey := func(fn handleFunc) http.Handler {
		return handle(fn, db)
	}
	r.HandleFunc("/health", health)
	api := r.PathPrefix("/api").Subrouter()
	// Only the /api routes log their requests.
	api.Use(requestLog)
	api.Handle("/login", monkey(login)).Methods("POST")
	api.Handle("/renew", monkey(renewHandler("session"))).Methods("POST")
	api.Handle("/notes", monkey(notesList)).Methods("GET")
	api.Handle("/notes", monkey(notePostHandler("upload"))).Methods("POST")
	api.Handle("/attachments", monkey(attachmentDeleteHandler("delete"))).Methods("DELETE")
	api.Handle("/settings", monkey(settingsPut)).Methods("PUT")
	return r
}
