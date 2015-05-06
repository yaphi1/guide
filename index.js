var express = require('express');
var app = express();

var http = require('http').Server(app);

var fs = require('fs');


app.get('/', function(req,res){
	res.sendFile(__dirname+'/index.html');
});



//var port = Number(Process.env.port || 1337);
var port = 1337;

http.listen(port, function(){
	console.log('listening on port '+port);
});



var my_data = {};

my_data.a = {sub1:'yup', sub2:'also yup'};
my_data.b = 2;


// try to read this file
fs.readFile('data2.json', 'utf-8', function(err, data){
	
	// if there's no file, make a new one
	if(err){
		console.log('no file, so we can create a new one');

		fs.writeFile('data2.json', JSON.stringify(my_data), function(err){
			if(err){throw err;}
			console.log('data2.json saved!');
		});

		return err;
	}

	// if there is a file parse its data, and then add to it
	var obj = JSON.parse(data);
	obj.c = "whatever"; // just adding to the data

	// some logs just to see what's going on
	console.log('hey, the file says: '+data);
	console.log('we can also get individual pieces like this: '+obj.a.sub1);
	

	// write the new version of the file
	fs.writeFile('data2.json', JSON.stringify(obj), function(err){
		if(err){throw err;}
		console.log('data2.json appended!');
	});
});






/*fs.writeFile('data.json', JSON.stringify(my_data), function(err){
	if(err){throw err;}
	console.log('data.txt saved!');
});*/


/*
fs.readFile('data.json', 'utf-8', function(err, data){
	if(err){throw err;}
	var obj = JSON.parse(data);
	console.log('hey, the file says: '+data);
	console.log('we can also get individual pieces like this: '+obj.a.sub1);
});
*/


