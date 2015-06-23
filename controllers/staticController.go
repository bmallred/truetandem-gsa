package controllers

import (
	"log"
	"net/http"
)

// StaticFiles handles serving static resources across an HTTP connection.
func StaticFiles(w http.ResponseWriter, r *http.Request) {
	log.Println("[INFO] File", r.URL.Path[1:])
	http.ServeFile(w, r, r.URL.Path[1:])
}
