const io = require('socket.io-client');

export default function() {
  // const socket = io.connect('http://localhost:3000');
  const socket = io('https://video-chat-roulette.drednes.now.sh');

  socket.on('error', err => console.log('socket error:', err));

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

  function unRegisterChatHandler() {
    socket.off('message');
    socket.off('typing');
    socket.off('stop typing');
  }

  function unRegisterCommonHandler() {
    socket.off('connected');
    socket.off('stranger disconnected');
  }

  function unRegisterPeerSignal(onSignal) {
    socket.off('signal', onSignal);
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
    unRegisterChatHandler,
    unRegisterCommonHandler,
    unRegisterPeerSignal,
    startTyping,
    stopTyping,
    startSearch,
    stop,
    sendSignal,
    getOnlineUsers
  };
}
