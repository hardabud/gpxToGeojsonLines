module.exports = function(geojson) {
	var newGeojson = {
		"type": "FeatureCollection",
    	"features": []
	}
	for(i=0;i<geojson.features.length;i++) {
		if(i != 0) {
			var prev = geojson.features[i - 1];
			var feat = geojson.features[i];
			newGeojson.features.push({
				"type": "Feature",
				"geometry": {
					"type": "LineString",
					"coordinates": [prev.geometry.coordinates, feat.geometry.coordinates]
				},
				"properties": {
					"id": feat.properties.id,
					"dist": feat.properties.dist,
					"pcElev": feat.properties.elev - prev.properties.elev,
					"elev": feat.properties.elev
				}
			
			})
		}
	}
	return newGeojson;
}
