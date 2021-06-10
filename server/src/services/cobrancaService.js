const serviceHelper = require('./serviceHelper');
const connection = require('../database/connection');

const nomeTabela = 'cobranca';

module.exports = {
	async get(id) {
		return serviceHelper.get(nomeTabela, id);
	},

	async criaCobranca(idRemetente, idDestinatario, valor) {
		const cobranca = {
			idRemetente,
			idDestinatario,
			valor,
		};
		
		const { id } = await serviceHelper.create(nomeTabela, cobranca);

		return id;
	},

	async getCobrancasPendentes(idUsuario) {
		const cobrancas = await connection(nomeTabela).where({
			idDestinatario: idUsuario,
			respondida: false,
		});

		return cobrancas;
	},

	async registrarRespostaCobranca(idCobranca, pagou) {
		await connection(nomeTabela).where('id', idCobranca).update({
			respondida: true,
			paga: pagou,
		});
	}
}