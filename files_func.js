const fs = require('fs-extra');
const path = require("path");
const child = require('child_process');




function filesProcess(mess, callback){
	switch(mess.action){
		case "GetDisks" : getLoaclDisk(callback); break;
		case "CreateFile" : createFile(mess, callback); break;
		case "CreateDir" : createDir(mess, callback); break;
		case "ReadDir" : updateDir(mess.path, callback); break;
		case "Move" : move(mess, callback); break;
		case "Copy" : copy(mess, callback); break;
		case "Delete" : remove(mess, callback); break;
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

function createFile(opt, callback){
	let filename = path.join(opt.path, opt.name);

	fs.createFile(filename, function(err){
	    if(err)
	        callback({error: err.message});
	    else{
	    	opt.success = "Ok";
	        callback(opt);
	    }
	});
	
}

function createDir(opt, callback){
	let filename = path.join(opt.path, opt.name);

	fs.mkdirp(filename, function(err){
	    if(err)
	        callback({error: err.message});
	    else{
	    	opt.success = "Ok";
	        callback(opt);
	    }
	});
	
}

function move(opt, callback){
	fs.move(path.join(opt.source_path, opt.name), path.join(opt.target_path, opt.name), function(err){
	    if (err){
	    	console.log(err);
	        callback({error: err.message});
	    }
	    else{
	    	opt.success = "Ok";
	        callback(opt);
	    }
	});	
}

function copy(opt, callback){
	fs.copy(path.join(opt.source_path, opt.name), path.join(opt.target_path, opt.name), function(err){
	    if (err){
	    	console.log(err);
	        callback({error: err.message});
	    }
	    else{
	    	opt.success = "Ok";
	        callback(opt);
	    }
	});	
}

function remove(opt, callback){
	let filename = path.join(opt.path, opt.name);

	fs.remove(filename, function(error){
	    if (error)
			callback({error: err.message});
	    else{
	    	opt.success = "Ok";
	        callback(opt);
	    }
    });
}

function updateDir(dir, callback){
	fs.readdir(dir, function(err, items){
		if (err)
	        callback({error: err.message});
	    else
	        callback({
		       action: "Update",
		       path: dir,
		       content: items
		    });
	});
}

module.exports = filesProcess;