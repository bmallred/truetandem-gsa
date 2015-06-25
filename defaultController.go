package main

import (
	"html/template"
	"net/http"
)

var (
	templateMaster       string = "html/master.html"
	templateIndex        string = "html/defaultIndex.html"
	templateOrganization string = "html/defaultOrganization.html"
	templateContact      string = "html/defaultContact.html"
	templateThankYou     string = "html/defaultThankYou.html"
)

// DefaultIndex renders the default page of the default controller.
func DefaultIndex(w http.ResponseWriter, r *http.Request) {
	t := template.Must(template.ParseFiles(
		templateMaster,
		templateIndex,
	))

	if err := t.Execute(w, nil); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// DefaultOrganization renders the organization page of the default controller.
func DefaultOrganization(w http.ResponseWriter, r *http.Request) {
	t := template.Must(template.ParseFiles(
		templateMaster,
		templateOrganization,
	))

	if err := t.Execute(w, nil); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// DefaultContact renders the contact page for the default controller.
func DefaultContact(w http.ResponseWriter, r *http.Request) {
	email := r.FormValue("email")
	message := r.FormValue("message")

	if email == "" || message == "" {
		t := template.Must(template.ParseFiles(
			templateMaster,
			templateContact,
		))

		if err := t.Execute(w, nil); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	} else {
		// Use AppEngine to send our thank you cards
		from := "TrueTandem LLC <sales@truetandem.com>"
		subj := "TrueTandem LLC <sales@truetandem.com>"
		body := "We appreciate your feedback and will get back to you quickly as possible!"
		sendEmail(r, from, email, subj, body)

		http.Redirect(w, r, "/thank-you", http.StatusSeeOther)
	}
}

// DefaultThankYou renders the thank you page after submitting feedback.
func DefaultThankYou(w http.ResponseWriter, r *http.Request) {
	t := template.Must(template.ParseFiles(
		templateMaster,
		templateThankYou,
	))

	if err := t.Execute(w, nil); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// Test page creation
func DefaultTest(w http.ResponseWriter, r *http.Request) {
	t := template.Must(template.ParseFiles(
		"html/master.html",
		"html/test.html",
	))

	if err := t.Execute(w, nil); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
