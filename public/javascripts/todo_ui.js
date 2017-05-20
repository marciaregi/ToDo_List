//Escapa os caracteres para evitar uma injeção de código malicioso
function divEscapedContentElement(message) {
    return $('<div></div>').text(message);
}

//Retorna uma mensagem contida em uma div específica
function divSystemContentElement(message) {
    return $('<div></div>').html('<i>' + message + '</i>');
}

//Verifica o input do usuário e toma a ação desejada
function processUserInput(todo, socket) {
    var descricao = $('#descricaoInput').val();
    var autor = $('#autorInput').val();
    var data = $('#sdataInput').val();
    var prioridade = $('#prioridadeSelect').val();
    var systemMessage = "fsd";

  //O input corresponde a um comando
    if (message.charAt(0) == '/') {
        systemMessage = todo.processCommand(message);
        if (systemMessage) {
            $('#messages').append(divSystemContentElement(systemMessage));
        }
    } else { //O input corresponde a uma mensagem
        todo
        .sendMessage($('#room').text(), message);
        $('#messages').append(divEscapedContentElement(message));
        $('#messages').scrollTop($('#messages').prop('scrollHeight'));
    }

    $('#send-message').val('');
}

//Estabelece a conexão ao servidor
var socket = io.connect();