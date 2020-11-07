import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('skus', (table) => {
    table.increments('id').primary();
    table.string('code', 50).notNullable().unique('skus_code_unique');
    table.string('unit', 50);
    table.string('description', 1000);
    table.decimal('price', 10, 2);
    table.string('tax_category', 50);
    table.decimal('stock', 10, 2).notNullable().defaultTo(1);
    table.string('department', 100);

    table.integer('version').notNullable().defaultTo(0);
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
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('skus');
}
