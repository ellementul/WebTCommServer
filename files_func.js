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

	returnResult(fs.createFile(filename), opt, callback);
}

function createDir(opt, callback){
	let filename = path.join(opt.path, opt.name);

	returnResult(fs.ensureDir(filename), opt, callback);
	
}

function move(opt, callback){
	let source = path.join(opt.source_path, opt.name);
	let target = path.join(opt.target_path, opt.name);

	returnResult(fs.move(source, target), opt, callback);	
}

function copy(opt, callback){
	let source = path.join(opt.source_path, opt.name);
	let target = path.join(opt.target_path, opt.name);

	returnResult(fs.copy(source, target), opt, callback);	
}

function remove(opt, callback){
	let filename = path.join(opt.path, opt.name);

	returnResult(fs.remove(filename), opt, callback);
}

function updateDir(dir, callback){

	fs.readdir(dir)
	.then(fileNames => {
		let files = fileNames.map(filename => fs.stat(path.join(dir, filename)));
		return Promise.all([...files, fileNames]);
	})
	.then(filesStats => {
		let fileNames = filesStats.pop();
		let files = fileNames.map((fileName, index) => {
			return {
				name: fileName,
				size: filesStats[index].size
			}
		});

		callback({
			action: "Update",
        	path: dir,
        	content: files
		});
	})
	.catch(err => callback({error: err.message}));
}

function returnResult(promise, opt, cb){
	promise.then(() => {
		opt.success = "Ok";
	    cb(opt);
	})
  	.catch(err => cb({error: err.message}));
}

module.exports = filesProcess;