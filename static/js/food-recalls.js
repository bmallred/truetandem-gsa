'use strict'

function RecallingFirmStatsModal(firm){
	var me = this;
	var apiUrl = 'https://api.fda.gov/food/enforcement.json';
	var apiKey = 'xKEbXQ6J58IGdIF5JhcBiWQOfDFWjjRTYbOYtDOv';
	var modalTemplate = Hogan.compile($('#modal_template').html(), {
		delimiters: '<% %>'
	});
    var $modal = null;
    
    this.show = function(){
    	this.getRecallStatistics().then(function(data){
	        $('#modal_container').html(modalTemplate.render({
	        	success:true,
	            firm: firm,
	            totalRecalls: data.totalRecalls,
	            recallCountsByState: data.recallCountsByState,
	            recallCountsByYear: data.recallCountsByYear
	        }));        	        	        
            me.preparePieChart(data.recallCountsByYear, '.year-recalls', 'year', 'count');
            me.prepareBarChart(data.recallCountsByState, 'Recalls by State', '.state-recalls', 'term', 'count');
	        
	        $modal = $('#modal').modal();    		
    	}, function(error){
	        $('#modal_container').html(modalTemplate.render({
	        	success:false,
	        	firm:firm
	        }));  
    		$modal = $('#modal').modal(); 
    	});
    }

    this.preparePieChart = function(data, element, xKey, yKey){
		var chart = nv.models.pieChart()
			.x(function(d) { return d[xKey] })
			.y(function(d) { return d[yKey] })			
			.showLabels(true)
			.labelType("value");
		d3.select(element)
			.datum(function(){
			return data;
		})
		.transition().duration(350)
		.call(chart);
    }

    this.prepareBarChart = function(data, title, element, xKey, yKey){	    
		var chart = nv.models.discreteBarChart()
		      .x(function(d) { return d[xKey]; })    //Specify the data accessors.
		      .y(function(d) { return d[yKey]; })
		      .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
		      .tooltips(false)        //Don't show tooltips
		      .showValues(true);       //...instead, show the bar value right on top of each bar.
		      
		  d3.select(element)
		      .datum(function(){
		      	return [{
		      		key: title,
		      		values: data
		      	}];
		      })
		      .call(chart);

		  nv.utils.windowResize(chart.update);	
    }

    this.getRecallStatistics = function(){
    	var deferred = $.Deferred();
    	var errorFunc = function(){
    		deferred.reject('Unable to query information for company: ' + firm);
    	};
    	this.getRecallDates().then(function(recallDatesResponse){
    		var recallCountsByYear = me.getRecallCountsByYear(recallDatesResponse.results);
    		var totalRecalls = 0;
    		for(var x = 0; x <recallCountsByYear.length; x++){
    			totalRecalls += recallCountsByYear[x].count;
    		}
    		me.getRecallCountsByState().then(function(recallCountsByStateResponse){
    			deferred.resolve({
    				totalRecalls: totalRecalls,
    				recallCountsByState: recallCountsByStateResponse.results,
    				recallCountsByYear: me.getRecallCountsByYear(recallDatesResponse.results)
    			});
    		}, errorFunc);
    	}, errorFunc
    	);

    	return deferred;
    }


    /**
      * Extracts recall counts and groups them by year.
     **/
    this.getRecallCountsByYear = function(recalls){
        var counts = {};
        for(var x = 0; x < recalls.length; x++){        	
        	var recallPoint = recalls[x];
        	var dateStr = recallPoint.time;
        	var recallYear = dateStr.substr(0,4);
        	if(!counts[recallYear]){
        		counts[recallYear] = recallPoint.count;
        	} else {
        		counts[recallYear] += recallPoint.count;
        	}        	
        }

        var recalls = [];
        for(var key in counts){
        	recalls.push({
        		year: key,
        		count: counts[key]
        	});
        }
        return recalls;
    }

    this.getRecallCountsByState = function(){
    	var formattedFirm = '"' + this.getFormattedFirm() + '"';
        return $.getJSON(apiUrl, {
        		search:formattedFirm, 
        		count:'state.exact',
        		'api_key': apiKey
        	}, function(response){
        	return response.results;
        })
    }

    this.getRecallDates = function(){
    	var formattedFirm = '"' + this.getFormattedFirm() + '"';
        return $.getJSON(apiUrl, {
        		search:formattedFirm, 
        		count:'report_date',
        		'api_key': apiKey
        	}, function(response){
        	return response.results;
        });
    }

    // Removes special characters in order to properly query the FDA api.
    this.getFormattedFirm = function(){
    	return firm.replace(/[^\w\s-]/gi, '');
    }
}

/**
  * Handles google map operations.
  *
  **/
