import Koa from 'koa';
import path from 'path';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import logger from 'koa-logger';
import { config } from './config';
import knexConfig from './db/knexfile';
import { InitializeSchemasAndModels } from './models/BaseModel';
import { ApiErrorHandler, ApiValidationError } from './routes/Errors';
import { HealthCheckRouter } from './routes/Healthcheck';
import { ListsRouter } from './routes/Lists';

InitializeSchemasAndModels(
  'https://shop.example.com/',
  path.resolve(__dirname, 'api'),
  knexConfig
);

const app = new Koa();

const PORT = config.port;

app.use(
  cors({
    origin: '*'
  })
);
app.use(logger());
app.use(ApiErrorHandler());

app.use(
  bodyParser({
    onerror: function (err, ctx) {
      ctx.throw(new ApiValidationError('Error:' + err.message));
    }
  })
);
app.use(HealthCheckRouter.routes());
app.use(ListsRouter.routes());

const server = app
  .listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);
  })
  .on('error', (err) => {
    console.error(err);
  });

export default server;
