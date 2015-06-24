package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

// TestDefaultIndex checks for a valid response from the handler.
func TestDefaultIndex(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(DefaultIndex))
	defer server.Close()

	if resp, err := http.DefaultClient.Get(server.URL); err != nil || resp.StatusCode != http.StatusOK {
		t.FailNow()
	}
}

// TestDefaultOrganization checks for a valid response from the handler.
func TestDefaultOrganization(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(DefaultOrganization))
	defer server.Close()

	if resp, err := http.DefaultClient.Get(server.URL); err != nil || resp.StatusCode != http.StatusOK {
		t.FailNow()
	}
}

// TestDefaultContact checks for a valid response from the handler.
func TestDefaultContact(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(DefaultContact))
	defer server.Close()

	if resp, err := http.DefaultClient.Get(server.URL); err != nil || resp.StatusCode != http.StatusOK {
		t.FailNow()
	}
}

// TestDefaultThankYou checks for a valid response from the handler.
func TestDefaultThankYou(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(DefaultThankYou))
	defer server.Close()

	if resp, err := http.DefaultClient.Get(server.URL); err != nil || resp.StatusCode != http.StatusOK {
		t.FailNow()
	}
}
