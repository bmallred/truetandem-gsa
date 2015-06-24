// +build !appengine

package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/bmallred/truetandem-gsa/controllers"
)

// TestDefaultIndex checks for a valid response from the handler.
func TestDefaultIndex(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(controllers.DefaultIndex))
	defer server.Close()

	if resp, err := http.DefaultClient.Get(server.URL); err != nil || resp.StatusCode != http.StatusOK {
		t.FailNow()
	}
}

// TestDefaultOrganization checks for a valid response from the handler.
func TestDefaultOrganization(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(controllers.DefaultOrganization))
	defer server.Close()

	if resp, err := http.DefaultClient.Get(server.URL); err != nil || resp.StatusCode != http.StatusOK {
		t.FailNow()
	}
}

// TestDefaultContact checks for a valid response from the handler.
func TestDefaultContact(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(controllers.DefaultContact))
	defer server.Close()

	if resp, err := http.DefaultClient.Get(server.URL); err != nil || resp.StatusCode != http.StatusOK {
		t.FailNow()
	}
}

// TestDefaultThankYou checks for a valid response from the handler.
func TestDefaultThankYou(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(controllers.DefaultThankYou))
	defer server.Close()

	if resp, err := http.DefaultClient.Get(server.URL); err != nil || resp.StatusCode != http.StatusOK {
		t.FailNow()
	}
}

// TestAnalyticsIndex checks for a valid response from the handler.
func TestAnalyticsIndex(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(controllers.AnalyticsIndex))
	defer server.Close()

	if resp, err := http.DefaultClient.Get(server.URL); err != nil || resp.StatusCode != http.StatusOK {
		t.FailNow()
	}
}

// TestFoodRecalls checks for a valid response from the handler.
func TestFoodRecalls(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(controllers.FoodRecalls))
	defer server.Close()

	if resp, err := http.DefaultClient.Get(server.URL); err != nil || resp.StatusCode != http.StatusOK {
		t.FailNow()
	}
}

// TestEnforcementReporting checks for a valid response from the handler.
func TestEnforcementReporting(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(controllers.EnforcementReporting))
	defer server.Close()

	if resp, err := http.DefaultClient.Get(server.URL); err != nil || resp.StatusCode != http.StatusOK {
		t.FailNow()
	}
}

// TestStaticFiles gets a static resource file. This is typically used for stylesheets, JavaScript, images, etc.
func TestStaticFiles(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(controllers.DefaultIndex))
	defer server.Close()

	url := server.URL + "/static/css/site.css"
	if resp, err := http.DefaultClient.Get(url); err != nil || resp.StatusCode != http.StatusOK {
		t.FailNow()
	}
}

// TestStaticFilesJailed tries to break out of the static directory. This should return an error and invalid
// status code (i.e. not 200) indicating to the end user the file could not be found.
func TestStaticFilesJailed(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(controllers.StaticFiles))
	defer server.Close()

	url := server.URL + "/static/../html/master.html"
	if resp, err := http.DefaultClient.Get(url); err != nil || resp.StatusCode != http.StatusNotFound {
		t.FailNow()
	}
}
