function doPost(e) {
  try {
    var dados = JSON.parse(e.postData.contents);

    var partes = dados.data.split('/');
    var horario = dados.horario.split(':');

    var inicio = new Date(
      parseInt(partes[2]),
      parseInt(partes[1]) - 1,
      parseInt(partes[0]),
      parseInt(horario[0]),
      parseInt(horario[1])
    );
    var fim = new Date(inicio.getTime() + 60 * 60 * 1000);

    var titulo = '[PENDENTE] ' + dados.servico + ' - ' + dados.nome;

    var descricao =
      'Cliente: ' + dados.nome + '\n' +
      'Servico: ' + dados.servico + '\n' +
      'Horario: ' + dados.horario + '\n' +
      (dados.telefone ? 'Telefone: ' + dados.telefone + '\n' : '') +
      (dados.unidade  ? 'Unidade: '  + dados.unidade  + '\n' : '') +
      '\nAguardando confirmacao da Rafa Barbershop.';

    var calendario = CalendarApp.getDefaultCalendar();
    var evento = calendario.createEvent(titulo, inicio, fim, {
      description: descricao,
      location: dados.unidade || 'Rafa Barbershop - Curitiba'
    });

    return ContentService
      .createTextOutput(JSON.stringify({ sucesso: true, id: evento.getId() }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ sucesso: false, erro: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('Rafa Barbershop API - OK');
}
