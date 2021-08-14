import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../../errors/bad-request-error";
import {
  addConversationWithId,
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
        addConversationWithId(data.text, conversationId);
        res.status(201).json({ ok: true, text: data.text });
        return;
      }

      const lastMutation = await retrieveLastMutation(conversationId);
      if (lastMutation) {
        const offBy: number = TransformationManager
            .calculateOffBy(lastMutation, newMutation);

        if (offBy > 1) {
          // TODO: Needs to be thoroughly tested if is a decent solution
          // Approach: Go back and redo the mutations until we are up to date
          const mutations: Mutation[] | null =
            await retrieveConversationMutations(conversationId);

          if (mutations) {
            let mutateIndex: number = mutations.length - 1;
            while (mutateIndex >= 0) {
              const newOrigin = newMutation.origin;
              const currentOrigin = mutations[mutateIndex].origin;
              if (newOrigin.alice === currentOrigin.alice &&
                  newOrigin.bob === currentOrigin.bob) {
                break;
              }
              mutateIndex--;
            }

            for (let i = mutateIndex + 1; i < mutations.length; i++) {
              TransformationManager.transform(mutations[i], newMutation);
            }

            TransformationManager.transform(lastMutation, newMutation);
          }
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
