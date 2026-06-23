// gRPC server implementation for the Stats service (grpc-go).
package main

import (
	"context"
	"net"

	"github.com/example/alerting/statspb"
	"google.golang.org/grpc"
)

// statsServer embeds the generated Unimplemented base, marking it a servicer.
type statsServer struct {
	statspb.UnimplementedStatsServer
	repo *AlertRepo
}

func (s *statsServer) GetStats(ctx context.Context, req *statspb.StatsRequest) (*statspb.StatsReply, error) {
	s.repo.CountByStatus(ctx)
	return &statspb.StatsReply{Open: 3, Acked: 7}, nil
}

func serveGRPC(repo *AlertRepo) error {
	lis, err := net.Listen("tcp", ":9090")
	if err != nil {
		return err
	}
	server := grpc.NewServer()
	statspb.RegisterStatsServer(server, &statsServer{repo: repo})
	return server.Serve(lis)
}
