import { json } from 'body-parser';
import express from 'express';
import 'express-async-errors';

import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(json());

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

export { app };
