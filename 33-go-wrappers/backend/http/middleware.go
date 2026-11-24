package http

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

// requestLog logs each request of the router it is used on, then serves it.
func requestLog(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s", r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
	})
}

func health(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}

// staticRouter serves the static files' routes, mounted under /static.
func staticRouter() *mux.Router {
	sub := mux.NewRouter()
	sub.HandleFunc("/static/version", version)
	return sub
}

func version(w http.ResponseWriter, r *http.Request) {
	_, _ = w.Write([]byte("1"))
}
