import express, { Request, Response } from "express";
import { NotFoundError } from "../../errors/not-found-error";
import { retrieveConversationMutations } from "../../firebase/mutations.utils";

const router = express.Router();

router.get(
    "/mutations/:conversationId",
    async (req: Request, res: Response) => {
      const { conversationId } = req.params;

      const mutations = await retrieveConversationMutations(conversationId);
      if (!mutations) {
        throw new NotFoundError();
      }

      res.status(200).json({ ok: true, mutations });
    },
);

export { router as listMutationsRouter };
