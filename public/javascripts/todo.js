//Construtor, liga o socket ao objeto
var Todo = function(socket) {
  this.socket = socket;
};

//Função que envia uma mensagem ao servidor para ser repassada aos demais
Todo.prototype.sendMessage = function(room, text) {
  var message = {
    room: room,
    text: text
  };
  //Emite o evento message ao servidor
  this.socket.emit('message', message);


//Emite o evento message ao servidor
  this.socket.emit('message', message);
};

Todo.prototype.addTask = function(message){
  this.socket.emit(message,)

}