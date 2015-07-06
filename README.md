[![wercker status](https://app.wercker.com/status/c1942ac27ed4ef01fabdfc5b49426e8b/m "wercker status")](https://app.wercker.com/project/bykey/c1942ac27ed4ef01fabdfc5b49426e8b)

# GSA Prototype
See the application in action:   [https://truetandem-gsa.appspot.com](https://truetandem-gsa.appspot.com)

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

## Application Screenshots
### Homepage
![tt_homepage](https://cloud.githubusercontent.com/assets/5938731/8382864/ea715214-1c03-11e5-9097-efdaa7247033.png)
![selection_019](https://cloud.githubusercontent.com/assets/5938731/8382951/907a5bb0-1c04-11e5-806b-057c130390ce.png)
![selection_020](https://cloud.githubusercontent.com/assets/5938731/8382952/93dff68e-1c04-11e5-9c43-21ed5aa347a9.png)


### Food Recalls
![tt_food_recalls](https://cloud.githubusercontent.com/assets/5938731/8382861/ea709e6e-1c03-11e5-860d-620a4d4bbf49.png)
![tt_food_recalls_charts](https://cloud.githubusercontent.com/assets/5938731/8382862/ea70b0f2-1c03-11e5-985e-3faa7536c80c.png)

### Enforcement Reporting
![tt_enforcement_reporting_stacked_chart](https://cloud.githubusercontent.com/assets/5938731/8382865/ea716b96-1c03-11e5-87df-dd390dbad6f9.png)
![tt_enforcement_reporting_stream_chart](https://cloud.githubusercontent.com/assets/5938731/8382860/ea704d74-1c03-11e5-8a44-f6484bed3cb6.png)

### Adverse Events
![tt_adverse_events](https://cloud.githubusercontent.com/assets/5938731/8382863/ea713838-1c03-11e5-8fd8-6e0a7effbe2c.png)

