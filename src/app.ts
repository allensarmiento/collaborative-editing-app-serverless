import { json } from 'body-parser';
import express from 'express';
import 'express-async-errors';

import { NotFoundError } from './errors/not-found-error';

import { infoRouter } from './routes/info';
import { pingRouter } from './routes/ping';

const app = express();
app.use(json());

app.use(pingRouter);
app.use(infoRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

export { app };
