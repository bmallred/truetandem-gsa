[![wercker status](https://app.wercker.com/status/c1942ac27ed4ef01fabdfc5b49426e8b/m "wercker status")](https://app.wercker.com/project/bykey/c1942ac27ed4ef01fabdfc5b49426e8b)

# GSA Prototype

## Installation

This application is written in [Go](https://golang.org). For installation instructions of the core programming language please reference the [Getting Started](https://golang.org/doc/install) documentation. After setting up the environment run the following command:

```
go get github.com/bmallred/truetandem-gsa
```

Then you may build and run from new directory:

```
cd $GOPATH/src/github.com/bmallred/truetandem-gsa; go build; ./truetandem-gsa
```

## Running the tests

```
go test
```

## Deployment as a standalone package

From the command line:

```
go build
go run ./bundle/bundle.go truetandem-gsa html static
```

This will create ```bundle.zip``` in the current directory. Just unzip the file contents to the final destinition and run the compiled program ```./truetandem-gsa```.

## Deployment to Google App Engine

Download the [Google App Engine SDK](https://cloud.google.com/appengine/downloads) for the appropriate platform and perform the installation steps found on the same page. Once this is completed you may either serve the content locally for debugging with:

```
goapp serve
```

Before deploying to Google App Engine make sure the [app.yaml](https://github.com/bmallred/truetandem-gsa/blob/master/app.yaml) file is properly configure. Then execute the following command:

```
goapp deploy
```
