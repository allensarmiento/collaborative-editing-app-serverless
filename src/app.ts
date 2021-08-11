import { json } from 'body-parser';
import express from 'express';
import 'express-async-errors';

const app = express();
app.use(json());

export { app };
