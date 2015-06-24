package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

// TestStaticFiles gets a static resource file. This is typically used for stylesheets, JavaScript, images, etc.
func TestStaticFiles(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(DefaultIndex))
	defer server.Close()

	url := server.URL + "/static/css/site.css"
	if resp, err := http.DefaultClient.Get(url); err != nil || resp.StatusCode != http.StatusOK {
		t.FailNow()
	}
}

// TestStaticFilesJailed tries to break out of the static directory. This should return an error and invalid
// status code (i.e. not 200) indicating to the end user the file could not be found.
func TestStaticFilesJailed(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(StaticFiles))
	defer server.Close()

	url := server.URL + "/static/../html/master.html"
	if resp, err := http.DefaultClient.Get(url); err != nil || resp.StatusCode != http.StatusNotFound {
		t.FailNow()
	}
}
