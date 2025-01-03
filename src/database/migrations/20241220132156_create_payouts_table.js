/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('payouts', (table) => {
    table.increments('id').primary();
    table
      .integer('campaign_id')
      .unsigned()
      .references('id')
      .inTable('campaigns')
      .onDelete('CASCADE');
    table.string('country', 2).notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.string('currency', 3).defaultTo('EUR');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.unique(['campaign_id', 'country']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable('payouts');
};
