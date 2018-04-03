const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
})

let users = [];
io.on('connection', socket => {
	console.log('User connect ' + Date.now());
	socket.on('setUsername', data => {
		console.log(data);
		if(!data) {
			console.log('User empty!!!');
			socket.emit('userEmpty', '<p><div class="alert alert-warning text-danger"><strong>Warning!</strong> User musn`t be empty.</div></p>');
		} else if (users.indexOf(data) > -1) {
			console.log(data);
			socket.emit('userExists', '<p class="bg-primary"> User ' +
										'<b>' + data + '</b>' +
										'already exist, choose another!</p>');
		} else {
			users.push(data);
			socket.emit('userSet', {userName: data});
		}
	});

	socket.on('message', data => {
		io.sockets.emit('newMessage', data);
	})
});

http.listen(3000, () => {
	console.log('Go 3000');
})