const io = require('socket.io-client');

export default function() {
  const socket = io.connect('http://localhost:3000');
  socket.on('error', err => console.log('socket error:', err));

  // socket.on('disconnect', () => {
  //   log('you have been disconnected');
  // });

  // socket.on('reconnect', () => {
  //   log('you have been reconnected');
  //   if (username) {
  //     socket.emit('add user', username);
  //   }
  // });

  // socket.on('reconnect_error', () => {
  //   log('attempt to reconnect has failed');
  // });

  function getId() {
    return socket.id;
  }

  function registerHandler(onMessageReceived, onTyping, onStopTyping) {
    socket.on('message', onMessageReceived);
    socket.on('typing', onTyping);
    socket.on('stop typing', onStopTyping);
  }

  function unregisterHandler() {
    socket.off('message');
  }

  function message(msg) {
    socket.emit('message', msg);
  }

  function startTyping() {
    socket.emit('typing', socket.id);
  }

  function stopTyping() {
    socket.emit('stop typing', socket.id);
  }

  return {
    getId,
    message,
    registerHandler,
    unregisterHandler,
    startTyping,
    stopTyping
  };
}
