package main

import (
	"log"
	"net/http"
	"time"

	"github.com/bmallred/gsa/controllers"
	"github.com/gorilla/mux"
)

func main() {
	log.Print("Configuring environment")
	time.Local = time.UTC

	r := mux.NewRouter().StrictSlash(false)
	r.HandleFunc("/", controllers.DefaultIndex)
	r.HandleFunc("/Contact", controllers.DefaultContact)

	log.Println("Serving content on ", "localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
