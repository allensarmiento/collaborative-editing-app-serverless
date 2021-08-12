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

      const {lastMutation} = conversationSnapshot.val();
      if (lastMutation &&
          (origin["alice"] !== lastMutation.origin["alice"] ||
          origin["bob"] !== lastMutation.origin["bob"])) {
        let offBy = 0;
        offBy += Math.abs(origin["alice"] - lastMutation.origin["alice"]);
        offBy += Math.abs(origin["bob"] - lastMutation.origin["bob"]);

        if (offBy > 1) {
          // TODO: Bad request error!!!
        }

        origin["alice"] = lastMutation.origin["alice"];
        origin["bob"] = lastMutation.origin["bob"];

        if (lastMutation.data.type === "insert") {
          if (lastMutation.data.index <= data.index) {
            data.index += lastMutation.data.text.length;
          }
        } else if (lastMutation.data.type === "delete") {
          if (lastMutation.data.index < data.index) {
            data.index -= lastMutation.data.length;
          }
        }
      }

      const newMutation = {author, data, origin};
      const mutationsRef = db.ref(`mutations/${conversationId}`);
      mutationsRef.push(newMutation);
      newMutation.origin[author] += 1;
      let mutatedText = "";
      const {text} = conversationSnapshot.val();

      if (data.type === "insert") {
        mutatedText = text.slice(0, data.index) +
            data.text +
            text.slice(data.index);
      } else if (data.type === "delete") {
        mutatedText = text.slice(0, data.index) +
            text.slice(data.index + data.length);
      }

      conversationRef.update({text: mutatedText, lastMutation: newMutation});

      res.status(201).json({ok: true, text: mutatedText});
    },
);

export {router as newMutationRouter};
