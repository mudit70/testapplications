// Hand-written stand-in for protoc-generated gRPC code (Stats service).
package statspb

import (
	"context"

	"google.golang.org/grpc"
)

type StatsRequest struct{}

type StatsReply struct {
	Open  int64 `json:"open"`
	Acked int64 `json:"acked"`
}

// Server interface + embeddable Unimplemented base.
type StatsServer interface {
	GetStats(context.Context, *StatsRequest) (*StatsReply, error)
}

type UnimplementedStatsServer struct{}

func (UnimplementedStatsServer) GetStats(context.Context, *StatsRequest) (*StatsReply, error) {
	return nil, nil
}

func RegisterStatsServer(s *grpc.Server, srv StatsServer) {
	// In generated code this registers the service descriptor.
	_ = s
	_ = srv
}

// Client stub.
type StatsClient interface {
	GetStats(ctx context.Context, in *StatsRequest, opts ...grpc.CallOption) (*StatsReply, error)
}

type statsClient struct {
	cc grpc.ClientConnInterface
}

func NewStatsClient(cc grpc.ClientConnInterface) StatsClient {
	return &statsClient{cc: cc}
}

func (c *statsClient) GetStats(ctx context.Context, in *StatsRequest, opts ...grpc.CallOption) (*StatsReply, error) {
	out := new(StatsReply)
	err := c.cc.Invoke(ctx, "/stats.Stats/GetStats", in, out, opts...)
	return out, err
}
