// +build appengine

package controllers

import (
	"log"

	"google.golang.org/appengine"
	"google.golang.org/appengine/mail"
)

func email(from, to, subject, body string) {
	// Use AppEngine to send our thank you cards
	c := appengine.NewContext(r)
	msg := &mail.Message{
		Sender:  "TrueTandem LLC <sales@truetandem.com>",
		To:      []string{email},
		Subject: "Thank you for your feedback",
		Body:    "We appreciate your feedback and will get back to you quickly as possible!",
	}

	if err := mail.Send(c, msg); err != nil {
		log.Printf("[ERROR] Could not send email: %v\n", err)
	}
}
