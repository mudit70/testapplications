// Package models holds the GORM models: each is one table (GORM's plural, snake-case name).
package models

type User struct {
	ID    uint
	Name  string
	Admin bool
}

type Setting struct {
	ID         uint
	Signup     bool
	BrandColor string
}

type Note struct {
	ID     uint
	UserID uint
	Body   string
}

type Attachment struct {
	ID     uint
	NoteID uint
	Path   string
}

type Session struct {
	ID     uint
	UserID uint
	Token  string
}
