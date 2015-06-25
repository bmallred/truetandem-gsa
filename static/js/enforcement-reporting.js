// Declare enforcement-reporting script variabels
var classdat = [];
var stackchart;
var linechart;
var lineChartShown = false;
var myColors = [ "#e29a75", "#7eb7b0", "#f5de74"];  //"#99ABBF"
d3.scale.myColors = function() {
    return d3.scale.ordinal().range(myColors);
}; 

/**
 * Retrieving the data and build\populate the corresponding chart(s)
 */
function retrieveFDAData() {

  /**
   * Calls the FDA REST web service API to obtain the request data sets.
   * Results will contain a time and a count of reports meeting the requested
   * classification: Class I, Class II, or Class III
   */
  var getReportCounts = function(classification){
    var url="https://api.fda.gov/food/enforcement.json?search=classification:" + classification + "&count=report_date";
    return $.get(url, "", null, "json");
  }

  /**
   * Execute the asynchronous web service calls and wait for all to 
   * complete, so the data can be accurately aggregated.
   */
  $.when( getReportCounts("Class%20I"),
          getReportCounts("Class%20II"),
          getReportCounts("Class%20III")
        ).done(function(classIReports, classIIReports, classIIIReports) {
           // build the values
      	   var val1 = parseFDAResult(classIReports[0].results);
      	   var val2 = parseFDAResult(classIIReports[0].results);
       	   var val3 = parseFDAResult(classIIIReports[0].results);

      	   // data set consistency check required to ensure all series have values for same dates
           val2 = consistencyCheck(val1, val2);            
      	   val3 = consistencyCheck(val1, val3); 

      	   // construct the data set for the charts
           classdat = [
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

          // Initiate the stacked area chart first.  The line chart lazy loads.
  	      createStackedChart("stackedchart", classdat);
    });
}

/**
 * Format data into expected format for the chart controls.
 * The charts expect an array of [time, count] arrays:
 * 
 *   For example: 
 *   [ [123456789, 23], [123459876, 2], [133359336, 5] ]
 *
 * @param {Object} master
 */
function parseFDAResult(results) {
  var parsedresult = [];
  for (i = 0; i < results.length; i++) {
    timex = results[i].time;
    timex = new Date(timex.substring(0,4)+" "+timex.substring(4,6)+" "+timex.substring(6,8)).getTime();
    countx = results[i].count;
    item = [];
    item.push(timex);
    item.push(countx);
    parsedresult.push(item);
  }
  return parsedresult;
}
 
/**
 * Compare list of report dates to a master list of dates to
 * ensure each item in the series contains a date.  The series
 * charts will not work unless every group has a number for
 * every report date.  
 *
 * @param {Object} master
 * @param {Object} checkAry
 */ 
function consistencyCheck(master, checkAry) {
  var newAry = [];
  for (i = 0; i < master.length; i++) {
    rpt_date = master[i][0];
    count = 0;
    for (j = 0; j < checkAry.length; j++) {
      if (rpt_date == checkAry[j][0]) {
         count = checkAry[j][1];
         break;
      } 
    }
    item = [];
    item.push(rpt_date);
    item.push(count);
    newAry.push(item);
  }
  return newAry;
}
  
/**
 * Generates a stacked area chart which provides an aggregated view 
 * of all the series data, and allows filtering down to specific 
 * series values.
 *
 * Utilizes the FDA food recall reports data module, presents the user
 * with a view to report data grouped by classification (Class I, II, III) 
 *
 * @param {Object} container
 * @param {Object} data
 */   
function createStackedChart(container, data) {
  nv.addGraph(function() {
    stackchart = nv.models.stackedAreaChart()
                  .useInteractiveGuideline(true)
                  .x(function(d) { return d[0] })
                  .y(function(d) { return d[1] })
                  .color(d3.scale.myColors().range());

    stackchart.yAxis.tickFormat(d3.format(",.0f"));
    stackchart.xAxis.tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });
    d3.select('#' + container + ' svg').datum(data).attr("font-family", "Segoe UI").attr("font-size", "10px").attr("font-weight", "lighter").attr("fill","#333333").transition().duration(750).call(stackchart);
    nv.utils.windowResize(stackchart.update);
    return stackchart;
  });
}
   
/**
 * Generates a line chart with a focus/selection slider to zoom in 
 * on a specific time period represented in the graph.  The chart 
 * will be hidden at first, and users will toggle to it.
 *
 * @param {Object} container
 * @param {Object} data
 */
function createLineChart(container, data) {
    nv.addGraph(function() {
      var linechart = nv.models.lineWithFocusChart()
                  .x(function(d) { return d[0] })
                  .y(function(d) { return d[1] })
                  .color(d3.scale.myColors().range());
 
      linechart.xAxis.tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });
      linechart.x2Axis.tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });
      linechart.yAxis.tickFormat(d3.format(',.0f'));
      linechart.y2Axis.tickFormat(d3.format(',.0f'));
      d3.select('#' + container + ' svg').datum(data).attr("font-family", "Segoe UI").attr("font-size", "10px").attr("font-weight", "lighter").attr("fill","#333333").call(linechart);
      nv.utils.windowResize(linechart.update);
      lineChartShown = true;
      return linechart;
    });
}
 
/**
 * Creates the toggle logic for swithing between the stacked area
 * and the line charts. 
 */
$(document).ready(function(){
  $("#stackedImage").click(function(){
     if (lineChartShown) {
         $("#linefocuschart").fadeOut();
     }
     $("#stackedchart").fadeIn();
  });
  $("#lineImage").click(function(){
     $("#stackedchart").fadeOut();
     if (!lineChartShown) {
       $("#linefocuschart").fadeIn();
       createLineChart("linefocuschart", classdat);
     } else {
       $("#linefocuschart").fadeIn();
     }
  });
});

/**
 * Kick of the chart data request and build the charts 
 */
$(function () {
    retrieveFDAData();
});