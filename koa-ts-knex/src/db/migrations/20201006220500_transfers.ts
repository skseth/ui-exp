import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('transfers', (table) => {
      table.increments('id').primary();
      table.string('type', 45).notNullable();
      table.string('channel', 45).notNullable();
      table.decimal('amount', 10, 2);
      table.decimal('igst', 10, 2);
      table.decimal('sgst', 10, 2);
      table.decimal('cgst', 10, 2);
      table.decimal('rounding', 10, 2);
      table.decimal('total', 10, 2);

      table.integer('version').notNullable().defaultTo(1);
      // Does not work for postgres - need to create trigger
      // see https://dev.to/morz/knex-psql-updating-timestamps-like-a-pro-2fg6

      table
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'));

      table
        .timestamp('updated_at')
        .notNullable()
        .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    })
    .createTable('transfer_items', (table) => {
      table.increments('id').primary;
      table
        .integer('transfer_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('transfers')
        .onDelete('cascade');
      table.integer('seq').notNullable();
      table.decimal('amount', 10, 2);
      table.decimal('igst', 10, 2);
      table.decimal('sgst', 10, 2);
      table.decimal('cgst', 10, 2);
      table.decimal('total', 10, 2);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('transfer_items')
    .dropTableIfExists('transfers');
}
