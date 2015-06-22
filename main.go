package main

import (
	"log"
	"net/http"
	"time"

	"github.com/bmallred/truetandem-gsa/controllers"
	"github.com/gorilla/mux"
)

func init() {
    
	log.Print("Configuring environment")
	time.Local = time.UTC

	r := mux.NewRouter().StrictSlash(false)
	r.HandleFunc("/", controllers.DefaultIndex)
	r.HandleFunc("/contact", controllers.DefaultContact)
        http.Handle("/", r)
}

func main() {
	log.Print("Configuring environment")
	time.Local = time.UTC

	r := mux.NewRouter().StrictSlash(false)
	r.HandleFunc("/", controllers.DefaultIndex)
	r.HandleFunc("/contact", controllers.DefaultContact)

	log.Println("Serving content on", "localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
