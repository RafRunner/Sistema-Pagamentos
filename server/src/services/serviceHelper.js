const connection = require('../database/connection');

module.exports = {
	async getBy(nomeTabela, where) {
		return connection(nomeTabela).where(where).first();
	},

	async get(nomeTabela, id) {
		return this.getBy(nomeTabela, { id });
	},

	async getByEmail(nomeTabela, email) {
		return this.getBy(nomeTabela, { email });
	},

	async create(nomeTabela, objeto) {
		try {
			const [id] = await connection(nomeTabela).insert(objeto);

			return { sucesso: true, id, error: null };
		} catch (e) {
			console.log(e);
			return { sucesso: false, id: null, error: e };
		}
	},

	async delete(nomeTabela, id) {
		if (!this.get(id)) {
			return { sucesso: false };
		}

		await connection(nomeTabela).where(id).del();

		return { sucesso: true };
	}
}