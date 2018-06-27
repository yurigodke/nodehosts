const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const http = require('http');
const fs = require('fs');
const mime = require('mime');
const server = http.createServer(app);
const config = require('../api.conf.js');
const FileManager = require('./class/FileManager.js');
const HostManager = require('./class/HostManager.js');

function constructData(data, options) {
	var filterData = {};

	for (var param in options) {
		let type = options[param];

		if (data[param]) {
			var paramType = typeof data[param];
			if (paramType === 'object') {
				paramType = Array.isArray(data[param]) ? 'array' : 'object';
			}

			if (type == paramType) {
				filterData[param] = data[param]
			}
		}
	}

	return filterData;
}

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
	fs.readFile('./index.htm', (err, data) => {
		if(err){
			res.writeHead(404,{'Content-type':'text/plain'});
			res.end('Sorry the page was not found');
		}else{
			res.writeHead(200,{'Content-type':'text/html'});
			res.end(data);
		}
	})
});

app.get('/dist/*', (req, res) => {
	let pathFile = '.' + req.originalUrl;
	fs.readFile(pathFile, (err, data) => {
		if(err){
			res.writeHead(404,{'Content-type':'text/plain'});
			res.end('Sorry the page was not found');
		}else{
			let type = mime.getType(pathFile);
			res.writeHead(200,{'Content-type':type});
			res.end(data);
		}
	});
})

//api
app.get('/api/localdata', (req, res) => {
	res.writeHead(200,{'Content-type': 'application/json'});

	let fileData = FileManager.readJson('./files/config.js');
	res.end(JSON.stringify(fileData));
})

app.post('/api/localdata', (req, res) => {
	const params = {
		env: 'string'
	}

	let dataParams = constructData(req.body, params);

	let result = FileManager.writeJson('./files/config.js', dataParams);

	if (result.error) {
		res.writeHead(500,{'Content-type': 'application/json'});
		res.end(`{ "status": "${result.error}"}`);
	} else {
		HostManager.setHostData();
		res.writeHead(200,{'Content-type': 'application/json'});
		res.end('{ "status": "file writed"}');
	}
})

app.get('/api/envdata/:env', (req, res) => {
	res.writeHead(200,{'Content-type': 'application/json'});

	let enviroment = req.params.env;

	let fileData = FileManager.readJson(`./files/env.${enviroment}.js`);
	if (fileData.error) {
		fileData.message = 'Enviroment not found!';
	}
	res.end(JSON.stringify(fileData));
});

app.post('/api/envdata/:env', (req, res) => {
	const params = {
		ip: 'string',
		host: 'string',
		comment: 'string'
	}
	let enviroment = req.params.env;

	let dataParams = constructData(req.body, params);

	let result = FileManager.writeJsonList(`./files/env.${enviroment}.js`, dataParams);

	if (result.error) {
		res.writeHead(500,{'Content-type': 'application/json'});
		res.end(`{ "status": "${result.error}"}`);
	} else {
		HostManager.setHostData();
		res.writeHead(200,{'Content-type': 'application/json'});
		res.end('{ "status": "file writed"}');
	}
});

app.put('/api/envdata/:env/:id', (req, res) => {
	let enviroment = req.params.env;
	let id = req.params.id;
	const params = {
		ip: 'string',
		host: 'string',
		comment: 'string'
	};

	let dataParams = constructData(req.body, params);

	let result = FileManager.editJsonList(`./files/env.${enviroment}.js`, id, dataParams);

	if (result.error) {
		res.writeHead(500,{'Content-type': 'application/json'});
		res.end(`{ "status": "${result.error}"}`);
	} else {
		HostManager.setHostData();
		res.writeHead(200,{'Content-type': 'application/json'});
		res.end('{ "status": "file writed"}');
	}
});

app.delete('/api/envdata/:env/:id', (req, res) => {
	let enviroment = req.params.env;
	let id = req.params.id;

	let result = FileManager.deleteJsonList(`./files/env.${enviroment}.js`, id);

	if (result.error) {
		res.writeHead(500,{'Content-type': 'application/json'});
		res.end(`{ "status": "${result.error}"}`);
	} else {
		HostManager.setHostData();
		res.writeHead(200,{'Content-type': 'application/json'});
		res.end('{ "status": "file writed"}');
	}
});

server.listen(config.port, config.address, function(){
	console.log('Server running at http://' + config.address + (config.port == 80 ? '' : ':'+config.port));
	console.log('To shutdown the server: ctrl + c')
})
