/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('campaigns', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.string('landing_page_url').notNullable();
    table.boolean('is_running').defaultTo(false);
    table.text('description').nullable();
    table.decimal('budget').nullable();
    table.decimal('daily_budget').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index(['title']);
    table.index(['landing_page_url']);
    table.index(['is_running']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable('campaigns');
};
