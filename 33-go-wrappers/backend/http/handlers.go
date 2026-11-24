package http

import (
	"encoding/json"
	"net/http"

	"filedesk/models"
)

func login(w http.ResponseWriter, r *http.Request, d *data) (int, error) {
	var user models.User
	if err := d.db.Where("name = ?", r.FormValue("name")).First(&user).Error; err != nil {
		return http.StatusForbidden, nil
	}
	return http.StatusOK, json.NewEncoder(w).Encode(user)
}

var notesList = withUser(func(w http.ResponseWriter, r *http.Request, d *data) (int, error) {
	var notes []models.Note
	d.db.Where("user_id = ?", d.user.ID).Find(&notes)
	return http.StatusOK, json.NewEncoder(w).Encode(notes)
})

func notePostHandler(evt string) handleFunc {
	return withUser(func(w http.ResponseWriter, r *http.Request, d *data) (int, error) {
		note := models.Note{UserID: d.user.ID, Body: r.FormValue("body")}
		err := runHook(func() error {
			return d.db.Create(&note).Error
		}, evt)
		return http.StatusCreated, err
	})
}

func attachmentDeleteHandler(evt string) handleFunc {
	return withUser(func(w http.ResponseWriter, r *http.Request, d *data) (int, error) {
		err := runHook(func() error {
			return d.db.Delete(&models.Attachment{}, r.FormValue("id")).Error
		}, evt)
		return http.StatusNoContent, err
	})
}

var settingsPut = withAdmin(func(w http.ResponseWriter, r *http.Request, d *data) (int, error) {
	d.settings.BrandColor = r.FormValue("color")
	d.db.Save(&d.settings)
	return http.StatusOK, nil
})

func renewHandler(token string) handleFunc {
	return withUser(func(w http.ResponseWriter, r *http.Request, d *data) (int, error) {
		session := models.Session{UserID: d.user.ID, Token: token}
		d.db.Create(&session)
		return http.StatusOK, json.NewEncoder(w).Encode(session)
	})
}
