package http

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

// runHook runs the action it is given between the before and after hooks of an event.
func runHook(fn func() error, evt string) error {
	log.Printf("before_%s", evt)
	if err := fn(); err != nil {
		return err
	}
	log.Printf("after_%s", evt)
	return nil
}

// withTiming times each request of the router it is given.
func withTiming(r *mux.Router) {
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			start := time.Now()
			next.ServeHTTP(w, req)
			log.Printf("took %s", time.Since(start))
		})
	})
}