function Geospatial(mapDivId){
	var map;
	var geocoder = new google.maps.Geocoder();
	// Stores all markers that are added
	var markers = []; 

	// Initializes the google map
	this.initialize = function(){
		map = new google.maps.Map(document.getElementById(mapDivId), {
			zoom: 8,
			draggable: false, 
			zoomControl: false, 
			scrollwheel: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP			
		});
	}

	/**
	  * Geocodes a plain address string. Returns a promise that is evaluated
	  * when the geocoder finishes processing the request.
	 **/
	this.geocode = function(location){
		var deferred = $.Deferred();
		geocoder.geocode( { 'address': location}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {			
				deferred.resolve(results[0]);
			} else {
				alert('Geocode was not successful for the following reason: ' + status);
			}
		});
		return deferred.promise();
	}

	/**
	  * Adds a point on the map. 
	 **/
	this.addMarker = function(geocodedResult){
		this.clearMarkers();
		var location = geocodedResult.geometry.location;

		var marker = new google.maps.Marker({
			map:map,
			position: location
		});
		map.setCenter(location);
		markers.push(marker);
	}

	/**
	  * Iterates through all markers in the array, sets the map to null in order to
	  * remove it from the actual map and then deletes it from the array
	  **/
	this.clearMarkers = function(){
		while(markers.length > 0){
			var marker = markers.pop();
			marker.setMap(null);
		}
	}

	this.getMap = function(){
		return map;
	}

	// Checks if map is loaded and instantiated
	this.mapLoaded = function(){
		return !(map == null);
	}
}

function FoodRecalls(gridEl){	
	var $table = $(gridEl);	// Reference to raw table element
	var $grid = null; // Stores the DataTable() object
	var $detailsSection = $('#details_section');
	var foodRecalls = [];
	var me = this;
	var geospatial = new Geospatial('map-canvas');
	var foodRecallApiUrl = 'https://api.fda.gov/food/enforcement.json';
	var apiKey = 'xKEbXQ6J58IGdIF5JhcBiWQOfDFWjjRTYbOYtDOv';

	var detailsTemplate = Hogan.compile($('#details_template').html(), {
		delimiters: '<% %>'
	});

	this.initialize = function(gridEl){
		this.createGrid(gridEl);
		this.configureHandlers();	
	}

	this.createGrid = function(){		
		$grid = $table.DataTable({
			"serverSide": true,		
			searching: true,	
			processing: true,
			bSort: false,
			iDisplayLength: 25,
			autoWidth: true,
			bAutoWidth: false,
			pagingType: 'full',
			fnServerData: this.processServerDataResponse,
			"columns" : [
				{data : 'recall_number'},
				{data : 'recalling_firm'},
				{data:  'classification'},
				{data : 'state'}
			]
		});
	}

	this.onRowClick = function(event){
		var data = $grid.row(this).data();
		$table.find('tr').removeClass('info');
		me.renderDetails(data);
	}

	// Configures handlers for the table
	this.configureHandlers = function(){
		$table.on('click', 'tr', this.onRowClick);
		$detailsSection.on('click', '.recalling-firm', this.showRecallingFirm);
	}
	
	this.showRecallingFirm = function(){
        var data = $(this).data('recallingFirm');
        new RecallingFirmStatsModal(data).show();
	}

	// Renders the data for a specific food recall and renders it to a template
	this.renderDetails = function(data){		
		$detailsSection.html(detailsTemplate.render(data));
		
		// Highlight table row with matching data point
		$table.find('tbody tr').each(function(){
			var curDataRow = $grid.row($(this)).data();
			if(curDataRow.recall_number == data.recall_number){
				$(this).addClass('info');
			}
		});

		if(!geospatial.mapLoaded()){
			geospatial.initialize();
		}
		var location = data.city + ' ' + data.state;
		geospatial.geocode(location).then(function(marker){			
			geospatial.addMarker(marker);
		});		
	}

	/**
	  * Handles requests when the grid is updated. The FDA API takes in different
	  * parameters from what DataTables is expecting so we manually set them
	  * here. This allows the 'Showing {x} to {y} of {x}' information to be
	  * properly displayed.
	  **/
	this.processServerDataResponse = function(source, data, callback){		
		var start = data[3].value;
		var limit = data[4].value;
		var freeSearchText = data[5].value;
		var params = {
			skip: start,
			limit: limit,
			'api_key': apiKey
		};
		if(freeSearchText && freeSearchText.value){
			params.search = '"' + freeSearchText.value + '"';
		}
		$.getJSON(foodRecallApiUrl, params, function(response){
			response.draw  = data[0].value;
			response.recordsTotal = response.meta.results.total;
			response.recordsFiltered = response.meta.results.total;
			response.data = response.results;
			callback(response)
			foodRecalls = response.results;

			if(foodRecalls && foodRecalls.length > 0){
				me.renderDetails(foodRecalls[0]);
			}
		});		
	}

	this.initialize();
}


var recalls = new FoodRecalls('#grid');