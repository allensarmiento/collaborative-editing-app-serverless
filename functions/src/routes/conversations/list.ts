import express, {Request, Response} from "express";
import {Conversation, retrieveConversations} from "../../firebase/conversations.utils";

const router = express.Router();

router.get("/conversations", async (req: Request, res: Response) => {
  const conversations: Conversation[] = await retrieveConversations();
  
  return res.status(200).json({ok: true, conversations});
});

export {router as listConversationsRouter};
