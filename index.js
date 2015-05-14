var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var fs = require('fs');


app.get('/', function(req,res){
	res.sendFile(__dirname+'/index.html');
});



//var port = Number(process.env.PORT || 1337);
var port = 1337;

http.listen(port, function(){
	console.log('listening on port '+port);
});






/************************************************************************************************
DATA SECTION
*************************************************************************************************/


var my_data = {};



// the file where the data will be kept
var data_store = 'data.json';

function addData(key, value, callback){
	// try to read this file
	fs.readFile(data_store, 'utf-8', function(err, data){
		
		// if there's no file, make a new one
		if(err){
			console.log('no file, so we can create a new one');

			my_data = {key:value}; // set the data

			fs.writeFile(data_store, JSON.stringify(my_data), function(err){
				if(err){throw err;}
				console.log(data_store+' saved!');

				if(typeof(callback) == 'function'){ callback(); } // optional function to run after data added
			});

			return err;
		}

		// if there is a file parse its data, and then add to it
		var obj = JSON.parse(data);
		obj[key] = value; // add the data in the requested key

		console.log('added the following data: '+key+':'+value);

		// write the new version of the file
		fs.writeFile(data_store, JSON.stringify(obj), function(err){
			if(err){throw err;}
			console.log(data_store+' updated with added data');

			if(typeof(callback) == 'function'){ callback(); } // optional function to run after data added
		});
	});
}





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
			console.log(data_store+' updated with deletion');

			if(typeof(callback) == 'function'){ callback(); } // optional function to run after data removed
		});
	});
}
















/************************************************************************************************
SOCKET SECTION
*************************************************************************************************/

io.on('connection', function(socket){
	console.log('a user connected');


	socket.on('new_note',function(data){
		addData(data[0], data[1], function(){
			updateAllData();
		});
	});


	socket.on('save', function(data){
		for(var key in data){
			addData(key, data[key]);
			console.log('BOOMadd key:'+key+' data:'+data[key]);
		}
		socket.emit('saved');
	});

	socket.on('delete_note', function(key){
		removeData(key);
	});



	function updateAllData(callback){
	
		// try to read this file
		fs.readFile(data_store, 'utf-8', function(err, data){
			
			// if there's no file, log that and move along
			if(err){ console.log('no file found'); return err; }

			// if there is a file parse its data, and then get the item from it
			var obj = JSON.parse(data);

			console.log('retrieved all data');
			socket.emit('update_all_data', obj); // send out the data

			if(typeof(callback) == 'function'){ callback(); } // optional function to run after data retrieved
		});
	}
	updateAllData();





	function getData(socket, key, callback){

		// try to read this file
		fs.readFile(data_store, 'utf-8', function(err, data){
			
			// if there's no file, log that and move along
			if(err){ console.log('no file found'); return err; }

			// if there is a file parse its data, and then get the item from it
			var obj = JSON.parse(data);
			var result = obj[key];

			console.log('retrieved '+result);
			socket.emit('got_profile', [key,result]); // send out the data

			if(typeof(callback) == 'function'){ callback(); } // optional function to run after data retrieved
		});
	}

});








