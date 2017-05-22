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
  var message = $('#send-message').val();
  var systemMessage;


  Todo.sendMessage($('#room').text(), message);
  $('#messages').append(divEscapedContentElement(message));
  $('#messages').scrollTop($('#messages').prop('scrollHeight'));


  $('#send-message').val('');
}

//Estabelece a conexão ao servidor
var socket = io.connect();


$(document).ready(function(){
            var todoApp = new Todo(socket);
            $('#button').click(

            function(){
                var toAdd = $('input[name=titulo]').val();
                var toAdd2 = $('input[name=autor]').val();
                var toAdd3 = $('input[name=data]').val();
                var toAdd4 = $('input[name=prioridade]').val();
              
                var auxiliar = "Tarefa: " + toAdd + "  Autor: "+ toAdd2 + "  Data: "+ toAdd3 + "  Prioridade: "+ toAdd4;
              
              
              $("#checkbox").prop("auxiliar", true);
                 $('ol').append('<li><input type=checkbox>' + auxiliar + '</input></li>');
                 
   
            });
       
       $("input[name=auxiliar]").keyup(function(event){
          if(event.keyCode == 13){
            $("#button").click();
          }         
      });
      
      $(document).on('dblclick','li', function(){
        $(this).toggleClass('strike').fadeOut('slow');    
      });
      
      $('input').focus(function() {
        $(this).val('');
      });
      
      $('ol').sortable();  
      
    });
