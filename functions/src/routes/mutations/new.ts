import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../../errors/bad-request-error";
import { NotFoundError } from "../../errors/not-found-error";
import {
  retrieveConversation,
  updateConversation,
} from "../../firebase/conversations.utils";
import {
  addMutationToConversation,
  retrieveLastMutation,
} from "../../firebase/mutations.utils";
import { validateRequest } from "../../middlewares/validate-request";
import { Mutation, MutationManager } from "../../services/mutation-manager";
import { TransformationManager } from "../../services/transformation-manager";

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
        throw new NotFoundError();
      }

      const lastMutation = await retrieveLastMutation(conversationId);
      if (lastMutation) {
        const offBy: number = TransformationManager
            .calculateOffBy(lastMutation, newMutation);

        if (offBy > 1) {
          throw new BadRequestError(
              "Cannot handle version of document off by more than 1",
          );
        } else if (offBy === 1) {
          TransformationManager.transform(lastMutation, newMutation);
        }
      }

      if (author === "alice") {
        newMutation.origin.alice += 1;
      } else if (author === "bob") {
        newMutation.origin.bob += 1;
      }

      addMutationToConversation(conversationId, newMutation);

      const mutatedText = MutationManager
          .mutate(conversation.text, newMutation);
      updateConversation(conversationId, mutatedText);

      res.status(201).json({ ok: true, text: mutatedText });
    },
);

export { router as newMutationRouter };
