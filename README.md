gpxToGeojsonLines
=================

Sport trackers often create GPX files with a lot of points. If you load them to a map there are two main problems:

*	These are points, you want a line
*	There are too many points to be rendered smoothly on online maps such as [leaflet](http://leafletjs.com/)

This tool converts your gpx files to a geojson collection of lines

How to use it
-------------

*	Clone this repo
*	Install dependencies (xml2js and jsonfile) `npm install`
*	Put your gpxfiles in `data/gpx`
*	Run `node index`
*	Your json files are in `data/json`

Default distance of the lines is 100 meters. It works fine for bike rides. For other sports such as running you might want to have shorter intervals. You can change that by opening `index.js` and change the interval (line 8) to say 50.
