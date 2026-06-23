package main

import (
	"context"

	"github.com/hibiken/asynq"
)

// ── Producer side: enqueue match + receipt tasks ──

func enqueueMatch(client *asynq.Client, ridePayload []byte) error {
	matchTask := asynq.NewTask("ride:match", ridePayload)
	_, err := client.Enqueue(matchTask)
	return err
}

func enqueueReceipt(ctx context.Context, client *asynq.Client, ridePayload []byte) error {
	receiptTask := asynq.NewTask("ride:receipt", ridePayload)
	_, err := client.EnqueueContext(ctx, receiptTask)
	return err
}

// ── Consumer side: mux.HandleFunc("type", handler) ──

func newTaskMux() *asynq.ServeMux {
	mux := asynq.NewServeMux()
	mux.HandleFunc("ride:match", handleMatch)
	mux.HandleFunc("ride:receipt", handleReceipt)
	return mux
}

func handleMatch(ctx context.Context, t *asynq.Task) error   { return nil }
func handleReceipt(ctx context.Context, t *asynq.Task) error { return nil }
