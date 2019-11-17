var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
//app.use(express.static(path.join(__dirname, 'public')));

// Chatroom

var numUsers = 0;
let pairs = [];
let free = [];

io.on('connection', socket => {
  pairs.push(socket);

  socket.on('message', msg => {
    pairs.map(c => c.emit('message', { user: socket.id, msg }));
  });

  socket.on('typing', () => {
    pairs.map(c => c.emit('typing', socket.id));
  });

  socket.on('stop typing', () => {
    pairs.map(c => c.emit('stop typing', socket.id));
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', username => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    // echo globally that this client has left
    socket.broadcast.emit('user left', {
      username: socket.username,
      numUsers: numUsers
    });
  });
});
