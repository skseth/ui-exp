import Knex from 'knex';
const knexconfig = require('./knexfile');

console.log(knexconfig);
export const db = Knex(knexconfig);
