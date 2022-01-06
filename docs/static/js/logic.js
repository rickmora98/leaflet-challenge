// Homework Assignment Week# 15: Data Visualization with Leaflet
//
// Submitted by: Ricardo G. Mora, Jr.  01/08/2022


// define some base layers that the user can select from
var streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
var satMap = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
	maxZoom: 20,
	attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});
var topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// create an object containing the base layers (to make them selectable)
var baseLayers = {    
    Satellite: satMap,
    Topographic: topoMap,
    Street: streetMap
};

// get tectonic plate data and put into a map layergroup
let tectonicplates = new L.layerGroup();
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(
    function(response1){
        console.log(response1);
        L.geoJson(response1, {color: "yellow", weight: 3}).addTo(tectonicplates);
});

// get earthquake data and put into a map layergroup
let earthquakes = new L.layerGroup();
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(
    function(response2){
        console.log(response2);
        L.geoJson(response2,{
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: getRadius(feature.properties.mag),
                    color: "#000000",
                    opacity: 0.2,
                    weight: 1,
                    stroke: true,
                    fillColor: getColor(feature.geometry.coordinates[2]),
                    fillOpacity: 0.5
                });},
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`Magnitude: <b>${feature.properties.mag}</b><br>
                                 Depth: <b>${feature.geometry.coordinates[2]}</b><br>
                                 Location: <b>${feature.properties.place}</b>`)
            }
        }).addTo(earthquakes);
});

// define a function to set the color of a marker based on a parameter (earthquake depth)
function getColor(param){
    if (param > 90)
        return "#FF0000";
    else if (param > 70)
        return "#FF5500";
    else if (param > 50)
        return "#FFAA00";
    else if (param > 30)  
        return "#FFFF00";
    else if (param > 10)
        return "#AAFF00";
    else
        return "#55FF00";
};

// define a function to set the radius of a marker based on a parameter (earthquake magnitude)
function getRadius(param){
    if (param == 0)
        return 1;
    else
        return param * 5;
};

// create an object containing the overlay layers (to make them selectable)
var overlays = {
    "Tectonic Plates": tectonicplates,
    "Earthquakes": earthquakes
};

// create the main map object
var myMap = L.map("map", {
    center: [37.09024, -95.712891],  // coordinates for geographic center of continental U.S.
    zoom: 5,
    layers: [streetMap, satMap, topoMap]
});

// display the map with streetMap as the default base layer and also show the earthquakes and tectonic plate lines
streetMap.addTo(myMap);
earthquakes.addTo(myMap);
tectonicplates.addTo(myMap);

// display the layer control on the map
L.control.layers(baseLayers, overlays, {collapsed:false}).addTo(myMap);

// create the depth legend
var legend = L.control({position: "bottomright"});
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let intervals = [-10, 10, 30, 50, 70, 90];
    for (let i = 0; i < intervals.length; i++){
        div.innerHTML += "<i style=background: "
            + getColor(intervals[i]) + "'></i>"
            + intervals[i]
            + (intervals[i+1] ? "km &ndash km;" + intervals[i+1] + "km<br>" : "+");
    };
    return div;
};

// display the legend on the map
legend.addTo(myMap);
