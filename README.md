<h1> World Earthquakes <br> (JavaScript / Leaflet Demonstration) </h1>

This project utilizes JavaScript and the Leaflet library along with HTML and CSS to create a live website to visualize the locations,
strengths, and depths of earthquakes around the world.
The program querrys the USGS earthquake API for the last seven day's earthquake data and displays it on a map in the user's browser.
Larger magnitude earthquakes are marked by larger circles than the ones with smaller magnitudes.  Deeper quakes are represented with
lighter colors than those occurring near the surface (deeper quakes are less damaging).  The map also displays the tectonic plate
boundaries.  Three map views are available:  Street, Topographic, and Satellite Image.<br>

To run the program, click on the deployed website link below.<br>
To examine the code files, their locations are indicated in the tree below.

#### Deployed website: <br>

https://rickmora98.github.io/leaflet-challenge/ <br>

#### Folders/Files:

+ **"docs"** (this is the main folder which contains the website source code) <br>
	- *"index.html"* (website landing page) <br>
	- **"static"** (subfolder) <br>
		- **"css"** (subfolder) <br>
			- *"style.css"* (stylesheet used by "index.html")
		- **"js"** (subfolder) <br>
			- *"logic.js"* (javascript file to query USGS earthquake data and display on map)
	
The deployed website relies on the folders and files and their relative locations within the **"docs"** folder as indicated above. <br>
(Please do not delete, move, rename, or alter!) <br>

#### Default View:
<img src="/images/Default.jpg">

#### Satellite View:
<img src="/images/Satellite.jpg">

#### Topographic View:
<img src="/images/Topographic.jpg">

### Some of the JavaScript/Leaflet code employed in this website:
<img src="/images/CodeSample.jpg">

 
