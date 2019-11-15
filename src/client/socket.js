const io = require('socket.io-client');

export default function() {
  const socket = io.connect('http://localhost:3000');

  function registerHandler(onMessageReceived) {
    socket.on('message', onMessageReceived);
  }

  function unregisterHandler() {
    socket.off('message');
  }

  function registerSignal(setSignal) {
    socket.on('gotSignal', setSignal);
  }

  function unregisterSignal() {
    socket.off('gotSignal');
  }

  socket.on('error', function(err) {
    console.log('received socket error:');
    console.log(err);
  });

  function sendSignal(chatroomName, signal, cb) {
    socket.emit('signal', chatroomName, signal, cb);
  }

  function getSignals(chatroomName, cb) {
    socket.emit('getSignals', chatroomName, cb);
  }

  function register(name, cb) {
    socket.emit('register', name, cb);
  }

  function getClientId(cb) {
    socket.emit('getClientId', null, cb);
  }

  function join(chatroomName, cb) {
    socket.emit('join', chatroomName, cb);
  }

  function getStreamer(chatroomName, cb) {
    socket.emit('getStreamer', chatroomName, cb);
  }

  function startStream(chatroomName, cb) {
    socket.emit('startStream', chatroomName, cb);
  }

  function endStream(chatroomName, cb) {
    socket.emit('endStream', chatroomName, cb);
  }

  function leave(chatroomName, cb) {
    socket.emit('leave', chatroomName, cb);
  }

  function message(chatroomName, msg, tme, cb) {
    socket.emit('message', { chatroomName, message: msg, time: tme }, cb);
  }

  function addChatroom(name) {
    socket.emit('addChatroom', name);
  }

  function getOnlineUsers(chatroomName, cb) {
    socket.emit('onlineUsers', chatroomName, cb);
  }

  function getChatrooms(cb) {
    socket.emit('chatrooms', null, cb);
  }

  return {
    register,
    join,
    leave,
    message,
    getChatrooms,
    addChatroom,
    getClientId,
    registerHandler,
    getOnlineUsers,
    unregisterHandler,
    startStream,
    endStream,
    sendSignal,
    getSignals,
    registerSignal,
    getStreamer,
    unregisterSignal
  };
}
