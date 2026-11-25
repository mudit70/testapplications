// Uploads: a net/http API for resumable uploads, shaped like filebrowser's tus handlers, that
// keeps each upload's length in an upload cache (in memory, or in redis through go-redis).
package main

import (
	"net/http"
	"os"
	"strconv"

	"github.com/redis/go-redis/v9"
)

type server struct {
	cache uploadCache
}

func (s *server) start(w http.ResponseWriter, r *http.Request) {
	size, err := strconv.ParseInt(r.Header.Get("Upload-Length"), 10, 64)
	if err != nil {
		http.Error(w, "bad length", http.StatusBadRequest)
		return
	}
	s.cache.Register(r.PathValue("path"), size)
	w.WriteHeader(http.StatusCreated)
}

func (s *server) offset(w http.ResponseWriter, r *http.Request) {
	n, ok := s.cache.Length(r.PathValue("path"))
	if !ok {
		http.NotFound(w, r)
		return
	}
	w.Header().Set("Upload-Length", strconv.FormatInt(n, 10))
}

func (s *server) finish(w http.ResponseWriter, r *http.Request) {
	s.cache.Complete(r.PathValue("path"))
	w.WriteHeader(http.StatusNoContent)
}

func newCache() uploadCache {
	if url := os.Getenv("REDIS_URL"); url != "" {
		opts, err := redis.ParseURL(url)
		if err == nil {
			return &redisCache{client: redis.NewClient(opts)}
		}
	}
	return &memoryCache{lengths: map[string]int64{}}
}

func main() {
	s := &server{cache: newCache()}
	mux := http.NewServeMux()
	mux.HandleFunc("POST /api/uploads/{path}", s.start)
	mux.HandleFunc("GET /api/uploads/{path}", s.offset)
	mux.HandleFunc("DELETE /api/uploads/{path}", s.finish)
	_ = http.ListenAndServe(":3000", mux)
}
