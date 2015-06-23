package controllers

import (
	"html/template"
	"log"
	"net/http"
)

// DefaultIndex renders the default page of the default controller.
func DefaultIndex(w http.ResponseWriter, r *http.Request) {
	t := template.Must(template.ParseFiles(
		"html/master.html",
		"html/defaultIndex.html",
	))
	if err := t.Execute(w, nil); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// DefaultContact renders the contact page for the default controller.
func DefaultContact(w http.ResponseWriter, r *http.Request) {
	t := template.Must(template.ParseFiles(
		"html/master.html",
		"html/defaultContact.html",
	))
	if err := t.Execute(w, nil); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
