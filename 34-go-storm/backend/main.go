// Bookmarks: a net/http (Go 1.22 patterns) server over BoltDB through storm.
package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"bookmarks/store"
)

type server struct {
	store *store.Store
}

func (s *server) list(w http.ResponseWriter, r *http.Request) {
	user, err := s.store.UserByName(r.Header.Get("X-User"))
	if err != nil {
		http.Error(w, "unknown user", http.StatusUnauthorized)
		return
	}
	list, _ := s.store.Bookmarks(user.ID)
	_ = json.NewEncoder(w).Encode(list)
}

func (s *server) add(w http.ResponseWriter, r *http.Request) {
	user, err := s.store.UserByName(r.Header.Get("X-User"))
	if err != nil {
		http.Error(w, "unknown user", http.StatusUnauthorized)
		return
	}
	_ = s.store.AddBookmark(&store.Bookmark{UserID: user.ID, URL: r.FormValue("url")})
	w.WriteHeader(http.StatusCreated)
}

func (s *server) remove(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(r.PathValue("id"))
	_ = s.store.RemoveBookmark(id)
	w.WriteHeader(http.StatusNoContent)
}

func (s *server) share(w http.ResponseWriter, r *http.Request) {
	_ = s.store.ShareBookmark(&store.Bookmark{URL: r.FormValue("url")})
	w.WriteHeader(http.StatusNoContent)
}

func (s *server) archived(w http.ResponseWriter, r *http.Request) {
	list, _ := s.store.Archived(0)
	_ = json.NewEncoder(w).Encode(list)
}

func (s *server) theme(w http.ResponseWriter, r *http.Request) {
	theme, _ := s.store.Theme(r.Header.Get("X-User"))
	_, _ = w.Write([]byte(theme))
}

func (s *server) setTheme(w http.ResponseWriter, r *http.Request) {
	_ = s.store.SetTheme(r.Header.Get("X-User"), r.FormValue("theme"))
	w.WriteHeader(http.StatusNoContent)
}

func main() {
	st, err := store.Open("bookmarks.db")
	if err != nil {
		panic(err)
	}
	s := &server{store: st}
	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/bookmarks", s.list)
	mux.HandleFunc("POST /api/bookmarks", s.add)
	mux.HandleFunc("DELETE /api/bookmarks/{id}", s.remove)
	mux.HandleFunc("POST /api/team/bookmarks", s.share)
	mux.HandleFunc("GET /api/archive", s.archived)
	mux.HandleFunc("GET /api/theme", s.theme)
	mux.HandleFunc("PUT /api/theme", s.setTheme)
	_ = http.ListenAndServe(":8080", mux)
}
