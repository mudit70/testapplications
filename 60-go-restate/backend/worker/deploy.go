// Package worker is the Restate service: its Deploy handler runs the deployment the API
// started, and records it.
package worker

import (
	sdk_go "github.com/restatedev/sdk-go"
	"gorm.io/gorm"

	"shipit/gen"
)

type Deployment struct {
	ID     string
	Status string
}

type Workflow struct {
	gen.UnimplementedDeployServiceServer
	db *gorm.DB
}

func New(db *gorm.DB) *Workflow { return &Workflow{db: db} }

func (w *Workflow) Deploy(ctx sdk_go.ObjectContext, req *gen.DeployRequest) (*gen.DeployResponse, error) {
	w.db.Model(&Deployment{}).Where("id = ?", req.DeploymentID).Update("status", "running")
	return &gen.DeployResponse{}, nil
}

// Definition is the service the Restate server binds.
func Definition(db *gorm.DB) sdk_go.ServiceDefinition {
	return gen.NewDeployServiceServer(New(db))
}
