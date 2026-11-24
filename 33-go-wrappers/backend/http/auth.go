package http

import (
	"net/http"

	"filedesk/models"
)

// withUser reads the signed-in user, then runs the handler it wraps.
func withUser(fn handleFunc) handleFunc {
	return func(w http.ResponseWriter, r *http.Request, d *data) (int, error) {
		var user models.User
		if err := d.db.First(&user, r.Header.Get("X-User")).Error; err != nil {
			return http.StatusUnauthorized, nil
		}
		d.user = user
		return fn(w, r, d)
	}
}

// withAdmin runs the handler it wraps for an admin only, after withUser.
func withAdmin(fn handleFunc) handleFunc {
	return withUser(func(w http.ResponseWriter, r *http.Request, d *data) (int, error) {
		if !d.user.Admin {
			return http.StatusForbidden, nil
		}
		return fn(w, r, d)
	})
}
