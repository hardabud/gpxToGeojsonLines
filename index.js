var jf = require('jsonfile');
var fs = require('fs');

var gpx2json = require('./lib/gpx2json');
var simplifyGeo = require('./lib/simplifyGeo');
var createLines = require('./lib/createLines');

var interval = 100;

var files = fs.readdirSync('./data/gpx');

function doAll(arg, callback) {
	var name = arg.substring(0,arg.length - 4);
	convert(name)
}
function final() { console.log('Done', results); }


var results = [];

files.forEach(function(item) {
  doAll(item, function(result){
    results.push(result);
    if(results.length == files.length) {
      final();
    }
  })
});


function convert(name) {

	var gpxFile = './data/gpx/' + name + '.gpx';

	var allPoints = gpx2json(gpxFile);
	var simplePoints = simplifyGeo(allPoints, interval);
	var lines = createLines(simplePoints);


	jf.writeFile('./data/json/' + name + '.json', lines, function(err) {
		if(err) { console.log(err); }
		else { console.log('converted ' + name); }
	});

}

