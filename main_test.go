// +build !appengine

package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/bmallred/truetandem-gsa/controllers"
)

func TestDefaultIndex(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(controllers.DefaultIndex))
	defer server.Close()

	if resp, err := http.DefaultClient.Get(server.URL); err != nil || resp.StatusCode != http.StatusOK {
		t.FailNow()
	}
}

func TestDefaultOrganization(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(controllers.DefaultOrganization))
	defer server.Close()

	if resp, err := http.DefaultClient.Get(server.URL); err != nil || resp.StatusCode != http.StatusOK {
		t.FailNow()
	}
}

func TestDefaultContact(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(controllers.DefaultContact))
	defer server.Close()

	if resp, err := http.DefaultClient.Get(server.URL); err != nil || resp.StatusCode != http.StatusOK {
		t.FailNow()
	}
}

func TestDefaultThankYou(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(controllers.DefaultThankYou))
	defer server.Close()

	if resp, err := http.DefaultClient.Get(server.URL); err != nil || resp.StatusCode != http.StatusOK {
		t.FailNow()
	}
}
