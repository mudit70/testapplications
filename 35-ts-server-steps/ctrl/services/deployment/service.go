package deployment

import (
	"context"
	"fmt"

	"connectrpc.com/connect"
	"example.com/ctrl/gen/ctrlv1connect"
)

type Service struct {
	approved map[string]bool
}

func New() *Service { return &Service{approved: map[string]bool{}} }

// AuthorizeDeployment approves a deployment that waits for it.
func (s *Service) AuthorizeDeployment(ctx context.Context, req *connect.Request[ctrlv1connect.AuthorizeDeploymentRequest]) (*connect.Response[ctrlv1connect.AuthorizeDeploymentResponse], error) {
	id := req.Msg.DeploymentId
	if id == "" {
		return nil, connect.NewError(connect.CodeInvalidArgument, fmt.Errorf("deployment_id is required"))
	}
	s.approved[id] = true
	return connect.NewResponse(&ctrlv1connect.AuthorizeDeploymentResponse{}), nil
}
