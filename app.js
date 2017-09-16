//A global map variable has been declared.
var map;
//initial function called when google maps key loads
function initMap() {
    //call for our knockout view model
    ko.applyBindings(ViewModel());
}
//function called if map does not load
function errorocc() {
    document.getElementById('map').innerHTML = "MAP LOAD FAILED";
};
//array containing all the information
locations = [{
        title: 'Underdoggs Sports Bar&Grill Cafe',
        location: {
            lat: 30.7053524,
            lng: 76.8006132
        },
        description: "Underdoggs Sports Bar&Grill Cafe",
        id: "517507b58302ef6df49dc380",
        list: true
    },
    {
        title: 'Barbeque Nation',
        selection: false,
        location: {
            lat: 30.7260,
            lng: 76.8053
        },
        description: "Barbeque Nation",
        id: "4bbf61eef353d13a29837e10",
        list: true

    },
    {
        title: 'Nik bakers',
        location: {
            lat: 30.7215,
            lng: 76.7602
        },
        description: "Nik bakers",
        id: "4bd6f81229eb9c7429e295e1",
        list: true
    },
    {
        title: 'jw marriott',
        location: {
            lat: 30.7267,
            lng: 76.7671
        },
        description: "jw marriott",
        id: "4dff0926d4c00c69c14b292a",
        list: true
    },
    {
        title: 'Willow Cafe',
        location: {
            lat: 30.7548,
            lng: 76.7876
        },
        description: "Willow Cafe",
        id: "4c09187a7e3fc928b451f182",
        list: true

    }
];
//Styling the map using styles array
var styles = [{
        "elementType": 'geometry',
        "stylers": [{
            "color": '#242f3e'
        }]
    },
    {
        "elementType": 'labels.text.stroke',
        "stylers": [{
            "color": '#242f3e'
        }]
    },
    {
        "elementType": 'labels.text.fill',
        "stylers": [{
            "color": '#746855'
        }]
    },
    {
        "featureType": 'administrative.locality',
        "elementType": 'labels.text.fill',
        "stylers": [{
            "color": '#d59563'
        }]
    },
    {
        "featureType": 'poi',
        "elementType": 'labels.text.fill',
        "stylers": [{
            "color": '#d59563'
        }]
    },
    {
        "featureType": 'poi.park',
        "elementType": 'geometry',
        "stylers": [{
            "color": '#263c3f'
        }]
    },
    {
        "featureType": 'poi.park',
        "elementType": 'labels.text.fill',
        "stylers": [{
            "color": '#6b9a76'
        }]
    },
    {
        "featureType": 'road',
        "elementType": 'geometry',
        "stylers": [{
            "color": '#38414e'
        }]
    },
    {
        "featureType": 'road',
        "elementType": 'geometry.stroke',
        "stylers": [{
            "color": '#212a37'
        }]
    },
    {
        "featureType": 'road',
        "elementType": 'labels.text.fill',
        "stylers": [{
            "color": '#9ca5b3'
        }]
    },
    {
        "featureType": 'road.highway',
        "elementType": 'geometry',
        "stylers": [{
            "color": '#746855'
        }]
    },
    {
        "featureType": 'road.highway',
        "elementType": 'geometry.stroke',
        "stylers": [{
            "color": '#1f2835'
        }]
    },
    {
        "featureType": 'road.highway',
        "elementType": 'labels.text.fill',
        "stylers": [{
            "color": '#f3d19c'
        }]
    },
    {
        "featureType": 'transit',
        "elementType": 'geometry',
        "stylers": [{
            "color": '#2f3948'
        }]
    },
    {
        "featureType": 'transit.station',
        "elementType": 'labels.text.fill',
        "stylers": [{
            "color": '#d59563'
        }]
    },
    {
        "featureType": 'water',
        "elementType": 'geometry',
        "stylers": [{
            "color": '#17263c'
        }]
    },
    {
        "featureType": 'water',
        "elementType": 'labels.text.fill',
        "stylers": [{
            "color": '#515c6d'
        }]
    },
    {
        "featureType": 'water',
        "elementType": 'labels.text.stroke',
        "stylers": [{
            "color": '#17263c'
        }]
    }
];

