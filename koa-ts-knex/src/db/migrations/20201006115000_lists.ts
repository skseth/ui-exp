import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('lists', (table) => {
      table.increments('id').primary();
      table.string('name', 45).notNullable().unique('lists_name_unique');

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
    .createTable('list_items', (table) => {
      table.increments('id').primary();
      table
        .integer('list_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('lists')
        .onDelete('cascade');
      table.string('value', 100).notNullable();
      table.string('description', 1000);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('list_items').dropTableIfExists('lists');
}
