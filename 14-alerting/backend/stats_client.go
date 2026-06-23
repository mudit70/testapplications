// gRPC client for the Stats service, used by the HTTP /api/stats handler.
package main

import (
	"context"

	"github.com/example/alerting/statspb"
	"google.golang.org/grpc"
)

type Stats struct {
	Open  int64 `json:"open"`
	Acked int64 `json:"acked"`
}

type StatsClient struct {
	client statspb.StatsClient
}

func NewStatsClient(conn *grpc.ClientConn) *StatsClient {
	return &StatsClient{client: statspb.NewStatsClient(conn)}
}

func (c *StatsClient) FetchStats(ctx context.Context) (Stats, error) {
	reply, err := c.client.GetStats(ctx, &statspb.StatsRequest{})
	if err != nil {
		return Stats{}, err
	}
	return Stats{Open: reply.Open, Acked: reply.Acked}, nil
}
