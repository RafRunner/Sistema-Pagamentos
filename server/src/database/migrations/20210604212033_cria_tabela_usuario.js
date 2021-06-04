exports.up = function(knex) {
	return knex.schema.createTable('usuario', function(table) {
		table.increments();
		table.string('nome').notNullable();
		table.string('banco').notNullable();
		table.string('numeroConta').unique().notNullable();
		table.string('numeroAgencia').notNullable();
		table.string('numeroCartao').notNullable();
		table.string('senha').notNullable();
		table.integer('balanco').notNullable();
	  });
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists('usuario');
};
