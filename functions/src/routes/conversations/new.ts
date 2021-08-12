import express, {Request, Response} from "express";
import {body} from "express-validator";
import {addConversation} from "../../firebase/conversations.utils";
import {validateRequest} from "../../middlewares/validate-request";

const router = express.Router();

router.post(
    "/conversations",
    [
      body("text").not().isEmpty().withMessage("Text is required"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const {text} = req.body;
      
      addConversation(text);

      res.status(200).json({ok: true});
    },
);

export {router as newConversationRouter};
