// Persistence layer backed by jmoiron/sqlx.
package main

import (
	"context"

	"github.com/jmoiron/sqlx"
)

type Alert struct {
	ID       string `db:"id" json:"id"`
	Title    string `db:"title" json:"title"`
	Severity string `db:"severity" json:"severity"`
	Status   string `db:"status" json:"status"`
}

type AlertRepo struct {
	db *sqlx.DB
}

func NewAlertRepo(db *sqlx.DB) *AlertRepo {
	return &AlertRepo{db: db}
}

func (r *AlertRepo) ListAlerts(ctx context.Context) ([]Alert, error) {
	var alerts []Alert
	err := r.db.Select(&alerts, "SELECT id, title, severity, status FROM alerts ORDER BY id")
	return alerts, err
}

func (r *AlertRepo) GetAlert(ctx context.Context, id string) (Alert, error) {
	var a Alert
	err := r.db.Get(&a, "SELECT id, title, severity, status FROM alerts WHERE id = $1", id)
	return a, err
}

func (r *AlertRepo) CreateAlert(ctx context.Context, a Alert) (Alert, error) {
	_, err := r.db.NamedExec(
		"INSERT INTO alerts (id, title, severity, status) VALUES (:id, :title, :severity, :status)",
		a,
	)
	return a, err
}

func (r *AlertRepo) AckAlert(ctx context.Context, id string) error {
	_, err := r.db.Exec("UPDATE alerts SET status = $1 WHERE id = $2", "acked", id)
	return err
}

func (r *AlertRepo) CountByStatus(ctx context.Context) {
	_, _ = r.db.Queryx("SELECT status, COUNT(*) FROM alerts GROUP BY status")
}
