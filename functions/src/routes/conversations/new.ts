import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  addConversation,
  Conversation,
} from "../../firebase/conversations.utils";
import { validateRequest } from "../../middlewares/validate-request";

const router = express.Router();

router.post(
    "/conversations",
    [
      body("text").not().isEmpty().withMessage("Text is required"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { text } = req.body;

      const newConversation: Conversation = addConversation(text);

      res.status(200).json({ ok: true, newConversation });
    },
);

export { router as newConversationRouter };
