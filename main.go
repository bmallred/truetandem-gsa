package main

import (
	"log"
	"net/http"
	"time"
)

// init configures the routes used for Google AppEngine.
func init() {
	time.Local = time.UTC

	http.HandleFunc("/", DefaultIndex)
	http.HandleFunc("/contact", DefaultContact)
	http.HandleFunc("/thank-you", DefaultThankYou)
	http.HandleFunc("/analytics", FoodRecalls)
	http.HandleFunc("/food-recalls", FoodRecalls)
	http.HandleFunc("/organization", DefaultOrganization)
	http.HandleFunc("/enforcement-reporting", EnforcementReporting)
	http.HandleFunc("/adverse-events", AdverseEvents)
	http.HandleFunc("/test", DefaultTest)
	http.HandleFunc("/static/", StaticFiles)
}

// main executes the normal command execution.
func main() {
	log.Println("Serving content on", "http://localhost:8080")
	log.Fatalln(http.ListenAndServe(":8080", nil))
}
