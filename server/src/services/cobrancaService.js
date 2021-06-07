const serviceHelper = require('./serviceHelper');
const connection = require('../database/connection');

const nomeTabela = 'cobranca';

module.exports = {
	async criaCobranca(idRemetente, idDestinatario, valor) {
		const cobranca = {
			idRemetente,
			idDestinatario,
			valor,
		};
		
		await serviceHelper.create(nomeTabela, cobranca);
	},

	async getCobrancasPendentes(idUsuario) {
		const cobrancas = await connection(nomeTabela).where({
			idDestinatario: idUsuario,
			respondida: false,
		});

		return cobrancas;
	},

	async registrarRespostaCobranca(idCobranca, pagou) {
		await connection.where('id', idCobranca).update({
			respondida: true,
			paga: pagou,
		});
	}
}