import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/info', (req: Request, res: Response) => {
  res.status(200).json({
    ok: true,
    author: {
      email: process.env.EMAIL || '',
      name: process.env.NAME || '',
    },
    frontend: {
      url: process.env.FRONTEND_URL || '',
    },
    language: process.env.LANGUAGE || '',
    sources: process.env.SOURCES || '',
    answers: {
      1: process.env.ANSWER_1 || '',
      2: process.env.ANSWER_2 || '',
      3: process.env.ANSWER_3 || '',
    },
  });
});

export { router as infoRouter };
