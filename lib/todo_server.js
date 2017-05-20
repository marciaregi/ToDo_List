//Carregando módulos
var socketio = require('socket.io');
//Websocket
var io;
//Variáveis globais do servidor
//Número do guest
var guestNumber = 1;
//Apelidos
var nickNames = {};
//Nomes utilizados
var namesUsed = [];
//Salas utilizadas
var currentRoom = {};

// O módulo chat_server exporta a função listen para o módulo server.js
exports.listen = function(server) {
  //Escuta o canal a procura de novas requisições
  io = socketio.listen(server);
  io.set('log level', 1);
  //No caso de receber um evento de requisição
  io.sockets.on('connection', function (socket) {
    //Atribui um nome temporário
    guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
    //Entra na sala Lobby
    joinRoom(socket, 'Lobby');
    //Lida com envio de mensagem broadcast para todos os usuários de uma sala
    handleMessageBroadcasting(socket, nickNames);
    //Lida com tentativa de mudança de nickname
    handleNameChangeAttempts(socket, nickNames, namesUsed);
    //Lida com mudança de sala
    handleRoomJoining(socket);
    //Ao receber o evento rooms, emite o evento rooms contendo as salas
    //conectadas via websocket
    socket.on('rooms', function() {
      socket.emit('rooms', io.sockets.manager.rooms);
    });
    //Lida com encerramento de conexão de cliente
    handleClientDisconnection(socket, nickNames, namesUsed);
  });
};

//Atribui um nome Guest temporário para o usuário recém conectado
function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
  //Name = Guestx
  var name = 'Guest' + guestNumber;
  //Adiciona-se o nick utilizado no objeto nickname
  nickNames[socket.id] = name;
  //Emite o evento nameresult para o cliente confirmando o nome
  socket.emit('nameResult', {
    success: true,
    name: name
  });
  namesUsed.push(name);
  return guestNumber + 1;
}

//Entra na sala especificada
function joinRoom(socket, room) {
  //Atribui usuário um grupo de websockets identificado com room
  socket.join(room);
  //Seta o socket.id (usuário) à sala específica
  currentRoom[socket.id] = room;
  //Emite a sala para o cliente através do evento joinResult
  socket.emit('joinResult', {room: room});
  //Emite uma mensagem em broadcast para os usuários daquela sala
  socket.broadcast.to(room).emit('message', {
    text: nickNames[socket.id] + ' has joined ' + room + '.'
  });

  //Verifica os demais usuários que encontram-se na sala
  var usersInRoom = io.sockets.clients(room);
  if (usersInRoom.length > 1) {
    var usersInRoomSummary = 'Users currently in ' + room + ': ';
    //Se existe mais de um usuário, percorre a lista de usuários
    for (var index in usersInRoom) {
      //Estabelece o id do usuário
      var userSocketId = usersInRoom[index].id;
      //Se o id for diferente do id do usuário que entrou na sala
      //Coloco o nome do usuário em uma string
      if (userSocketId != socket.id) {
        if (index > 0) {
          usersInRoomSummary += ', ';
        }
        usersInRoomSummary += nickNames[userSocketId];
      }
    }
    usersInRoomSummary += '.';
    //Emite uma mensagem ao cliente indicando a lista de usuários na sala
    socket.emit('message', {text: usersInRoomSummary});
  }
}

//Função que tenta mudar o nome de um cliente
//Caso o nome não esteja sendo utilizado, a mudança é efetuada
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
  //Espera o evento nameAttemp, que sinaliza tentativa de mudança de nome
  socket.on('nameAttempt', function(name) {
    //O nome novo não pode conter Guest
    if (name.indexOf('Guest') == 0) {
      //Emite falso para o cliente através do evento nameResult
      socket.emit('nameResult', {
        success: false,
        message: 'Names cannot begin with "Guest".'
      });
    } else {
      //Verifica se o nome escolhido não existe
      if (namesUsed.indexOf(name) == -1) {
        var previousName = nickNames[socket.id];
        var previousNameIndex = namesUsed.indexOf(previousName);
        //Inclui o novo nome na lista de nicks
        namesUsed.push(name);
        //Atrela o id do cliente com o nome escolhido
        nickNames[socket.id] = name;
        //Remove o nome anterior
        delete namesUsed[previousNameIndex];
        //Envia uma mensagem ao cliente contendo sucesso
        socket.emit('nameResult', {
          success: true,
          name: name
        });
        //Envia um broadcast para todos os usuários da sala
        socket.broadcast.to(currentRoom[socket.id]).emit('message', {
          text: previousName + ' is now known as ' + name + '.'
        });

      } else { //O nome já existe, impossível mudar, envia uma mensagem
              //Sinalizando
        socket.emit('nameResult', {
          success: false,
          message: 'That name is already in use.'
        });
      }
    }
  });
}

//Função que lida com broadcasting
function handleMessageBroadcasting(socket) {
  //Espera o evento 'message'
  socket.on('message', function (message) {
    //Dispara o evento message do lado cliente para todos os
    //usuários conectados na sala
    socket.broadcast.to(message.room).emit('message', {
      text: nickNames[socket.id] + ': ' + message.text
    });
  });
}

//Função que lida com salas
function handleRoomJoining(socket) {
  //Espera o evento join
  socket.on('join', function(room) {
    //Sai da sala atual
    socket.leave(currentRoom[socket.id]);
    //Entra na nova sala
    joinRoom(socket, room.newRoom);
  });
}

//Função que lida com encerrramento de conxeção do cliente
function handleClientDisconnection(socket) {
  //Espera o evento disconnect
  socket.on('disconnect', function() {
    //Remove os atributos dos usuários da estrutura de dados
    var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
    delete namesUsed[nameIndex];
    delete nickNames[socket.id];
  });
}