package controllers

import (
	"net/http"
	"strings"
)

// StaticFiles handles serving static resources across an HTTP connection.
func StaticFiles(w http.ResponseWriter, r *http.Request) {
	f := r.URL.Path[1:]
	if strings.Contains(f, "../") || strings.ContainsAny(f, "~;") {
		http.Error(w, f, http.StatusNotFound)
		return
	}

	http.ServeFile(w, r, r.URL.Path[1:])
}
