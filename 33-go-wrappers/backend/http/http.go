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
	monkey := func(fn handleFunc) http.Handler {
		return handle(fn, db)
	}
	api := r.PathPrefix("/api").Subrouter()
	api.Handle("/login", monkey(login)).Methods("POST")
	api.Handle("/renew", monkey(renewHandler("session"))).Methods("POST")
	api.Handle("/notes", monkey(notesList)).Methods("GET")
	api.Handle("/notes", monkey(notePostHandler("upload"))).Methods("POST")
	api.Handle("/attachments", monkey(attachmentDeleteHandler("delete"))).Methods("DELETE")
	api.Handle("/settings", monkey(settingsPut)).Methods("PUT")
	return r
}
