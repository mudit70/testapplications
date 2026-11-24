package http

import (
	"net/http"

	"filedesk/models"

	"gorm.io/gorm"
)

// data is what every handler is given: the database, the settings and the signed-in user.
type data struct {
	db       *gorm.DB
	settings models.Setting
	user     models.User
}

type handleFunc func(w http.ResponseWriter, r *http.Request, d *data) (int, error)

// handle serves fn: every request first reads the settings, then runs the one handler the
// route gave it.
func handle(fn handleFunc, db *gorm.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var settings models.Setting
		db.First(&settings)
		status, err := fn(w, r, &data{db: db, settings: settings})
		if status >= 400 || err != nil {
			http.Error(w, http.StatusText(status), status)
		}
	})
}
