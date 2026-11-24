// FileDesk: a gorilla/mux + GORM server whose routes all run through shared wrappers
// (handle, withUser, withAdmin) and a shared hook runner, the way filebrowser's do.
package main

import (
	stdhttp "net/http"

	fdhttp "filedesk/http"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	db, err := gorm.Open(postgres.Open("postgres://localhost:5432/filedesk"), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	_ = stdhttp.ListenAndServe(":8080", fdhttp.NewHandler(db))
}
