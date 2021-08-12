import {json} from "body-parser";
import cors from "cors";
import express, {Request, Response} from "express";
import "express-async-errors";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const serviceAccount = require("../service-account.json");

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG!);
adminConfig.credential = admin.credential.cert(serviceAccount);
admin.initializeApp(adminConfig);

const app = express();
const db = admin.database();

app.use(cors({origin: true}));
app.use(json());

app.get("/ping", async (req: Request, res: Response) => {
  const ref = db.ref("ping");
  const snapshot = await ref.once("value");
  const msg = snapshot.val();

  res.status(200).json({ok: true, msg});
});

app.get("/info", async (req: Request, res: Response) => {
  const ref = db.ref("info");
  const snapshot = await ref.once("value");
  const info = snapshot.val();

  res.status(200).json({ok: true, ...info});
});

app.post('/mutations', async (req: Request, res: Response) => {});

app.get('/conversations', async (req: Request, res: Response) => {});

app.delete('/conversations', async (req: Request, res: Response) => {});

export const widgets = functions.https.onRequest(app);
