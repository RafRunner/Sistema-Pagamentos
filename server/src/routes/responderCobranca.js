const bcrypt = require('bcrypt');
const usuarioService = require('../services/usuarioService');
const cobrancaService = require('../services/cobrancaService');

module.exports = (socketRemetente, idCobranca, autorizado, senha, callback) => {
	(async () => {
		try {
			if (!autorizado) {
				await cobrancaService.registrarRespostaCobranca(idCobranca, false);
				if (socketRemetente) {
					socketRemetente.emit(
						'atualizacao_saldo',
						`Sua cobrança para ${destinatario.nome} da conta ${destinatario.numeroConta} de ${cobranca.valor} centavos foi recusada`,
						0
					);
				}
				callback({
					sucesso: true,
					mensagem: `Você recusou a cobrança de ${remetente.nome} no valor de ${cobranca.valor} centavos`,
				});
				return;
			}

			const cobranca = await cobrancaService.get(idCobranca);
			const remetente = await usuarioService.get(cobranca.idRemetente);
			const destinatario = await usuarioService.get(cobranca.idDestinatario);

			if (!bcrypt.compareSync(senha, destinatario.senha)) {
				callback({ sucesso: false, mensagem: 'Erro de autenticação' });
				return;
			}

			const resultado = await usuarioService.transferencia(
				destinatario.numeroConta,
				remetente.numeroConta,
				cobranca.valor
			);

			if (resultado.sucesso) {
				cobrancaService.registrarRespostaCobranca(idCobranca, true);
				if (socketRemetente) {
					socketRemetente.emit(
						'atualizacao_saldo',
						`Sua cobraça de ${cobranca.valor} centavos para ${destinatario.nome} da conta ${destinatario.numeroConta} foi paga`,
						cobranca.valor
					);
				}
			}

			callback(resultado);
		} catch (error) {
			console.error(error);
			callback({ sucesso: false, mensagem: 'Erro inesperado' });
		}
	})();
};
