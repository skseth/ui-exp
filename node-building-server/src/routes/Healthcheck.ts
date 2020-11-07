import { Context } from 'koa';
import Router from 'koa-router';

export const HealthCheckRouter = new Router();

HealthCheckRouter.get('/ping', async (ctx: Context) => {
  try {
    ctx.body = {
      status: 'success',
      data: 'pong'
    };
  } catch (e) {
    //console.error(e)
  }
});
