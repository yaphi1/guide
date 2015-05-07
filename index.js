var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var fs = require('fs');


app.get('/', function(req,res){
	res.sendFile(__dirname+'/index.html');
});



//var port = Number(Process.env.port || 1337);
var port = 1337;

http.listen(port, function(){
	console.log('listening on port '+port);
});






/************************************************************************************************
DATA SECTION
*************************************************************************************************/


var my_data = {};



// the file where the data will be kept
var data_store = 'data2.json';

function addData(key, value, callback){
	// try to read this file
	fs.readFile(data_store, 'utf-8', function(err, data){
		
		// if there's no file, make a new one
		if(err){
			console.log('no file, so we can create a new one');

			my_data = {key:value}; // set the data

			fs.writeFile(data_store, JSON.stringify(my_data), function(err){
				if(err){throw err;}
				console.log('data2.json saved!');

				if(typeof(callback) == 'function'){ callback(); } // optional function to run after data added
			});

			return err;
		}

		// if there is a file parse its data, and then add to it
		var obj = JSON.parse(data);
		obj[key] = value; // just adding to the data

		console.log('added the following data: '+key+':'+value);

		// some logs just to see what's going on
		// console.log('hey, the file says: '+data);
		// console.log('we can also get individual pieces like this: '+obj.a.sub1);


		// write the new version of the file
		fs.writeFile(data_store, JSON.stringify(obj), function(err){
			if(err){throw err;}
			console.log('data2.json updated with added data');

			if(typeof(callback) == 'function'){ callback(); } // optional function to run after data added
		});
	});
}
/*addData('newkey2','newvalue', function(){
	console.log('add data callback happened');
	getData('newkey2', function(){console.log('good get data callback happened');});
});*/




function removeData(key, callback){
	// try to read this file
	fs.readFile(data_store, 'utf-8', function(err, data){
		
		// if there's no file, log that and move along
		if(err){
			console.log('no file found, so nothing to delete');
			return err;
		}

		// if there is a file parse its data, and then remove the item from it
		var obj = JSON.parse(data);
		console.log('removing the following data: '+key+':'+obj[key]);
		delete obj[key];

		console.log('data removed');

		// write the new version of the file
		fs.writeFile(data_store, JSON.stringify(obj), function(err){
			if(err){throw err;}
			console.log('data2.json updated with deletion');

			if(typeof(callback) == 'function'){ callback(); } // optional function to run after data removed
		});
	});
}



function getData(socket, key, callback){
	// note that socket should only ever say socket
	// this is so that socket will be defined inside the readFile call

	
	// try to read this file
	fs.readFile(data_store, 'utf-8', function(err, data){
		
		// if there's no file, log that and move along
		if(err){
			console.log('no file found, so nothing to delete');
			return err;
		}

		// if there is a file parse its data, and then get the item from it
		var obj = JSON.parse(data);
		var result = obj[key];

		console.log('retrieved '+result);
		socket.emit('got_profile', [key,result]); // send out the data

		if(typeof(callback) == 'function'){ callback(); } // optional function to run after data retrieved
	});
}













/************************************************************************************************
SOCKET SECTION
*************************************************************************************************/

io.on('connection', function(socket){
	console.log('a user connected');


	socket.on('create_profile',function(data){
		addData(data[0], data[1]);
	});


	socket.on('request_profile',function(username){
		getData(socket, username);
	});
});








