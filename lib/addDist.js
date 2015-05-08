var turf = require('turf');

module.exports = function (geojson) {
	for(i=0;i<geojson.features.length;i++) {
		var feature = geojson.features[i];

		var prevFeature = geojson.features[i - 1];
		if(i == 0) {
			feature.properties.distFromPrev = 0;	
		} else {
			feature.properties.distFromPrev = turf.distance(feature, prevFeature, 'kilometers');
		}
	}
	return total(geojson);

}

function total(geojson) {
	var totalDist = 0;
	for(i=0;i<geojson.features.length;i++) {
		var feature = geojson.features[i];

		totalDist = totalDist + feature.properties.distFromPrev;
		feature.properties.dist = totalDist;
	}
	return geojson;
}

