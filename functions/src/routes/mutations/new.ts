import express, {Request, Response} from "express";
import {body} from "express-validator";

import {NotFoundError} from "../../errors/not-found-error";

import {db} from "../../firebase";

import {validateRequest} from "../../middlewares/validate-request";

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
      const {author, conversationId, data, origin} = req.body;

      const conversationRef = db.ref(`conversations/${conversationId}`);
      const conversationSnapshot = await conversationRef.once("value");
      if (!conversationSnapshot.exists()) {
        throw new NotFoundError();
      }

      const newMutation = {author, data, origin};
      newMutation.origin[author] += 1;
      let mutatedText = "";

      if (data.type === "insert") {
        const mutationsRef = db.ref(`mutations/${conversationId}`);
        mutationsRef.push(newMutation);

        const conversation = conversationSnapshot.val();
        mutatedText = conversation.text.slice(0, data.index) +
            data.text +
            conversation.text.slice(data.index);

        conversationRef.update({text: mutatedText, lastMutation: newMutation});
      }

      res.status(201).json({ok: true, text: mutatedText});
    },
);

export {router as newMutationRouter};
