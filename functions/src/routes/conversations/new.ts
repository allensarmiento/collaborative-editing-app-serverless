import express, {Request, Response} from "express";
import {body} from "express-validator";

import {db} from "../../firebase";

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

      const conversationsRef = db.ref("conversations");
      conversationsRef.push({text, original: text});

      res.status(200).json({ok: true});
    },
);

export {router as newConversationRouter};
