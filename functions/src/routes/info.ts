import express, { Request, Response } from "express";
import { retrieveInfo } from "../firebase/info.utils";

const router = express.Router();

router.get("/info", async (req: Request, res: Response) => {
  const { answers, ...additionalInfo } = await retrieveInfo();

  res.status(200).json({
    ok: true,
    ...additionalInfo,
    answers: {
      1: answers[1],
      2: answers[2],
      3: answers[3],
    },
  });
});

export { router as infoRouter };
