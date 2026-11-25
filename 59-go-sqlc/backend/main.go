// Deploys: a net/http server over MySQL through sqlc's queries, run on a Replica.
package main

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"deploys/db"

	_ "github.com/go-sql-driver/mysql"
)

type server struct {
	rw *db.Replica
}

func (s *server) project(w http.ResponseWriter, r *http.Request) {
	p, err := db.Query.FindProjectByID(r.Context(), s.rw, r.PathValue("id"))
	if err != nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	_ = json.NewEncoder(w).Encode(p)
}

func (s *server) deployments(w http.ResponseWriter, r *http.Request) {
	list, _ := db.Query.ListDeploymentsByProject(r.Context(), s.rw, r.PathValue("id"))
	_ = json.NewEncoder(w).Encode(list)
}

func (s *server) deploy(w http.ResponseWriter, r *http.Request) {
	err := db.Query.InsertDeployment(r.Context(), s.rw, db.InsertDeploymentParams{
		ID:        r.FormValue("id"),
		ProjectID: r.PathValue("id"),
	})
	if err != nil {
		http.Error(w, "failed", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

func main() {
	conn, err := sql.Open("mysql", "root@tcp(localhost:3306)/deploys")
	if err != nil {
		panic(err)
	}
	s := &server{rw: db.NewReplica(conn)}
	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/projects/{id}", s.project)
	mux.HandleFunc("GET /api/projects/{id}/deployments", s.deployments)
	mux.HandleFunc("POST /api/projects/{id}/deployments", s.deploy)
	_ = http.ListenAndServe(":8080", mux)
}
