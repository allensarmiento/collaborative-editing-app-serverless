import express, {Request, Response} from "express";
import {body} from "express-validator";

import {db} from "../../firebase";

import {NotFoundError} from "../../errors/not-found-error";

import {validateRequest} from "../../middlewares/validate-request";

const router = express.Router();

router.get(
    "/mutations",
    [
      body("conversationId")
          .not()
          .isEmpty()
          .withMessage("Conversation id is required"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const {conversationId} = req.body;

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
