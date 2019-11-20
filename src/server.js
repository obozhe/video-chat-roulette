const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

app
  .use(express.static(path.join(__dirname, '/../build')))
  .get('/', () => res.sendFile(path.join(__dirname, '/../build/index.html')));

let freeClients = new Set();
let searchingClients = new Set();

io.on('connection', socket => {
  freeClients.add(socket.id);
  socket.broadcast.emit('online', io.sockets.clients().server.eio.clientsCount);

  socket.on('message', entry => {
    const data = { sender: socket.id, msg: entry.msg };
    socket.emit('message', data);
    socket.to(entry.id).emit('message', data);
  });

  socket.on('signal', ({ signal, toId }) => {
    socket.to(toId).emit('signal', signal);
  });

  socket.on('typing', toId => {
    socket.emit('typing', socket.id);
    socket.to(toId).emit('typing', socket.id);
  });

  socket.on('stop typing', toId => {
    socket.emit('stop typing');
    socket.to(toId).emit('stop typing');
  });

  socket.on('searching', toId => {
    if (toId) {
      socket.to(toId).emit('stranger disconnected');
      socket.emit('stranger disconnected');
    } else {
      freeClients.delete(socket.id);
    }
    searchingClients.add(socket.id);
    const inSearch = Array.from(searchingClients);
    if (inSearch.length >= 2) {
      const toId = inSearch[0] !== socket.id ? inSearch[0] : inSearch[1];
      socket.emit('connected', { toId, initiator: false });
      socket.to(toId).emit('connected', { toId: socket.id, initiator: true });
      searchingClients.delete(socket.id);
      searchingClients.delete(toId);
    }
  });

  socket.on('stop', toId => {
    freeClients.add(socket.id);
    if (toId) {
      socket.to(toId).emit('stranger disconnected');
      socket.emit('stranger disconnected');
    } else {
      searchingClients.delete(socket.id);
    }
  });

  socket.on('online', cb => {
    return cb(io.sockets.clients().server.eio.clientsCount);
  });

  socket.on('disconnect', () => {
    if (freeClients.has(socket.id)) return freeClients.delete(socket.id);
    if (searchingClients.has(socket.id)) return searchingClients.delete(socket.id);
    socket.broadcast.emit('online', io.sockets.clients().server.eio.clientsCount);
  });
});
