// Package db is sqlc's output (shaped like unkey's pkg/db): each query a const of SQL handed to a
// DBTX, and a Replica that wraps *sql.DB and runs whatever query it is given.
package db

import (
	"context"
	"database/sql"
)

// DBTX is what sqlc's queries run on: a *sql.DB, a *sql.Tx or a wrapper of either.
type DBTX interface {
	ExecContext(context.Context, string, ...interface{}) (sql.Result, error)
	QueryContext(context.Context, string, ...interface{}) (*sql.Rows, error)
	QueryRowContext(context.Context, string, ...interface{}) *sql.Row
}

type Queries struct{}

// Query is the generated queries, run on the DBTX each call is given.
var Query = &Queries{}

// Replica runs queries on one database handle.
type Replica struct {
	db *sql.DB
}

func NewReplica(db *sql.DB) *Replica { return &Replica{db: db} }

func (r *Replica) ExecContext(ctx context.Context, query string, args ...any) (sql.Result, error) {
	return r.db.ExecContext(ctx, query, args...)
}

func (r *Replica) QueryContext(ctx context.Context, query string, args ...any) (*sql.Rows, error) {
	return r.db.QueryContext(ctx, query, args...)
}

func (r *Replica) QueryRowContext(ctx context.Context, query string, args ...any) *sql.Row {
	return r.db.QueryRowContext(ctx, query, args...)
}
