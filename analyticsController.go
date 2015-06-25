package main

import (
	"html/template"
	"log"
	"net/http"
)

// AnalyticsIndex renders the default page of the analytics controller.
func AnalyticsIndex(w http.ResponseWriter, r *http.Request) {
	t := template.Must(template.ParseFiles(
		"html/master.html",
		"html/analyticsIndex.html",
	))

	if err := t.Execute(w, nil); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// FoodRecalls renders the food recall dashboard of the analytics controller.
func FoodRecalls(w http.ResponseWriter, r *http.Request) {
	t := template.Must(template.ParseFiles(
		"html/master.html",
		"html/food-recalls.html",
	))

	if err := t.Execute(w, nil); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// EnforcementReporting renders the enforcement reporting dashboard of the analytics controller.
func EnforcementReporting(w http.ResponseWriter, r *http.Request) {
	t := template.Must(template.ParseFiles(
		"html/master.html",
		"html/enforcement-reporting.html",
	))

	if err := t.Execute(w, nil); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// AdverseEvents renders the adverse events dashboard of the analytics controller.
func AdverseEvents(w http.ResponseWriter, r *http.Request) {
	t := template.Must(template.ParseFiles(
		"html/master.html",
		"html/adverse-events.html",
	))

	if err := t.Execute(w, nil); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
