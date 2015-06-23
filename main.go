package main

import (
	"log"
	"net/http"
	"time"

	"github.com/bmallred/truetandem-gsa/controllers"
)

// func init() {
// 	time.Local = time.UTC
//
// 	http.HandleFunc("/", controllers.DefaultIndex)
// 	http.HandleFunc("/contact", controllers.DefaultContact)
// 	http.Handle("/", nil)
// }

func main() {
	log.Print("Configuring environment")
	time.Local = time.UTC

	http.HandleFunc("/", controllers.DefaultIndex)
	http.HandleFunc("/contact", controllers.DefaultContact)
	http.HandleFunc("/analytics", controllers.AnalyticsIndex)

	log.Println("Serving content on", "http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
