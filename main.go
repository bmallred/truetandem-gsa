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
	bindRoutes()

	log.Println("Serving content on", "http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func bindRoutes() {
	http.HandleFunc("/", controllers.DefaultIndex)
	http.HandleFunc("/contact", controllers.DefaultContact)
	http.HandleFunc("/thank-you", controllers.DefaultThankYou)
	http.HandleFunc("/analytics", controllers.AnalyticsIndex)
	http.HandleFunc("/food-recalls", controllers.FoodRecalls)
	http.HandleFunc("/organization", controllers.DefaultOrganization)
	http.HandleFunc("/static/", controllers.StaticFiles)
}
