package db

import (
	"context"
	"database/sql"
)

// DBTX is what sqlc's queries run on: a *sql.DB or a transaction.
type DBTX interface {
	ExecContext(context.Context, string, ...interface{}) (sql.Result, error)
	QueryContext(context.Context, string, ...interface{}) (*sql.Rows, error)
}

type Queries struct{}

type BulkQueries struct{}

var Query = &Queries{}

var Bulk = &BulkQueries{}
