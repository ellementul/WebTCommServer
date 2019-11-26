const fs = require("fs");
const path = require("path");
const child = require('child_process');




function filesProcess(mess, callback){
	switch(mess.action){
		case "GetDisks" : getLoaclDisk(callback); break;
		case "Create" : createFile(mess, callback); break;
		case "ReadDir" : updateDir(mess.path, callback); break;
		case "Delete" : deleteFileOrDir(mess, callback); break;
		default: callback({error: "Error parsing query!"});
	}
}

function getLoaclDisk(callback){
	child.exec('wmic logicaldisk get name', (error, stdout) => {
	    callback(
	        stdout.split('\r\r\n')
	            .filter(value => /[A-Za-z]:/.test(value))
	            .map(value => value.trim())
	    );
	});
}

function checkPath(path){
	try {
	  fs.accessSync(path);
	} catch (err) {
	  fs.mkdirSync(path)
	}
}

function createFile(opt, callback){
	checkPath(opt.path);

	let filename = path.join(opt.path, opt.name);

	fs.access(filename, function(error){
	    if (error)
			fs.writeFile(filename, "", function(err){
			    if (err)
			        callback({error: err});
			    else{
			    	opt.success = "Ok";
			        callback(opt);
			    }
			});
	    else 
	        callback({error: "The file already exists"});
    });
	
}

function deleteFileOrDir(opt, callback){
	let filename = path.join(opt.path, opt.name);

	fs.stat(filename, function(error, stats){
	    if (stats.isFile())
			deleteFile(opt, callback);
	    else
	        deleteDir(opt, callback);
    });
}

function deleteDir(opt, callback){
	let filename = path.join(opt.path, opt.name);
	
	fs.rmdir(filename, function(error){
	    if (error)
			callback({error});
	    else{
	    	opt.success = "Ok";
	        callback(opt);
	    }
    });
}

function deleteFile(opt, callback){
	let filename = path.join(opt.path, opt.name);
	
	fs.unlink(filename, function(error){
	    if (error)
			callback({error});
	    else{
	    	opt.success = "Ok";
	        callback(opt);
	    }
    });
}

function updateDir(dir, callback){
	fs.readdir(dir, function(err, items){
		if (err)
	        callback({error: err});
	    else
	        callback({
		       action: "Update",
		       path: dir,
		       content: items
		    });
	});
}

module.exports = filesProcess;