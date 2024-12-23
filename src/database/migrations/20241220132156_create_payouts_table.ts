import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
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
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('payouts');
}
