// Declare default-index script variabels
var apiKey = "xKEbXQ6J58IGdIF5JhcBiWQOfDFWjjRTYbOYtDOv";
var myColors = [ "#99ABBF", "#7eb7b0", "#e29a75"];  //#e29a75 #f5de74
d3.scale.myColors = function() {
    return d3.scale.ordinal().range(myColors);
};

/**
 *  
 */
function generateBarChart() {
  var chartdata = retrieveBarData();
  nv.addGraph(function() {
      var barchart = nv.models.multiBarChart()
        .showControls(true)
        .groupSpacing(.3)
        .color(d3.scale.myColors().range());

      barchart.xAxis.tickFormat(d3.format(',f'));
      barchart.yAxis.tickFormat(d3.format(',f'));
      d3.select('#classbarchart svg').datum(chartdata).call(barchart);

      nv.utils.windowResize(barchart.update);

      return barchart;
  });
}

/**
 *  
 */
function generateDonutChart() {
//Donut chart example
nv.addGraph(function() {
    var donutdata = retrieveDonutData();
    var donutchart = nv.models.pieChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .showLabels(true) 
        .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
        .labelType("key") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
        .donut(true)         
        .donutRatio(0.4)
        .color(d3.scale.myColors().range());     

      d3.select("#classdonutchart svg")
          .datum(donutdata)
          .transition().duration(350)
          .call(donutchart);

    return donutchart;
  });
}

/**
 * Kick of the chart data request and build the charts 
 */
$(function () {
    generateBarChart();
    generateDonutChart();
});

//Pie chart example data. Note how there is only a single array of key-value pairs.
function retrieveDonutData() {
  return  [
      { 
        "label": "Class I",
        "value" : 1300
      } , 
      { 
        "label": "Class II",
        "value" : 1760
      } , 
      { 
        "label": "Class III",
        "value" : 423
      } , 
    ];
}

// DELETE ME sample data generation

//Generate some nice data.
function retrieveBarData() {
  return stream_layers(3,5,1).map(function(data, i) {
    return {
      key: 'Class ' + i,
      values: data
    };
  });
}

function stream_layers(n, m, o) {
  if (arguments.length < 3) o = 0;
  function bump(a) {
    var x = 1 / (.1 + Math.random()),
        y = 2 * Math.random() - .5,
        z = 10 / (.1 + Math.random());
    for (var i = 0; i < m; i++) {
      var w = (i / m - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }
  return d3.range(n).map(function() {
      var a = [], i;
      for (i = 0; i < m; i++) a[i] = o + o * Math.random();
      for (i = 0; i < 5; i++) bump(a);
      return a.map(stream_index);
    });
}

/* Another layer generator using gamma distributions. */
function stream_waves(n, m) {
  return d3.range(n).map(function(i) {
    return d3.range(m).map(function(j) {
        var x = 20 * j / m - i / 3;
        return 2 * x * Math.exp(-.5 * x);
      }).map(stream_index);
    });
}

function stream_index(d, i) {
  return {x: i, y: Math.max(0, d)};
}
