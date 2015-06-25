// +build !appengine

package main

import (
	"log"
	"net/http"
	"time"

	"github.com/bmallred/truetandem-gsa/controllers"
)

func main() {
	log.Print("Configuring environment")
	time.Local = time.UTC


	http.HandleFunc("/", DefaultIndex)
	http.HandleFunc("/contact", DefaultContact)
	http.HandleFunc("/thank-you", DefaultThankYou)
	http.HandleFunc("/analytics", FoodRecalls)
	http.HandleFunc("/food-recalls", FoodRecalls)
	http.HandleFunc("/organization", DefaultOrganization)
	http.HandleFunc("/enforcement-reporting", EnforcementReporting)
	http.HandleFunc("/adverse-events", AdverseEvents)
	http.HandleFunc("/static/", StaticFiles)
}




