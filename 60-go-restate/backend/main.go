// ShipIt: a net/http API that starts deployments on a Restate service (the worker) through its
// generated ingress client.
package main

import (
	"net/http"

	"github.com/restatedev/sdk-go/ingress"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"shipit/gen"
	"shipit/worker"
)

type server struct {
	db      *gorm.DB
	restate *ingress.Client
}

func (s *server) deploy(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	s.db.Create(&worker.Deployment{ID: id, Status: "pending"})
	// Send: the worker's Deploy runs it, after the response.
	_, err := gen.NewDeployServiceIngressClient(s.restate, id).Deploy().Send(r.Context(), &gen.DeployRequest{DeploymentID: id})
	if err != nil {
		http.Error(w, "failed", http.StatusBadGateway)
		return
	}
	w.WriteHeader(http.StatusAccepted)
}

func main() {
	db, err := gorm.Open(postgres.Open("postgres://localhost:5432/shipit"), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	_ = worker.Definition(db)
	s := &server{db: db, restate: ingress.NewClient("http://localhost:8080")}
	mux := http.NewServeMux()
	mux.HandleFunc("POST /api/deployments/{id}", s.deploy)
	_ = http.ListenAndServe(":3000", mux)
}
