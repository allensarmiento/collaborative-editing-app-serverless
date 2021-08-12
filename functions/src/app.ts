import {json} from "body-parser";
import cors from "cors";
import express, {Request, Response} from "express";
import "express-async-errors";

import {NotFoundError} from "./errors/not-found-error";

import {db} from "./firebase";

import {errorHandler} from "./middlewares/error-handler";

import {infoRouter} from "./routes/info";
import {listMutationsRouter} from "./routes/mutations/list";
import {pingRouter} from "./routes/ping";

const app = express();

app.use(cors({origin: true}));
app.use(json());

app.use(pingRouter);
app.use(infoRouter);
app.use(listMutationsRouter);

app.post("/mutations", async (req: Request, res: Response) => {
  const {author, conversationId, data, origin} = req.body;

  const mutationsRef = db.ref(`mutations/${conversationId}`);
  const mutationsSnapshot = await mutationsRef.once("value");

  if (!mutationsSnapshot.exists()) {
    // Throw error here
  }

  const conversationsRef = db.ref(`conversations/${conversationId}`);
  const conversationSnapshot = await conversationsRef.once("value");

  if (!conversationSnapshot.exists()) {
    // Throw error here
  }

  const lastMutation = {author, data, origin};

  mutationsRef.push(lastMutation);
  conversationsRef.update({lastMutation});

  let text = conversationSnapshot.val().text;
  text = text.slice(0, data.index) + data.text + text.slice(data.index);

  res.status(200).json({ok: true, text});
});

// app.get("/conversations", async (req: Request, res: Response) => {});

// app.delete("/conversations", async (req: Request, res: Response) => {});

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export {app};
