function planTrip() {
    window.location.href = "Planning2.html";
}

// Function to truncate text to a maximum length and add ellipsis
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    } else {
        return text;
    }
}

// API function
function getYear(year) {
	if(year) {
		return year.match(/[\d]{4}/); // This is regex (https://en.wikipedia.org/wiki/Regular_expression)
	}
}

function iterateRecords(data) {

	console.log(data);

	// Setup the map as per the Leaflet instructions:
	// https://leafletjs.com/examples/quick-start/

	
	var myMap = L.map("map").setView([-21, 148], 4);
	
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidXFpZHJ1Z28iLCJhIjoiY2tlcDdmbDV2MDc2ZjJ4bnk5bTgwcmkwbSJ9.aiKl3J-I-lVcj0iTllZlpg", {
  attribution: 'Map data © href="https://www.openstreetmap.org/">OpenStreetMap contributors, href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA, Imagery © href="https://www.mapbox.com/">Mapbox',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'your.mapbox.access.token'
 }).addTo(myMap);
	// Iterate over each record and add a marker using the Latitude field (also containing longitude)
	$.each(data.result.records, function(recordID, recordValue) {

        // Check if spatial data (location) exists
        var spatialData = recordValue["dcterms:spatial"];
        var mapTitle = recordValue["dc:title"];
        var mapImage = recordValue["150_pixel_jpg"];
        var mapImageLarge = recordValue["1000_pixel_jpg"];
        var mapDescription = recordValue["dc:description"];
        var mapYear = recordValue["dcterms:temporal"];
        var truncatedDescription = truncateText(mapDescription, 200);

        if(spatialData) {
            // Extract latitude and longitude from the spatial data
            var spatialParts = spatialData.split(";");
            if(spatialParts.length > 1) {
                var latLong = spatialParts[1].trim().split(",");
                var lat = parseFloat(latLong[0].trim());   // Latitude
                var long = parseFloat(latLong[1].trim());  // Longitude
    
                // Ensure lat and long are valid numbers
                if (!isNaN(lat) && !isNaN(long)) {
                    // Position the marker and add to map
                    var marker = L.marker([lat, long]).addTo(myMap);
    
                    // Prepare popup text
                    var popupText = "Location: " + spatialParts[0] + "<br>" +
                        "Date: " + recordValue["dcterms:temporal"] + "<br>";
                    
                    // Bind the popup to the marker
                    marker.bindPopup(popupText).openPopup();
                }
            }
        }

        if(mapTitle && mapImage && mapDescription && mapYear) {
            // Update the h4 element with the title
            // Find the corresponding card using data-id attribute
            var card = $('.plan-card[data-id="' + (recordID + 1) + '"]');

            // Update the h4 element with the title
            card.find('h4').text(mapTitle);
            
            // Update the p element with the description
            var descriptionElement = card.find('p').first();
            descriptionElement.text(truncatedDescription);

            
            
            // card.find('br').first().after('<img src="' + mapImage + '" alt="Map Image">');
            card.find('br').first().after(
                $('<a>').attr("href", mapImageLarge).addClass("strip").append(
                    $('<img>').attr("src", mapImage).attr("alt", "Map Image")
                )
            );
            
            
        }
    });


    // After the records are populated, add click event listeners to the plan cards
    const planCards = document.querySelectorAll('.plan-card');
    planCards.forEach(function (card) {
        card.addEventListener('click', function () {
            // If the clicked card is already selected, remove the selected class and reset the color
            if (card.classList.contains('selected')) {
                card.classList.remove('selected');
            } else {
                // Remove 'selected' class from all cards
                planCards.forEach(function(c) {
                    c.classList.remove('selected');
                });

                // Add 'selected' class to the clicked card
                card.classList.add('selected');
            }

            // Get the title from the clicked card
            var cardTitle = card.querySelector('h4').textContent;

            // Find the corresponding record by title
            var recordValue = data.result.records.find(function (record) {
                return record["dc:title"] === cardTitle;
            });

            // If a matching record is found, extract spatial data and update the map
            if (recordValue) {
                var spatialData = recordValue["dcterms:spatial"];
                if (spatialData) {
                    var spatialParts = spatialData.split(";");
                    if (spatialParts.length > 1) {
                        var latLong = spatialParts[1].trim().split(",");
                        var lat = parseFloat(latLong[0].trim());   // Latitude
                        var long = parseFloat(latLong[1].trim());  // Longitude

                        // Ensure lat and long are valid numbers
                        if (!isNaN(lat) && !isNaN(long)) {
                            // Move the map to the clicked card's marker position
                            myMap.setView([lat, long], 8);

                            // Add a popup at the marker's location
                            L.popup()
                                .setLatLng([lat, long])
                                .setContent("Location: " + spatialParts[0] + "<br>Date: " + recordValue["dcterms:temporal"])
                                .openOn(myMap);
                        }
                    }
                }
            } else {
                console.error("No matching record found for title: ", cardTitle);
            }
        });
    });

}



$(document).ready(function() {

    var data = {
        resource_id: '22bd64b9-1c7b-4a30-9dff-cc86227632a8', // the resource id
        limit: 100
    }

    $.ajax({
    url: 'https://www.data.qld.gov.au/api/3/action/datastore_search',
    data: data,
    dataType: 'jsonp',
    cache: true,
    success: function(data) {
        iterateRecords(data);
    }
    });
}); 

