import express, {Request, Response} from "express";

import {db} from "../firebase";

const router = express.Router();

router.get("/ping", async (req: Request, res: Response) => {
  const ref = db.ref("ping");
  const snapshot = await ref.once("value");
  const msg = snapshot.val();

  res.status(200).json({ok: true, msg});
});

export {router as pingRouter};
