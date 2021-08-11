import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/ping', (req: Request, res: Response) => {
  res.status(200).json({ ok: true, msg: 'pong' });
});

export { router as pingRouter };
