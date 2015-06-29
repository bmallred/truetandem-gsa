'use strict';

// Declare default-index script variabels
var apiKey = "xKEbXQ6J58IGdIF5JhcBiWQOfDFWjjRTYbOYtDOv";
var myColors = [ "#99ABBF", "#7eb7b0", "#e29a75"];  //#e29a75 #f5de74
d3.scale.myColors = function() {
    return d3.scale.ordinal().range(myColors);
};

/**
 * Generate a stacked bar chart utilizing the nvd3 charting library
 *
 * @param {String} chartname
 * @param {Object} chartdata
 */
function generateBarChart(chartname, chartdata) {
  nv.addGraph(function() {
    var barchart = nv.models.multiBarChart()
      .showControls(true)
      .stacked(false)
      .groupSpacing(.3)
      .color(d3.scale.myColors().range());

    barchart.yAxis.tickFormat(d3.format(',f'));
    d3.select('#'+chartname+' svg').datum(chartdata).call(barchart);

    nv.utils.windowResize(chartname.update);
    return barchart;
  });
}

/**
 * Generate a pie chart utilizing the nvd3 charting library
 *
 * @param {String} chartname
 * @param {Object} chartdata
 */
function generateDonutChart(chartname, chartdata) {
  nv.addGraph(function() {
    var donutchart = nv.models.pieChart()
      .x(function(d) { return d.label })
      .y(function(d) { return d.value })
      .showLabels(true) 
      .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
      .labelType("key") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
      .donut(true)         
      .donutRatio(0.4)
      .color(d3.scale.myColors().range());     

    d3.select("#"+chartname+" svg")
        .datum(chartdata)
        .transition().duration(350)
        .call(donutchart);

    return donutchart;
  });
}

/**
 * Kick of the chart data request and build the charts 
 */
$(function () {
    retrieveChartData();
    retrieveDonutChart2Data();
});

/**
 * Retrieves data via the FDA API and proceeds to format the data
 * for the chart presentation layer, then generates the charts. 
 */
function retrieveChartData() {
  /**
   * Calls the FDA REST web service API to obtain the request data sets.
   * Results will contain a time and a count of reports meeting the requested
   * classification: Class I, Class II, or Class III
   */
  var getReportCounts = function(clscode){
    var url="https://api.fda.gov/food/enforcement.json?search=classification:Class%20"+clscode+"&count=report_date&api_key="+apiKey;
    return $.get(url, "", null, "json");
  }

  /**
   * Execute the asynchronous web service calls and wait for all to 
   * complete, so the data can be accurately aggregated.
   */
  $.when( getReportCounts("I"),
          getReportCounts("II"),
          getReportCounts("III")
        ).done(function(classIReports, classIIReports, classIIIReports) {
           // build the values
           var val1 = parseFDAResult(classIReports[0].results);
           var val2 = parseFDAResult(classIIReports[0].results);
           var val3 = parseFDAResult(classIIIReports[0].results);

           // construct the data set for the charts
           var classdat = [
               {
                  "key"   : "Class I" ,
                  "values": val1
               } ,
               {
                  "key"   : "Class II",
                  "values": val2
               },
               {
                  "key"   : "Class III",
                  "values": val3
               } 
           ];

        // Initiate the bar chart
        generateBarChart("classbarchart", classdat);

        // Initiate the donut chart that leverages the same data as the bar chart
        retrieveDonutChart1Data(val1, val2, val3); 
  });
}

/**
 * Format data into expected format for the chart controls.
 * The charts expect an array of [year, count] arrays:
 * 
 *   For example: 
 *   [ [2012, 100], [2013, 200], [2014, 300] ]
 *
 * @param {Object} results
 */
function parseFDAResult(results) {
  var parsedresult = [];
  var items = [0,0,0,0,0,0,0,0,0,0];
  for (var i = 0; i < results.length; i++) {
    var year = results[i].time;
    var idx = parseInt(year.substring(3,4));
    var countx = parseInt(results[i].count);
    items [idx] += countx;    
  }
  for (var j = 0; j < items.length; j++) {
    if (items[j] > 0) {
      var item = {};
      item.x = (2010 + j).toString();
      item.y = items[j];
      parsedresult.push(item);
    }
  }
  
  return parsedresult;
}


/**
 * Generate a pie chart to reflect the FDA enforcement report
 * classification breakdown.  Will reflect all reports for the 
 * current year broken down by classification.
 *
 * @param {Object} class1
 * @param {Object} class2
 * @param {Object} class3 
 */
function retrieveDonutChart1Data(class1, class2, class3) {
  var classIdat   = parseClassCount(class1);
  var classIIdat  = parseClassCount(class2);
  var classIIIdat = parseClassCount(class3);
  
  // aggregate results and update the total marker on the page
  var total = classIdat + classIIdat + classIIIdat;
  var year = parseCurrentYear(classIdat);
  updatePieDescription(total,year);

  var donutData =[
      { 
        "label": "Class I",
        "value" : classIdat
      } , 
      { 
        "label": "Class II",
        "value" : classIIdat
      } , 
      { 
        "label": "Class III",
        "value" : classIIIdat
      } , 
    ];
    generateDonutChart("classdonutchart1", donutData); 
}

/**
 * Retrieve Pie chart data from the FDA query results
 * to determine the count of records for the current year. 
 *
 * @param {Object} classdata
 */
function parseClassCount(classdata) {
  var result = 0;
  if (classdata.length > 0) {
    result = classdata[classdata.length-1].y;
  }
  return result;
}

/**
 * Retrieve Pie chart data from the FDA query results
 * to determine the current year in the results. 
 *
 * @param {Object} classdata
 */
function parseCurrentYear(classdata) {
  var result = 0;
  if (classdata.length > 0) {
    result = classdata[classdata.length-1].x;
  }
  return result;
}

/**
 * Retrieve Pie chart data from the FDA query results. 
 *
 * @param {Integer} total
 * @param {Integer} year
 */
function updatePieDescription(total, year) {
  $("#rptpiecount").text(total);
  $("#rptcuryear span").text(year);
  $("#rptcuryearHdr h4").text(year);
}

/**
 * Pie chart sample data
 */
function retrieveDonutChart2Data() {
  /**
   * Calls the FDA REST web service API to obtain the request data sets.
   * Results will contain a status and a count of reports by status
   */
  var getStatusCounts = function(){
    var today = new Date();
    var year  = today.getFullYear();
    var date  = ("0" + today.getDate()).slice(-2);
    var month = ("0" + (today.getMonth()+1)).slice(-2);
    var url="https://api.fda.gov/food/enforcement.json?search=report_date:["
          + year + "0101+TO+"
          + year + month + date +"]"
          + "&count=status&api_key="
          + apiKey;
    return $.get(url, "", null, "json");
  }

  /**
   * Execute service call
   */
  $.when( getStatusCounts()
        ).done(function(statusReports) {
          var results = statusReports.results;
          var donutData = [];
          for(var i = 0; i < results.length; i++) {
            var item = {};
            item.label = results[i].term;
            item.value = results[i].count;
            donutData.push(item);
          }

          // generate the donut chart with the dataset
          generateDonutChart("classdonutchart2", donutData);
  });
}