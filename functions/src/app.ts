import {json} from "body-parser";
import cors from "cors";
import express from "express";
import "express-async-errors";

import {NotFoundError} from "./errors/not-found-error";

import {errorHandler} from "./middlewares/error-handler";

import {infoRouter} from "./routes/info";
import {newConversationRouter} from "./routes/conversations/new";
import {listMutationsRouter} from "./routes/mutations/list";
import {newMutationRouter} from "./routes/mutations/new";
import {pingRouter} from "./routes/ping";

const app = express();

app.use(cors({origin: true}));
app.use(json());

app.use(pingRouter);
app.use(infoRouter);
app.use(newConversationRouter);
app.use(listMutationsRouter);
app.use(newMutationRouter);

// app.get("/conversations", async (req: Request, res: Response) => {});

// app.delete("/conversations", async (req: Request, res: Response) => {});

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export {app};
