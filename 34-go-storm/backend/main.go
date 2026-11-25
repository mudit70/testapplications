// Bookmarks: a net/http (Go 1.22 patterns) server over BoltDB through storm.
package main

import (
	"bytes"
	"encoding/json"
	"net"
	"net/http"
	"os"
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

// eventsURL is the analytics endpoint: EVENTS_URL when it is set, else the hosted one.
func eventsURL() string {
	if u := os.Getenv("EVENTS_URL"); u != "" {
		return u + "/v1/track"
	}
	return "https://events.example.com/v1/track"
}

// check probes the link the user gives (a URL known only when the code runs), then records the
// check with the analytics service.
func (s *server) check(w http.ResponseWriter, r *http.Request) {
	resp, err := http.Get(r.FormValue("url"))
	if err != nil {
		http.Error(w, "unreachable", http.StatusBadGateway)
		return
	}
	resp.Body.Close()
	req, _ := http.NewRequest(http.MethodPost, eventsURL(), bytes.NewReader([]byte("{}")))
	if res, err := http.DefaultClient.Do(req); err == nil {
		res.Body.Close()
	}
	// A UDP metric to statsd: the network the dial names, and a host the code states.
	if conn, err := net.Dial("udp", "statsd.example.com:8125"); err == nil {
		_, _ = conn.Write([]byte("bookmarks.check:1|c"))
		conn.Close()
	}
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
	mux.HandleFunc("POST /api/check", s.check)
	_ = http.ListenAndServe(":8080", mux)
}
