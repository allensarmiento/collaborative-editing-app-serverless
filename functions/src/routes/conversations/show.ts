import express, { Request, Response } from "express";
import {
  Conversation,
  retrieveConversation,
} from "../../firebase/conversations.utils";
import { retrieveLastMutation } from "../../firebase/mutations.utils";
import { Mutation } from "../../services/mutation-manager";

const router = express.Router();

router.get(
    "/conversations/:conversationId",
    async (req: Request, res: Response) => {
      const { conversationId } = req.params;

      const conversation: Conversation | null =
        await retrieveConversation(conversationId);
      const lastMutation: Mutation | null =
        await retrieveLastMutation(conversationId);
      if (conversation) {
        if (!lastMutation) {
          conversation.lastMutation = {
            author: "",
            data: {
              index: 0,
              text: conversation.text,
              type: "insert",
            },
            origin: {
              alice: 0,
              bob: 0,
            },
          };
        } else {
          conversation.lastMutation = lastMutation;
        }
      }

      res.status(200).json({ ok: true, conversation });
    },
);

export { router as showConversationRouter };
