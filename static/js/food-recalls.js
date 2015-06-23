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
			searching: false,	
			iDisplayLength: 25,
			fnServerData: this.processServerDataResponse,
			"columns" : [
				{data : 'recall_number'},
				{data : 'recalling_firm'},
				{data : 'state'}
			]
		});
	}

	this.onRowClick = function(event){
		var data = $grid.row(this).data();
		$table.find('tr').removeClass('info');
		$(this).addClass('info');
		me.renderDetails(data);
	}

	// Configures handlers for the table
	this.configureHandlers = function(){
		$table.on('click', 'tr', this.onRowClick);
	}

	// Renders the data for a specific food recall and renders it to a template
	this.renderDetails = function(data){		
		$detailsSection.html(detailsTemplate.render(data));
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
		var params = {
			skip: start,
			limit: limit
		};			
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