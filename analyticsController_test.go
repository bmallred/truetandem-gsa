package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

// TestAnalyticsIndex checks for a valid response from the handler.
func TestAnalyticsIndex(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(AnalyticsIndex))
	defer server.Close()

	if resp, err := http.DefaultClient.Get(server.URL); err != nil || resp.StatusCode != http.StatusOK {
		t.FailNow()
	}
}

// TestFoodRecalls checks for a valid response from the handler.
func TestFoodRecalls(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(FoodRecalls))
	defer server.Close()

	if resp, err := http.DefaultClient.Get(server.URL); err != nil || resp.StatusCode != http.StatusOK {
		t.FailNow()
	}
}

// TestEnforcementReporting checks for a valid response from the handler.
func TestEnforcementReporting(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(EnforcementReporting))
	defer server.Close()

	if resp, err := http.DefaultClient.Get(server.URL); err != nil || resp.StatusCode != http.StatusOK {
		t.FailNow()
	}
}
