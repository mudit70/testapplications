// Ctrl: a net/http API over sqlc queries whose SQL is assembled when they run (a bulk insert's
// fmt.Sprintf, sqlc.slice's strings.Replace), behind a session check that reads the request's
// cookie through an interface of its own.
package main

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"

	_ "github.com/go-sql-driver/mysql"

	"ctrl/db"
)

type server struct {
	db     *sql.DB
	bearer string
}

// request is what authenticate reads: any request with cookies. Only an *http.Request is
// handed to it, as only a Connect request is to unkey's vault authenticate.
type request interface {
	Cookie(name string) (*http.Cookie, error)
}

func (s *server) authenticate(req request) bool {
	c, err := req.Cookie("session")
	return err == nil && strings.TrimPrefix(c.Value, "Bearer ") == s.bearer
}

func (s *server) createTopologies(w http.ResponseWriter, r *http.Request) {
	if !s.authenticate(r) {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	var params []db.InsertTopologyParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	if err := db.Bulk.InsertTopologies(r.Context(), s.db, params); err != nil {
		http.Error(w, "failed", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

func (s *server) listRoutes(w http.ResponseWriter, r *http.Request) {
	if !s.authenticate(r) {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	routes, err := db.Query.FindRoutesBySticky(r.Context(), s.db, db.FindRoutesByStickyParams{
		EnvironmentID: r.URL.Query().Get("environment"),
		Sticky:        r.URL.Query()["sticky"],
	})
	if err != nil {
		http.Error(w, "failed", http.StatusInternalServerError)
		return
	}
	_ = json.NewEncoder(w).Encode(routes)
}

func main() {
	conn, err := sql.Open("mysql", "ctrl@tcp(localhost:3306)/ctrl")
	if err != nil {
		panic(err)
	}
	s := &server{db: conn, bearer: "dev"}
	mux := http.NewServeMux()
	mux.HandleFunc("POST /api/topologies", s.createTopologies)
	mux.HandleFunc("GET /api/routes", s.listRoutes)
	_ = http.ListenAndServe(":3000", mux)
}
