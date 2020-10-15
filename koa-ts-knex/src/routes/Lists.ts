import Knex from 'knex';
import { Context } from 'koa';
import Router from 'koa-router';
import { List, ListItems } from '../models/List';
import { ApiBusinessError } from './Errors';

export const ListsRouter: Router = new Router();

ListsRouter.post('/lists', async (ctx: Context) => {
  ctx.body = await List.transaction(async (trx) => {
    try {
      const newgraph = await List.query(trx)
        .allowGraph('[items]')
        .insertGraph(ctx.request.body);
      return {
        id: newgraph.id
      };
    } catch (e) {
      if (e.nativeError && e.nativeError.code == 'ER_DUP_ENTRY') {
        throw new ApiBusinessError('Duplicate list name');
      } else {
        throw e;
      }
    }
  });
});

ListsRouter.get('/lists', async (ctx: Context) => {
  const query = List.query();

  query.select('id', 'name');

  query
    .withGraphFetched('[items(selectValueAndDescription, orderByValue)]')
    .modifiers({
      selectValueAndDescription(builder) {
        builder.select('value', 'description');
      },
      orderByValue(builder) {
        builder.orderBy('value');
      }
    });
  query.debug();

  ctx.body = await query;
});

ListsRouter.get('/lists/:id', async (ctx: Context) => {
  const query = List.query().findById(ctx.params.id);

  query.select('id', 'name');

  query
    .withGraphFetched('[items(selectValueAndDescription, orderByValue)]')
    .modifiers({
      selectValueAndDescription(builder) {
        builder.select('value', 'description');
      },
      orderByValue(builder) {
        builder.orderBy('value');
      }
    });
  query.debug();

  ctx.body = await query;
});

ListsRouter.patch('/lists/:id', async (ctx: Context) => {
  await List.transaction(async (trx) => {
    // Update List
    const version = ctx.request.body.version;
    ctx.request.body.version = version + 1;
    const numUpdated = await List.query()
      .findById(ctx.params.id)
      .where('version', '=', version)
      .patch(ctx.request.body);

    // optimistic concurrency check
    if (numUpdated < 1) {
      ctx.throw(new ApiBusinessError('Version mismatch'));
    }

    // update child table - ListItems
    await ListItems.query(trx).delete().where({ list_id: ctx.params.id });

    // using 'raw' knex, as objection does not allow bulk insert for mysql
    await trx
      .insert(
        ctx.request.body.items.map((item: any) => {
          return {
            list_id: ctx.params.id,
            value: item.value
          };
        })
      )
      .into('list_items');

    ctx.status = 200;
  });
});
