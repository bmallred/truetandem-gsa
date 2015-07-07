[![wercker status](https://app.wercker.com/status/c1942ac27ed4ef01fabdfc5b49426e8b/m "wercker status")](https://app.wercker.com/project/bykey/c1942ac27ed4ef01fabdfc5b49426e8b)

Prototype Site Link: [https://truetandem-gsa.appspot.com](https://truetandem-gsa.appspot.com)

# 1 Technical Approach Description
TrueTandem – Federal is structured as an Agile Scrum Organization. It is headed by a MetaScrum that is composed of professionals in the corporate roles of: Senior Vice President-- Certified Scrum Master (CSM) and MetaScrum Chair, Development Team Lead (CSM), V of Operations (Product Owner Lead), and Director of Quality Assurance. TrueTandem leverages Agile Scrum, Extreme Programming (XP), and Kanban work/defect management methodologies in delivering agile software development projects.

## 1.1 Capability Assessment
Upon the release of the GSA ADS RFQ, TrueTandem’s MetaScrum Chair—Mr. David Tilghman (CSM)—called a MetaScrum meeting together to make a bid / no-bid decision in regards to said RFQ. The central question: Can TrueTandem meet the government’s requirements? 70% of TrueTandem’s portfolio consists of agile software development projects, and 100% of the firm’s developers have experience with open-source languages and tools. Thus, the MetaScrum decided that TrueTandem had the technical capability and budget to respond to the GSA ADS RFQ and build the required prototype. Given time and resource restrictions, it was decided that the firm would focus on Pool 3 of the RFQ. 

## 1.2 Product Owner (Manager) & Scrum Team Assigned
As the key business decision maker, Mr. Tilghman assigned himself the **Product Manager** (PM) of the GSA ADS Prototype. TrueTandem’s Federal Development Team Lead, Mr. Paul Summers (CSM), was assigned as **Technical Architect** (TA) for the prototype project, and he then selected the following Scrum Team members, based on the prototype requirements:

* Mr. Jay Neighbors – **Writer/Content Designer/Content Strategist**
* Ms. Ashley Anderson – **Visual Designer**
* Mr. John Flores – **Front End Web Developer**
* Mr. Bryan Allred – **Backend Web Developer**

See ***Attachment E, Criteria # a and b*** for further details. 

## 1.3 Product Inputs & User Stories
TrueTandem’s MetaScrum Team assigned three of its sales executives to act as executives, stakeholders, customers, and users of the prototype system. The Scrum Team reviewed the [https://open.fda.gov](https://open.fda.gov) site and the available APIs with the Stakeholder Team. The Stakeholder Team then provided a list of potential features / functional requirements for the prototype, based on the data sources available. The Stakeholder Team decided that it would like to see several analytical reports / dashboards on FDA Food Recalls, Enforcement Reporting, and Adverse Events. 

After requirements gathering was completed, the PM worked with the Scrum and Stakeholder Teams to develop a series of User Stories and User Acceptance Test (UAT) cases to define the functions that the prototype system must provide.

See ***Attachment E, Criteria # c*** for further details.

## 1.4 Product Backlog Creation
Once the User Stories were completed, the PM worked with the Scrum Team to develop, refine and rank the Prototype Product Backlog items.

## 1.5 Sprint Planning
Given the original RFQ schedule, the team decided to stick to a 1-week sprint cycle for prototype development, in spite of the solicitation extensions. We felt that it was important that the GSA see what our team could have delivered against the original procurement schedule. Thus, during sprint planning, the Scrum Team selected the priority backlog items and estimated how much work could be accomplished within the planned sprint cycle. The PM then coordinated with the Stakeholder Team to confirm their availability and commitment to the “human centered design” and UAT requirements described in ***Attachment E.***. Since the planned Sprint Cycle was 1-week, the PM and TA limited the Sprint Planning meeting to 1 hour.

## 1.6 Sprint Backlog Creation 
Once the Scrum Team’s work estimate was completed, and the Stakeholder Team committed to fully participate in the process, the PM approved the Sprint Backlog. The team’s Product / Sprint Backlogs (User Stories, Features, Tasks, Bugs, etc.) were managed within a free version of Microsoft’s Visual Studio Team Foundation Server (TFS) Online. See ***Attachment E, Criteria # q*** for more details.

## 1.7 Sprint Execution 
### 1.7.1 Prototype Development 
Once the general vision of the prototype website had been formulated, the developers quickly chose the platforms and tools (Ubuntu workstations; Go programming language; GoSublime IDE; GitHub public central code repository; Wercker build platform; App Engine hosting platform, VisualStudio online for sprint management) of choice, while the designers were at work on wire-framing the concepts discussed by the team. When the wireframes were completed, they were reviewed by the Stakeholder Team and approved by the PM. The development team created the truetandem-gsa GitHub project repository, and provisioned their development virtual machines for Go development, while the wireframes were reviewed. Upon wireframe approval, developers started developing the site.

Using the wireframes as a guide the developers set out to building the site information hierarchy and navigation patterns. The designers created sample style outputs, which were reviewed by the stakeholders and approved by PM. With the selected style, the designers created comprehensive design concepts for each of the webpages, and provided them to the

developers for guidance. While the developers created markup and base styles using the comps as guidance, the designers worked on more advanced CSS to complete the layout, graphics, and styles for the final design.

When creating new functionality for the site, developers\designers would create a new code branch off of the GitHub master branch, name the branch for the feature they were implementing, and pull the code into their local repository. Developers\designers would work from their local git repository and commit/push changes up to the GitHub branch when desired. Developers would perform functional testing and write Unit Tests for backend code, when applicable. When a feature was completed and verified by the developer, the code was merged into the master code branch, upon which a Wercker build would start automatically. The Wercker build would get the latest code from the GitHub master branch, execute the Go guild, execute the Go unit test cases, and generated a test result report. If the build and test cases were successful, the Scrum Team member who requested the build would be required to deploy the build to the Google App Engine, where the new code would be accessible to the testers. If the build had failed, the developer with offending code would fix the issue, then re-issue a build. Testers were notified when a new build was ready on App Engine, instructed on the build contents by the developer releasing the build, and then they would test the new feature(s). Issues were reported the following morning during the User test review meeting following the daily Scrum meeting.

The daily development sprint rhythm involved a lot of interaction between developers and stakeholders to ensure the work being produced was on target with the PM’s vision. Each morning during the development sprint the TA facilitated a daily Scrum meeting where team members would provide an update on what they did yesterday, what they plan on doing today, and citing any impediments to progress that required assistance. After the daily meeting, developers would work closely with testers (the stakeholders and PM) to review the previous day’s work. Users would provide feedback on the items they tested and request changes. The PM served as the ultimate arbiter of which changes were accepted.

### 1.7.2 Prototype Deployment 
The truetandem-gsa website is written in [Go](https://golang.org). For installation instructions of the core programming language please reference the [Getting Started](https://golang.org/doc/install) documentation. After setting up the environment run the following command:

```
go get github.com/bmallred/truetandem-gsa
```

Then you may build and run from new directory:

```
cd $GOPATH/src/github.com/bmallred/truetandem-gsa; go build; ./truetandem-gsa
```

Run the Unit Tests

```
go test
```

To deploy the solution as a standalone package, execute the following from the command line:

```
go build
go run ./bundle/bundle.go truetandem-gsa html static
```

This will create bundle.zip in the current directory. Unzip the file contents to the final destination and run the compiled program ./truetandem-gsa .

Deploy to the Google App Engine

Download the [Google App Engine SDK](https://cloud.google.com/appengine/downloads) for the appropriate platform and perform the installation steps found on the same page. Once this is completed you may either serve the content locally for debugging with:

```
goapp serve
```

Before deploying to Google App Engine make sure the app.yaml file is properly configure. Then execute the following command:

```
goapp deploy 
```

## 1.8 Sprint Review & Retrospective
On the final day of the 1-week sprint cycle, the TA scheduled a 1-hour Sprint Review meeting. At the conclusion of the Sprint Review, TrueTandem’s PM formally accepted the prototype and concluded the Sprint Review meeting. The PM and Stakeholder Team then left the Scrum Team alone in order to allow the TA / CSM to conduct a 45 minute Sprint Retrospective.

# 2 U.S. Digital Services Playbook Evidence
TrueTandem’s demonstration of evidence that it followed the U.S Digital Services Playbook is fully catalogued in Attachment E of the GSA ADS RFQ. Within ***Attachment E***, TrueTandem provides detailed explanations and repository links that demonstrate our compliance to said playbook throughout the duration of the GSA Prototype development effort.

# Application Screenshots
## Homepage
![tt_homepage](https://cloud.githubusercontent.com/assets/5938731/8382864/ea715214-1c03-11e5-9097-efdaa7247033.png)
![selection_019](https://cloud.githubusercontent.com/assets/5938731/8382951/907a5bb0-1c04-11e5-806b-057c130390ce.png)
![selection_020](https://cloud.githubusercontent.com/assets/5938731/8382952/93dff68e-1c04-11e5-9c43-21ed5aa347a9.png)


## Food Recalls
![tt_food_recalls](https://cloud.githubusercontent.com/assets/5938731/8382861/ea709e6e-1c03-11e5-860d-620a4d4bbf49.png)
![tt_food_recalls_charts](https://cloud.githubusercontent.com/assets/5938731/8382862/ea70b0f2-1c03-11e5-985e-3faa7536c80c.png)

## Enforcement Reporting
![tt_enforcement_reporting_stacked_chart](https://cloud.githubusercontent.com/assets/5938731/8382865/ea716b96-1c03-11e5-87df-dd390dbad6f9.png)
![tt_enforcement_reporting_stream_chart](https://cloud.githubusercontent.com/assets/5938731/8382860/ea704d74-1c03-11e5-8a44-f6484bed3cb6.png)

## Adverse Events
![tt_adverse_events](https://cloud.githubusercontent.com/assets/5938731/8382863/ea713838-1c03-11e5-8fd8-6e0a7effbe2c.png)