//knockout viewmodel
var ViewModel = function() {
    //  a constructor to create a new map JS object. You can use the coordinates
    //the coordinates of my city are given as center
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 30.7333,
            lng: 76.7794
        },
        zoom: 15
    });
    largeInfowindow = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds();
    var self = this;
    self.error = ko.observable(''); //knockout variable to store value if foursquare api does not load.
    chosen_loc = ko.observable(''); //knockout variable to store input value of list
    self.markers = []; //markers array has been created
    /*This function takes in a COLOR, and then creates a new marker
     icon of that color. The icon will be 21 px wide by 34 high, have an origin
     of 0, 0 and be anchored at 10, 34).*/
    self.makeMarkerIcon = function(markerColor) {
        var markerImage = new google.maps.MarkerImage('http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2', new google.maps.Size(21, 34), new google.maps.Point(0, 0), new google.maps.Point(10, 34), new google.maps.Size(21, 34));
        return markerImage;
    };
    // default colour for marker
    var defaultIcon = makeMarkerIcon('145A32');
    //when marker is clicked colour changes
    var highlightedIcon = makeMarkerIcon('0000FF');
    //Create al markers
    for (var i = 0; i < locations.length; i++) {
        // Get all the information from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        var description = locations[i].description;
        var id = locations[i].id;
        var list = locations[i].list;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: id,
            description: description,
            list: ko.observable(list),
        });
        // Push the marker to our array of markers.
        self.markers.push(marker);
        self.markers[i].setVisible(true);
        // Extend boundaries of map or each marker
        bounds.extend(marker.position);
        /* This function populates the infowindow when the marker is clicked. We'll only allow
           one infowindow which will open at the marker that is clicked, and populate based
           on that markers position.*/
        self.populateInfoWindow = function(marker, infowindow) {
            //ajax call for foursquare api
            var FsUrl = "https://api.foursquare.com/v2/venues/";
            var Client_id = "?client_id=54AWIXENLIFPEPZKIQXJU5ZE2PASMUK4WOH4FLWGKFRIDCON";
            var Client_secret = "&client_secret=R2XIWHOTTRJNWWUFIB0QBFWKXFJFJ2XNXAIC4WSWZCGGVUOL";
            var Version = "&v=20170506";
            //ajax call
            $.ajax({
                url: FsUrl + marker.id + Client_id + Client_secret + Version,
                dataType: "json",
               success: function(data) {
                    var json = data.response.venue;
                    marker.info = '<p>' + '<b>' + json.name + " , " + json.location.state + " , " + json.location.country + '</b>' + '</p>';
                    if (infowindow.marker != marker) {
                        infowindow.marker = marker;
                        infowindow.setContent(marker.info + '<img src="' + json.photos.groups[0].items[0].prefix + '200x100' + json.photos.groups[0].items[0].suffix + '">');
                        infowindow.open(map, marker);
                        infowindow.addListener('closeclick', function() {
                            infowindow.marker = null;
                        });
                    }
                },
                //if foursquare doesnt load
                error: function(e) {
                    self.error("Data Could'nt Load");
                }
            });
        };

        //  onclickick event to open the large infowindow at each marker.
        // onclickick event to change marker colour
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
            bounds.extend(this.position);
            for (var i = 0; i < self.markers.length; i++) {
                if (self.markers[i].id != this.id) {
                    self.markers[i].setIcon(defaultIcon);
                } else {
                    self.markers[i].setIcon(highlightedIcon);
                }
            }
        });
    }
    map.fitBounds(bounds); // `bounds` is a `LatLngBounds` object
    //used for filteration,when a user clicks on a particular item this function is invoked
    self.oncl = function(val) {
        for (var i = 0; i < self.markers.length; i++) {
            if (self.markers[i].id == val.id) {
                self.populateInfoWindow(markers[i], largeInfowindow);
                markers[i].setIcon(highlightedIcon);
            } else {
                markers[i].setIcon(defaultIcon);
            }
        }
    };
    self.search = function(viewModel, event) {
        if (chosen_loc().length === 0) {
            for (var i = 0; i < self.markers.length; i++) {
                self.markers[i].setVisible(true);
                self.markers[i].list(true);
                markers[i].setIcon(defaultIcon);
            }
        } else {
            for (var j = 0; j < self.markers.length; j++) {
                if (self.markers[j].title.toLowerCase().indexOf(chosen_loc().toLowerCase()) >= 0) {
                    self.markers[j].setVisible(true);
                    self.markers[j].list(true);
                    markers[j].setIcon(defaultIcon);
                } else {
                    self.markers[j].setVisible(false);
                    self.markers[j].list(false);
                    markers[j].setIcon(defaultIcon);
                }
            }
        }
        largeInfowindow.close();
    };
};