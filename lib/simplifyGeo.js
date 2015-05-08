var addDist = require('./addDist');

module.exports = function(geojson, segInMeters) {
	var withDist = addDist(geojson);
	var withSegment = addSegment(withDist, segInMeters);
	var segments = createSegments(withSegment, segInMeters);
	var segWithMinMax = findMinMax(withSegment,segments);
	var segPoints = calcSegPoint(segWithMinMax, geojson, segInMeters);
	return segPoints;
}

function createSegments(geojson, meters) {
	var maxDist = geojson.features[geojson.features.length - 1].properties.seg;
	var segs = [];
	for(i=0;i<maxDist + 1;i++) {
		segs.push({seg: i, maxPt: null, minPt: null})
	}
	return segs;
}


function addSegment(geojson, meters) {
	for(i=0;i<geojson.features.length;i++) {
		var feature = geojson.features[i];
		feature.properties.seg = Math.floor(feature.properties.dist * (1000/meters));
	}
	return geojson;
}

function findMinMax(geojson, segments) {
	for(i=0;i<geojson.features.length;i++) {
		var feat = geojson.features[i];
		for(j=0;j<segments.length;j++) {
			if(feat.properties.seg == segments[j].seg) {
				if(segments[j].maxPt == null) { segments[j].maxPt =  feat.properties.id; }
				if(segments[j].minPt == null) { segments[j].minPt =  feat.properties.id; }
				if(segments[j].maxPt < feat.properties.id) { segments[j].maxPt = feat.properties.id; }
				if(segments[j].minPt > feat.properties.id) { segments[j].minPt = feat.properties.id; }
			}
		}
	}
	return segments;
}

function calcSegPoint(segments, allPoints, segInMeters) {
	var geojson = {
		"type": "FeatureCollection",
    	"features": []
	}
	for(i=0;i<segments.length;i++) {
		if(i == 0) {
			geojson.features.push({
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates" : [
						allPoints.features[0].geometry.coordinates[0],
						allPoints.features[0].geometry.coordinates[1]
					]
				},
				"properties": {
					"id": 0,
					"dist": 0,
					"elev": allPoints.features[0].properties.ele
				}								
			})
		} else {
			var nextPt; 
			var prevPt;
			for(j=0;j<allPoints.features.length;j++) {
				var feat = allPoints.features[j];
				if(feat.properties.id == segments[i].minPt) {
					nextPt = feat;
				}
				if(feat.properties.id == segments[i-1].maxPt) {
					prevPt = feat;
				}
			}
			var point = {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates" : [
						(+prevPt.geometry.coordinates[0] + +nextPt.geometry.coordinates[0]) / 2,
						(+prevPt.geometry.coordinates[1] + +nextPt.geometry.coordinates[1]) / 2,
					]
				},
				"properties" : {
					"id": segments[i].seg,
					"dist": segments[i].seg * segInMeters,
					"elev": (+prevPt.properties.ele + +nextPt.properties.ele) / 2
				}
			}
			geojson.features.push(point)
		}
	}
	return geojson
}
