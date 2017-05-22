//Carregando módulos
var socketio = require('socket.io');
//Websocket
var io;


// O módulo chat_server exporta a função listen para o módulo server.js
exports.listen = function(server) {
  //Escuta o canal a procura de novas requisições
  io = socketio.listen(server);
  io.set('log level', 1);
  //No caso de receber um evento de requisição
  io.sockets.on('connection', function (socket) {

    handleMessageBroadcasting(socket);
  });
};


//Função que lida com broadcasting
function handleMessageBroadcasting(socket) {
  //Espera o evento 'message'
  socket.on('message', function (message) {
    //Dispara o evento message do lado cliente para todos os
    //usuários conectados na sala
    socket.broadcast.to(message.room).emit('message', message.text);
  });
}

