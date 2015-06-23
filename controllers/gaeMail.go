// +build appengine

package controllers

import (
	"log"
	"net/http"

	"google.golang.org/appengine"
	"google.golang.org/appengine/mail"
)

func sendEmail(r *http.Request, from, to, subject, body string) {
	// Use AppEngine to send our thank you cards
	c := appengine.NewContext(r)
	msg := &mail.Message{
		Sender:  from,
		To:      []string{to},
		Subject: subject,
		Body:    body,
	}

	if err := mail.Send(c, msg); err != nil {
		log.Printf("[ERROR] Could not send email: %v\n", err)
	}
}