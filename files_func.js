const fs = require('fs-extra');
const path = require('path');
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
		default: callback({error: "Error parsing query!", wrong_query: mess});
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
	let fileNames = [];

	fs.readdir(dir)
	.then(fileNamesList => {
		fileNames = fileNamesList;

		if(!fileNames.length){
			callback({
				action: "Update",
	        	path: dir,
	        	content: []
			});

			return;
		}

		let filePromises = fileNames.map(filename => fs.stat(path.join(dir, filename)));
		return settledAllPromise(filePromises);
	})

	.catch(err => callback({error: err.message}))

	.then(filesStats => {
		let files = fileNames.map((fileName, index) => {
			if(filesStats[index].success)
				return {
					name: fileName,
					isDir: filesStats[index].value.isDirectory(),
					size: filesStats[index].value.size,
					ctime: getFullSecond(filesStats[index].value.ctime),
				}
		}).filter(file => file);

		if(files.length)
			callback({
				action: "Update",
	        	path: dir,
	        	content: files
			});
	});
}

function returnResult(promise, opt, cb){
	promise.then(() => {
		opt.success = "Ok";
	    cb(opt);
	})
  	.catch(err => cb({error: err.message}));
}

module.exports = filesProcess;

function getFullSecond(dateFile){
	return Math.floor(Date.parse(dateFile) / 1000) * 1000;
}

function settledAllPromise(promiseArrray){

	return new Promise(function(res, rej){

		let promiseCounter = promiseArrray.length;
		let values = [];

		let successCallback = value => {
			values.push({
				success: true,
				value: value
			});
		}

		let errorCallback = error => {
			values.push({
				success: false,
				res: error
			});
		}

		let finallyCallback = () => {
			promiseCounter--;
			if(!promiseCounter)
				res(values);
		}

		promiseArrray.forEach((promise, index) => {
			if(promise instanceof Promise)
				promise.then(successCallback)
				.catch(errorCallback)
				.finally(finallyCallback)
			else{
				promiseCounter--;
				values[index] = {
					success: true,
					value: promise
				};
			}
		});
	});
}