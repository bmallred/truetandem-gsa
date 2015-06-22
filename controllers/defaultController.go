package controllers

import (
	"html/template"
	"log"
	"net/http"
)

var (
	templateDefaultIndex = template.Must(template.ParseFiles(
		"html/master.html",
		"html/defaultIndex.html",
	))
	templateDefaultContact = template.Must(template.ParseFiles(
		"html/master.html",
		"html/defaultContact.html",
	))
)

// DefaultIndex renders the default page of the default controller.
func DefaultIndex(w http.ResponseWriter, r *http.Request) {
	if err := templateDefaultIndex.Execute(w, nil); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// DefaultContact renders the contact page for the default controller.
func DefaultContact(w http.ResponseWriter, r *http.Request) {
	if err := templateDefaultContact.Execute(w, nil); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
