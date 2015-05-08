var parseString = require('xml2js').parseString;
var fs = require('fs');



module.exports = function(gpxFile) {
	var geojson = {
		"type": "FeatureCollection",
    	"features": []
	}
	var xml = fs.readFileSync(gpxFile, 'utf8');
	parseString(xml, function (err, result) {
		var trk = result.gpx.trk;
		var id = 0;
		for(i=0;i<trk.length;i++) {
			var trkseg = trk[i].trkseg;
			for(j=0;j<trkseg.length;j++) {
				for(k=0;k<trkseg[j].trkpt.length;k++) {
					id = id + 1;
					geojson.features.push(parseTrkpt(trkseg[j].trkpt[k], id))
				}
			}

		}
	});
	return geojson;
}


function parseTrkpt(trkpt, id) {
	var lon = Math.floor(+trkpt.$.lon * 1000000) / 1000000;
	var lat = Math.floor(+trkpt.$.lat * 1000000) / 1000000;
	return { "type": "Feature",
		"geometry": {"type": "Point", "coordinates": [lon, lat]},
		"properties": {"id": id, "ele": trkpt.ele[0], "time": trkpt.time[0]}
	}
}
