const bcrypt = require('bcrypt');
const connection = require('../database/connection');
const serviceHelper = require('./serviceHelper');

const nomeTabela = 'usuario';

module.exports = {
	async get(id) {
		return serviceHelper.get(nomeTabela, id);
	},

	async getByNumeroConta(numeroConta) {
		return serviceHelper.getBy(nomeTabela, { numeroConta });
	},

	async create(nome, banco, numeroConta, numeroAgencia, numeroCartao, senha, saldoInicial) {
		if (!nome || !banco || !numeroConta || !numeroAgencia || !numeroCartao || !senha || !saldoInicial) {
			return { sucesso: false, mensagem: 'Por favor, informe todos os dados necessários' };
		}

		if (saldoInicial < 0) {
			return { sucesso: false, mensagem: 'Saldo inicial não pode ser negativo' };
		}

		const senhaCriptografada = await bcrypt.hash(senha, 10);

		const usuario = {
			nome,
			banco,
			numeroConta,
			numeroAgencia,
			numeroCartao,
			senha: senhaCriptografada,
			balanco: saldoInicial,
		};

		const resultado = await serviceHelper.create(nomeTabela, usuario);

		if (resultado.sucesso) {
			return { sucesso: true, mensagem: 'Usuário criado com sucesso', id: resultado.id };
		} else {
			return { sucesso: false, mensagem: 'Número da conta já está em uso' };
		}
	},

	async delete(id) {
		const resultado = await serviceHelper.delete(nomeTabela, id);

		if (resultado.sucesso) {
			return { sucesso: true, mensagem: 'Usuário deletado' };
		}
		return { sucesso: false, mensagem: 'Usuário não existe' };
	},

	// Nessas funções podemos ter certeza que a conta que está iniciando a transação existe (pela autenticação de sugurança)
	// mas temos que verificar as outras contas
	async deposito(numeroConta, valor) {
		if (valor <= 0) {
			return { sucesso: false, mensagem: 'Valor do depósito deve ser maior que 0' };
		}
		const conta = await this.getByNumeroConta(numeroConta);

		await connection(nomeTabela)
			.where('id', conta.id)
			.update({
				balanco: conta.balanco + valor,
			});

		return { sucesso: true, mensagem: 'Depósito realizada com suceeso', novoBalanco: conta.balanco + valor };
	},

	async transferencia(nContaRemetente, nContaDestinatario, valor) {
		if (valor <= 0) {
			return { sucesso: false, mensagem: 'Valor da transferência deve ser maior que 0' };
		}

		const contaRemetente = await this.getByNumeroConta(nContaRemetente);
		const contaDestinatario = await this.getByNumeroConta(nContaDestinatario);

		if (!contaDestinatario) {
			return { sucesso: false, mensagem: 'Conta destinatária não existe' };
		}

		if (contaRemetente.balanco < valor) {
			return { sucesso: false, mensagem: 'Saldo insuficiente para realizar transferência' };
		}

		await connection(nomeTabela)
			.where('id', contaRemetente.id)
			.update({
				balanco: contaRemetente.balanco - valor,
			});

		await connection(nomeTabela)
			.where('id', contaDestinatario.id)
			.update({
				balanco: contaDestinatario.balanco + valor,
			});

		return {
			sucesso: true,
			mensagem: `Transferência de ${valor} centavos para conta ${nContaDestinatario} realizada com suceeso`,
			novoBalanco: contaRemetente.balanco - valor,
		};
	},
};
