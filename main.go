package main

import (
	"log"
	"net/http"
	"time"

	"github.com/bmallred/truetandem-gsa/controllers"
)

func init() {
	log.Print("Configuring environment")
	time.Local = time.UTC
	bindRoutes()
}

func main() {
	log.Println("Serving content on", "http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func bindRoutes() {
	http.HandleFunc("/", controllers.DefaultIndex)
	http.HandleFunc("/contact", controllers.DefaultContact)
	http.HandleFunc("/analytics", controllers.AnalyticsIndex)
}
