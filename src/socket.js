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

  function registerChatHandler(onMessageReceived, onTyping, onStopTyping) {
    socket.on('message', onMessageReceived);
    socket.on('typing', onTyping);
    socket.on('stop typing', onStopTyping);
  }

  function registerCommonHandler(onConnected, onStrangerDisconnect) {
    socket.on('connected', onConnected);
    socket.on('stranger disconnected', onStrangerDisconnect);
  }

  function registerPeerSignal(onSignal) {
    socket.on('signal', onSignal);
  }

  function registerOnlineUsers(onOnline) {
    socket.on('online', onOnline);
  }

  function unRegisterPeerSignal(onSignal) {
    socket.off('signal', onSignal);
  }

  function unregisterHandler() {
    socket.off('message');
  }

  function message(msg) {
    socket.emit('message', msg);
  }

  function startTyping(toId) {
    socket.emit('typing', toId);
  }

  function stopTyping(toId) {
    socket.emit('stop typing', toId);
  }

  function startSearch(toId) {
    socket.emit('searching', toId);
  }

  function stop(toId) {
    socket.emit('stop', toId);
  }

  function sendSignal(signal) {
    socket.emit('signal', signal);
  }
  function getOnlineUsers(cb) {
    socket.emit('online', cb);
  }

  return {
    getId,
    message,
    registerChatHandler,
    registerCommonHandler,
    registerPeerSignal,
    registerOnlineUsers,
    unRegisterPeerSignal,
    unregisterHandler,
    startTyping,
    stopTyping,
    startSearch,
    stop,
    sendSignal,
    getOnlineUsers
  };
}
