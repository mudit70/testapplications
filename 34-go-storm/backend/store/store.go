// Package store keeps bookmarks in BoltDB through storm: each struct in a bucket of its type's
// name, and the per-user theme in the "settings" key-value bucket.
package store

import (
	"github.com/asdine/storm/v3"
	"github.com/asdine/storm/v3/q"
)

type User struct {
	ID   int    `storm:"id,increment"`
	Name string `storm:"unique"`
}

type Bookmark struct {
	ID     int `storm:"id,increment"`
	UserID int `storm:"index"`
	URL    string
}

type Store struct {
	db *storm.DB
}

func Open(path string) (*Store, error) {
	db, err := storm.Open(path)
	return &Store{db: db}, err
}

func (s *Store) UserByName(name string) (*User, error) {
	user := &User{}
	err := s.db.One("Name", name, user)
	return user, err
}

func (s *Store) Bookmarks(userID int) (list []Bookmark, err error) {
	err = s.db.Select(q.Eq("UserID", userID)).Find(&list)
	return
}

func (s *Store) AddBookmark(b *Bookmark) error {
	return s.db.Save(b)
}

func (s *Store) RemoveBookmark(id int) error {
	return s.db.DeleteStruct(&Bookmark{ID: id})
}

func (s *Store) Theme(user string) (theme string, err error) {
	err = s.db.Get("settings", user, &theme)
	return
}

func (s *Store) SetTheme(user, theme string) error {
	return s.db.Set("settings", user, theme)
}
