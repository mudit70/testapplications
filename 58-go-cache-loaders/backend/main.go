// Directory: a net/http + GORM server whose lookups all go through one generic cache. Each
// lookup's loader reads one table; a flow reaches only the table its own loader reads.
package main

import (
	"context"
	"encoding/json"
	"net/http"

	"directory/cache"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type User struct {
	ID   string
	Name string
}

type Team struct {
	ID   string
	Name string
}

type Plan struct {
	ID    string
	Price int
}

type server struct {
	db    *gorm.DB
	users cache.Cache[string, User]
	teams cache.Cache[string, Team]
	plans cache.Cache[string, Plan]
}

func (s *server) user(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	u, _ := s.users.SWR(r.Context(), id, func(_ context.Context) (User, error) {
		var u User
		err := s.db.First(&u, "id = ?", id).Error
		return u, err
	})
	_ = json.NewEncoder(w).Encode(u)
}

func (s *server) team(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	t, _ := s.teams.SWR(r.Context(), id, func(_ context.Context) (Team, error) {
		var t Team
		err := s.db.First(&t, "id = ?", id).Error
		return t, err
	})
	_ = json.NewEncoder(w).Encode(t)
}

func (s *server) plan(w http.ResponseWriter, r *http.Request) {
	p, _ := s.plans.SWR(r.Context(), "current", s.loadPlan)
	_ = json.NewEncoder(w).Encode(p)
}

func (s *server) loadPlan(_ context.Context) (Plan, error) {
	var p Plan
	err := s.db.First(&p).Error
	return p, err
}

func main() {
	db, err := gorm.Open(postgres.Open("postgres://localhost:5432/directory"), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	s := &server{
		db:    db,
		users: cache.New[string, User](),
		teams: cache.New[string, Team](),
		plans: cache.New[string, Plan](),
	}
	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/users/{id}", s.user)
	mux.HandleFunc("GET /api/teams/{id}", s.team)
	mux.HandleFunc("GET /api/plan", s.plan)
	_ = http.ListenAndServe(":8080", mux)
}
