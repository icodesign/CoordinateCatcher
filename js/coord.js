$(document).ready(function(){
var initialLocation;
var cn= new google.maps.LatLng(38.479395,106.509705 );
var browserSupportFlag =  new Boolean();
var map;
var coord;
var address;
var geocoder;
function init(){
  coord = $("#coord");
  address = $("#address");
  var map_canvas = $("#map_canvas").get(0);
  var myOptions = {
    zoom: 4,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map =  new google.maps.Map(map_canvas, myOptions);
  geocoder = new google.maps.Geocoder();
  locate();
  addAutoComplete();
  showCoordinate();
  showCoordinateOnMap();
}
function addAutoComplete(){
  var input = $("#search").get(0);
  var options = {
  bounds: map.getBounds(),
  types: ['establishment']
};
  autocomplete = new google.maps.places.Autocomplete(input, options);
  autocomplete.bindTo('bounds', map);
}
function showCoordinateOnMap(){
  var coordControlDiv = document.createElement('DIV');
  var coordControl = new CoordControl(coordControlDiv, map);
  coordControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(coordControlDiv);
}
function CoordControl(controlDiv, map) {
  controlDiv.style.padding = '5px';
  var controlUI = document.createElement('DIV');
  controlUI.style.backgroundColor = 'white';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Show Coordinate when mouse moves...';
  controlDiv.appendChild(controlUI);

  var controlText = document.createElement('DIV');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';
  controlUI.appendChild(controlText);
  google.maps.event.addListener(map,'mousemove',function(event){
    console.log(event.latLng);
    controlText.innerHTML = event.latLng.lat()+","+event.latLng.lng() ;
});

}
function showCoordinate(){
  google.maps.event.addListener(map,'click',function(event){
    updateCoord(event.latLng);
});
}
function updateCoord(latLng){
    coord.html("("+latLng.lat()+","+latLng.lng()+")");
updateAddress(latLng);
}
function updateAddress(latLng){
  geocoder.geocode({'latLng': latLng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
	  address.html(results[0].formatted_address);
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
}
function locate(){
if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      map.setCenter(initialLocation);
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  // Try Google Gears Geolocation
  } else if (google.gears) {
    browserSupportFlag = true;
    var geo = google.gears.factory.create('beta.geolocation');
    geo.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.latitude,position.longitude);
      map.setCenter(initialLocation);
    }, function() {
      handleNoGeoLocation(browserSupportFlag);
    });
  // Browser doesn't support Geolocation
  } else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  }
  
  function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
      initialLocation = cn;
    } else {
      initialLocation = cn;
    }
    map.setCenter(initialLocation);
  }

}
$("#searchbtn").click(function(){
  search();  
});
$("#search").keydown(function(e){
  if (e.which == 13)
    search();
});
function search(){
  var value=$("#search").val();
  geocoder.geocode({'address':value}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
	map.setZoom(15);
	updateCoord(results[0].geometry.location);
        
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    }); 
}
init();

});
