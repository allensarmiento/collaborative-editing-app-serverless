import express, {Request, Response} from "express";

import {db} from "../firebase";

const router = express.Router();

router.get("/info", async (req: Request, res: Response) => {
  const ref = db.ref("info");
  const snapshot = await ref.once("value");
  const info = snapshot.val();

  res.status(200).json({ok: true, ...info});
});

export {router as infoRouter};
