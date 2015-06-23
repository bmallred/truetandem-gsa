// +build !appengine

package controllers

import (
	"bytes"
	"log"
	"net/smtp"
)

// sendEmail without the AppEngine libraries.
func sendEmail(from, to, subject, body string) {
	c, err := smtp.Dial("smtp.gmail.com:25")
	if err != nil {
		log.Println("[ERROR] Could not connect to the mail server:", err)
		return
	}

	c.Mail(from)
	c.Rcpt(to)

	wc, err := c.Data()
	if err != nil {
		log.Println("[ERROR] Could not retrieve the message body: ", err)
		return
	}
	defer wc.Close()

	b := bytes.NewBufferString(body)
	if _, err := b.WriteTo(wc); err != nil {
		log.Println("[ERROR] Failed to send the message: ", err)
		return
	}
}
