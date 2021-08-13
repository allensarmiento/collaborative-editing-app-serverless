import { json } from "body-parser";
import cors from "cors";
import express from "express";
import "express-async-errors";

import { NotFoundError } from "./errors/not-found-error";

import { errorHandler } from "./middlewares/error-handler";

import { infoRouter } from "./routes/info";
import { deleteConversationRouter } from "./routes/conversations/delete";
import { listConversationsRouter } from "./routes/conversations/list";
import { newConversationRouter } from "./routes/conversations/new";
import { showConversationRouter } from "./routes/conversations/show";
import { listMutationsRouter } from "./routes/mutations/list";
import { newMutationRouter } from "./routes/mutations/new";
import { pingRouter } from "./routes/ping";

const app = express();

app.use(cors({ origin: true }));
app.use(json());

app.use(pingRouter);
app.use(infoRouter);
app.use(listConversationsRouter);
app.use(newConversationRouter);
app.use(deleteConversationRouter);
app.use(showConversationRouter);
app.use(listMutationsRouter);
app.use(newMutationRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
