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

// DefaultOrganization renders the organization page of the default controller.
func DefaultOrganization(w http.ResponseWriter, r *http.Request) {
	t := template.Must(template.ParseFiles(
		"html/master.html",
		"html/defaultOrganization.html",
	))

	if err := t.Execute(w, nil); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// DefaultContact renders the contact page for the default controller.
func DefaultContact(w http.ResponseWriter, r *http.Request) {
	email := r.FormValue("email")
	message := r.FormValue("message")

	if email == "" || message == "" {
		t := template.Must(template.ParseFiles(
			"html/master.html",
			"html/defaultContact.html",
		))

		if err := t.Execute(w, nil); err != nil {
			log.Println(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	} else {
		// Use AppEngine to send our thank you cards
		from := "TrueTandem LLC <sales@truetandem.com>"
		subj := "TrueTandem LLC <sales@truetandem.com>"
		body := "We appreciate your feedback and will get back to you quickly as possible!"
		sendEmail(from, email, subj, body)

		http.Redirect(w, r, "/thank-you", http.StatusSeeOther)
	}
}

func DefaultThankYou(w http.ResponseWriter, r *http.Request) {
	t := template.Must(template.ParseFiles(
		"html/master.html",
		"html/defaultThankYou.html",
	))

	if err := t.Execute(w, nil); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
