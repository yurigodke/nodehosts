const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

app.get('/', (req, res) => res.json({}))

server.listen(80, '127.0.0.10', function(){
	console.log('Server running at http://127.0.0.10')
	console.log('To shutdown the server: ctrl + c')
})
