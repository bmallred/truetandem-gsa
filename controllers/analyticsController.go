package controllers

import (
	"html/template"
	"log"
	"net/http"
)

var (
	templateAnalyticsIndex = template.Must(template.ParseFiles(
		"html/master.html",
		"html/analyticsIndex.html",
	))
)

// AnalyticsIndex renders the default page of the analytics controller.
func AnalyticsIndex(w http.ResponseWriter, r *http.Request) {
	if err := templateAnalyticsIndex.Execute(w, nil); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
