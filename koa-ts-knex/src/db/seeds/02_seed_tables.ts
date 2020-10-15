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

async function loadTableCSV(
  knex: Knex,
  tableName: string,
  transform: (csvitem: any) => any
) {
  await knex(tableName).del();
  const items: any = await readCSVRows(
    path.resolve(__dirname, 'data', `${tableName}.csv`)
  );

  await knex.insert(items.map(transform)).into(tableName);
}

exports.seed = async function (knex: Knex) {
  await loadTableCSV(knex, 'skus', (c: any) => {
    return {
      code: c.item_cd,
      unit: 'unit',
      description: c.enc_style_description,
      price: c.f_price,
      tax_category: 'Tax-5',
      stock: c.item_cl_stock,
      department: c.enc_department_description,
      version: 1
    };
  });
};
