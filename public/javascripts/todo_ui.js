//Escapa os caracteres para evitar uma injeção de código malicioso
function divEscapedContentElement(message) {
  return $('<div></div>').text(message);
}

//Retorna uma mensagem contida em uma div específica
function divSystemContentElement(message) {
  return $('<div></div>').html('<i>' + message + '</i>');
}

//Verifica o input do usuário e toma a ação desejada
function processUserInput(chatApp, socket) {
  var descricao = $('#descricaoInput').val();
  var autor = $('#autorInput').val();
  var data = $('#sdataInput').val();
  var prioridade = $('#prioridadeSelect').val();

  var systemMessage;

  //O input corresponde a um comando
  if (message.charAt(0) == '/') {
    systemMessage = chatApp.processCommand(message);
    if (systemMessage) {
      $('#messages').append(divSystemContentElement(systemMessage));
    }
  } else { //O input corresponde a uma mensagem
    chatApp.sendMessage($('#room').text(), message);
    $('#messages').append(divEscapedContentElement(message));
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));
  }

  $('#send-message').val('');
}

//Estabelece a conexão ao servidor
var socket = io.connect();