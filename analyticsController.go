package main

import (
	"html/template"
	"net/http"
)

var (
	templateFoodRecalls          string = "html/food-recalls.html"
	templateEnforcementReporting string = "html/enforcement-reporting.html"
	templateAdverseEvents        string = "html/adverse-events.html"
)

// FoodRecalls renders the food recall dashboard of the analytics controller.
func FoodRecalls(w http.ResponseWriter, r *http.Request) {
	t := template.Must(template.ParseFiles(
		templateMaster,
		templateFoodRecalls,
	))

	if err := t.Execute(w, nil); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// EnforcementReporting renders the enforcement reporting dashboard of the analytics controller.
func EnforcementReporting(w http.ResponseWriter, r *http.Request) {
	t := template.Must(template.ParseFiles(
		templateMaster,
		templateEnforcementReporting,
	))

	if err := t.Execute(w, nil); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// AdverseEvents renders the adverse events dashboard of the analytics controller.
func AdverseEvents(w http.ResponseWriter, r *http.Request) {
	t := template.Must(template.ParseFiles(
		templateMaster,
		templateAdverseEvents,
	))

	if err := t.Execute(w, nil); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
