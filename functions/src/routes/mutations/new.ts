import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../../errors/bad-request-error";
import {
  addConversation,
  retrieveConversation,
  updateConversation,
} from "../../firebase/conversations.utils";
import {
  addMutationToConversation,
  retrieveConversationMutations,
  retrieveLastMutation,
} from "../../firebase/mutations.utils";
import { validateRequest } from "../../middlewares/validate-request";
import { Mutation, MutationManager } from "../../services/mutation-manager";
import { Transformer } from "../../services/transformer";

const router = express.Router();

router.post(
    "/mutations",
    [
      body("author").not().isEmpty().withMessage("Author is required"),
      body("conversationId")
          .not()
          .isEmpty()
          .withMessage("Conversation id is required"),
      body("data").isObject(),
      body("origin").isObject(),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { author, conversationId, data, origin } = req.body;
      if (author !== "alice" && author !== "bob") {
        throw new BadRequestError("Invalid author name");
      }

      const newMutation: Mutation = { author, data, origin };

      const conversation = await retrieveConversation(conversationId);
      if (!conversation) {
        // No existing conversation should create a new one and exit
        // immediately.
        const newConversation = addConversation(data.text, conversationId);
        res.status(201).json({ ok: true, text: newConversation.text });
        return;
      }

      const lastMutation = await retrieveLastMutation(conversationId);
      const isSameOrigin = Transformer
          .isSameOrigin({ prev: lastMutation, next: newMutation });
      const isDifferentDirection = Transformer
          .isDifferentDirection({ prev: lastMutation, next: newMutation });
      if (isSameOrigin && !isDifferentDirection) {
        throw new BadRequestError(
            "Attempting to modify the same document twice");
      }

      const mutationStack: Mutation[] =
          await retrieveConversationMutations(conversationId);

      MutationManager.attemptTransformations({ newMutation, mutationStack });

      addMutationToConversation({ conversationId, mutation: newMutation });

      const mutatedText = MutationManager
          .mutate(conversation.text, newMutation);

      updateConversation(conversationId, mutatedText);

      res.status(201).json({ ok: true, text: mutatedText });
    },
);

export { router as newMutationRouter };
