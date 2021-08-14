import express, { Request, Response } from "express";
import { deleteConversation } from "../../firebase/conversations.utils";

const router = express.Router();

router.delete(
    "/conversations/:conversationId",
    async (req: Request, res: Response) => {
      const { conversationId } = req.params;

      deleteConversation(conversationId);

      res.status(204).json({ ok: true });
    },
);

export { router as deleteConversationRouter };
