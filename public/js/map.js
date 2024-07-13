// Initialize the map
var map = L.map('map').setView([51.505, -0.09], 13);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Add the geocoding control to the map (optional, for user input)
var geocoderControl = L.Control.geocoder({
  defaultMarkGeocode: false
}).addTo(map);

function hideGeocoderControl() {
      var geocoderContainer = document.querySelector('.leaflet-control-geocoder.leaflet-control');
      if (geocoderContainer) {
        geocoderContainer.style.display = 'none';
      }
    }
    
// Store the place in a variable
var placeToGeocode = myPlace;

// Function to geocode and show the place on the map
function showPlace(place) {
  var geocoder = L.Control.Geocoder.nominatim(); // Using Nominatim for geocoding
  geocoder.geocode(place, function(results) {
    if (results && results.length > 0) {
      var latlng = results[0].center;
      var name = results[0].name;
      var coordinates = `Latitude: ${latlng.lat}, Longitude: ${latlng.lng}`;

      L.marker(latlng).addTo(map)
        .bindPopup(`${name}<br>${coordinates}`)
        .openPopup();
      map.setView(latlng, 16);
    } else {
      console.log("Place not found!");
    }
  });
}

// Call the function to show the place on the map
showPlace(placeToGeocode);
