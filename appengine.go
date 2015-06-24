// +build appengine

package main

import (
	"net/http"

	// Butchered this path to get it to work with AppEngine requirements
	"controllers"
)

func init() {
	http.HandleFunc("/", controllers.DefaultIndex)
	http.HandleFunc("/contact", controllers.DefaultContact)
	http.HandleFunc("/thank-you", controllers.DefaultThankYou)
	http.HandleFunc("/analytics", controllers.AnalyticsIndex)
	http.HandleFunc("/food-recalls", controllers.FoodRecalls)
	http.HandleFunc("/organization", controllers.DefaultOrganization)
	http.HandleFunc("/enforcement-reporting", controllers.EnforcementReporting)
	http.HandleFunc("/static/", controllers.StaticFiles)
}
