const usuarioService = require('../services/usuarioService');

module.exports = (socketRemetente, destinatario, autorizado, senha, callbackDest) => {
	if (!autorizado) {
		if (socketRemetente) {
			socketRemetente.emit('resultado_cobranca', `Sua cobrança para ${sDestinatario.usuario.nome} da conta ${sDestinatario.usuario.numeroConta} foi recusada`);
		}
		callbackDest({ sucesso: true, mensagem: 'Você recusou a cobrança' });
		return;
	}

	if (!bcrypt.compareSync(senha, destinatario.senha)) {
		callbackDest({ sucesso: false, mensagem: 'Erro de autentificação' });
		return;
	}

	usuarioService.transferencia(nContaDestinatario, usuario.numeroConta, valor).then(resultado => {
		if (socketRemetente) {
			socketRemetente.emit('resultado_cobranca', `Sua cobraça de ${valor} para ${sDestinatario.usuario.nome} da conta ${sDestinatario.usuario.numeroConta} foi paga`);
		}
		callbackDest(resultado);
	});
}
