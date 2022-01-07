// Homework Assignment Week# 15: Data Visualization with Leaflet
//
// Submitted by: Ricardo G. Mora, Jr.  01/08/2022

var lastUpdate = "01/01/2022";
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
        lastUpdate = moment.unix(response2.metadata.generated/1000).format("MM/DD/YYYY");
        console.log("last updated: " + lastUpdate);
        L.geoJson(response2,{
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: feature.properties.mag * 6,
                    color: "#000000", // black
                    opacity: 0.2,
                    weight: 1,
                    stroke: true,
                    fillColor: getColor(feature.geometry.coordinates[2]),
                    fillOpacity: 0.7
                });},
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`Magnitude: <b>${feature.properties.mag}</b><br>
                                 Depth: <b>${feature.geometry.coordinates[2]} km</b><br>
                                 Location: <b>${feature.properties.place}</b><br>
                                 When: <b>${moment.unix(feature.properties.time/1000)}</b>`)
            }
        }).addTo(earthquakes);
});
console.log(lastUpdate);

// define a function to set the color of a marker based on a parameter (earthquake depth)
function getColor(param){
    if (param > 90)
        return "#BF00FF"; // violet
    else if (param > 70)
        return "#0000FF";  // blue
    else if (param > 50)
        return "#00FF00";  // green
    else if (param > 30) 
        return "#FFFF00";  // yellow
    else if (param > 10)
        return "#FF8000";  // orange
    else
        return "#FA5858";  // red
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
var legend1 = L.control({position: "bottomright"});
legend1.onAdd = function() {
    let div1 = L.DomUtil.create("div", "info legend");
    let intervals = [0, 10, 30, 50, 70, 90];
    let labels = ["<center><strong>Depth (km)</strong></center><hr>"];
    for (let i = 0; i < intervals.length; i++){
        labels.push("<i style='background: "
            + getColor(intervals[i]+1) + "'></i>"
            + intervals[i]
            + (intervals[i+1] ? " to " + intervals[i+1] + "<br>" : "+"));
    };
    div1.innerHTML = labels.join("");
    return div1;
};

// create the general information legend
var legend2 = L.control({position: "bottomleft"});
legend2.onAdd = function() {
    let div2 = L.DomUtil.create("div", "info legend");
    div2.innerHTML = "<b>Earthquake Magnitude Indicated by Circle Size</b><br>"
        + "<center>(Click on a circle for earthquake details.)</center><hr>"
        + "<center>Data Provided by the US Geological Survey</center><hr>"
        + "<center>Last Updated on " + lastUpdate + "</center>";
    return div2;
};

// display both legends on the map
legend1.addTo(myMap);
legend2.addTo(myMap);

