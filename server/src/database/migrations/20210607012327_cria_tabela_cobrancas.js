exports.up = function(knex) {
	return knex.schema.createTable('cobranca', function(table) {
		table.increments();
		table.string('idRemetente').notNullable();
		table.string('idDestinatario').notNullable();
		table.integer('valor').notNullable();
		table.boolean('respondida').notNullable().defaultTo(false);
		table.boolean('paga').notNullable().defaultTo(false);
	  });
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists('cobranca');
};
