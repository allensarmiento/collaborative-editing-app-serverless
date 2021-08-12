import express, {Request, Response} from "express";

import {db} from "../../firebase";

import {NotFoundError} from "../../errors/not-found-error";

const router = express.Router();

router.get(
    "/mutations/:conversationId",
    async (req: Request, res: Response) => {
      const {conversationId} = req.params;
      const ref = db.ref(`mutations/${conversationId}`);
      const snapshot = await ref.once("value");

      if (!snapshot.exists()) {
        throw new NotFoundError();
      }

      const mutations = snapshot.val();

      res.status(200).json({ok: true, mutations});
    },
);

export {router as listMutationsRouter};
