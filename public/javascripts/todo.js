$(document).ready(function(){

});

$('#addBtn').on('click', function(){
	var nome = $('#autorInput').val();
	
	var nota = {
		nome: $('#autorInput').val(),
		descricao:  $('#descricaoInput').val(),
		prioridade: $('#prioridadeInput').val()
	};

	alert(nota.descricao);

});