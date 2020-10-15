import fs from 'fs';
import path from 'path';
import * as csv from 'fast-csv';
import * as Knex from 'knex';

function readCSVRows(fileName: string) {
  console.log(fileName);
  return new Promise((resolve, reject) => {
    const rows: any = [];
    fs.createReadStream(fileName)
      .pipe(csv.parse({ headers: true }))
      .on('error', (error) => reject(error))
      .on('data', (row) => rows.push(row))
      .on('end', (rowCount: number) => {
        console.log(`Parsed ${rowCount} rows from ${fileName}`);
        resolve(rows);
      });
  });
}

async function loadList(knex: Knex, listName: string) {
  await knex('lists').where('name', listName).del();
  const result = await knex.insert({ name: listName }).into('lists');
  const list_id = result[0];

  const items: any = await readCSVRows(
    path.resolve(__dirname, 'lists', `${listName}.csv`)
  );

  await knex
    .insert(
      items.map((item: any) => {
        return {
          list_id: list_id,
          value: item.value,
          description: item.description
        };
      })
    )
    .into('list_items');
}

exports.seed = async function (knex: Knex) {
  await loadList(knex, 'colors');
  await loadList(knex, 'sizes');
  await loadList(knex, 'taxcategories');
  await loadList(knex, 'units');
  await loadList(knex, 'transfertypes');
};
